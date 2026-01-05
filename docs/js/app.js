document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById('signal-table');
    const updateTime = document.getElementById('last-updated');
    const marketCount = document.getElementById('market-count');
    const oppCount = document.getElementById('opp-count');

    try {
        // GitHub Actions가 만든 데이터 파일 읽기
        // 캐시 방지를 위해 timestamp 추가
        const res = await fetch(`data/market_signals.json?t=${Date.now()}`);
        if (!res.ok) throw new Error("Data file not found");
        
        const data = await res.json();

        // 1. 헤더 정보 업데이트
        updateTime.innerText = new Date(data.last_updated).toLocaleString();
        marketCount.innerText = data.market_count || 0;
        oppCount.innerText = data.signals.length;

        // 2. 테이블 리셋
        tableBody.innerHTML = '';

        // 3. 데이터가 없을 경우
        if (data.signals.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">No anomalies detected in current scan.</td></tr>`;
            return;
        }

        // 4. 테이블 그리기
        data.signals.forEach(sig => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-800 transition-colors";
            
            // 색상 결정
            let badgeClass = "bg-gray-700 text-gray-300";
            if (sig.color === 'green') badgeClass = "bg-green-900 text-green-300 border border-green-700";
            if (sig.color === 'red') badgeClass = "bg-red-900 text-red-300 border border-red-700";
            if (sig.color === 'yellow') badgeClass = "bg-yellow-900 text-yellow-300 border border-yellow-700";
            if (sig.color === 'gray') badgeClass = "bg-gray-800 text-gray-500 border border-gray-700";
            
            row.innerHTML = `
                <td class="p-3">
                    <span class="text-[10px] px-2 py-1 rounded ${badgeClass} font-bold tracking-wider">
                      ${sig.type.replaceAll('_', ' ')}
                    </span>
                </td>
                <td class="p-3 font-medium text-white">
                    ${sig.market}
                    <div class="text-[10px] text-gray-500 mt-1">
                        ${sig.outcomes.map(o => `${o.outcome}: $${o.price}`).join(' | ')}
                    </div>
                </td>
                <td class="p-3 font-mono">${sig.sum.toFixed(4)}</td>
                <td class="p-3 font-mono font-bold ${sig.color === 'green' ? 'text-green-400' : 'text-red-400'}">
                    ${sig.gap}
                </td>
                <td class="p-3 text-gray-400 text-xs">${sig.message}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (e) {
        console.error(e);
        updateTime.innerText = "ERROR LOADING DATA";
        updateTime.classList.add("text-red-500");
    }
});
