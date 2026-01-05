import requests
import json

def fetch_market_snapshot():
    """
    [Basic Version]
    Fetches raw market data from Polymarket API.
    Note: Advanced arbitrage logic is processed in our private node.
    """
    url = "https://gamma-api.polymarket.com/markets?limit=10&active=true"
    print(f"📡 Connecting to {url}...")
    
    try:
        response = requests.get(url)
        data = response.json()
        print(f"✅ Successfully fetched {len(data)} markets.")
        
        # Simple display
        for m in data:
            print(f"- {m.get('question')}: Vol {m.get('volume24hr')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fetch_market_snapshot()
