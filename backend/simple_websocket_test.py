#!/usr/bin/env python3
"""
Simple WebSocket connection test
"""

import asyncio
import websockets
import json
from datetime import datetime

async def simple_test():
    """Simple WebSocket connection test"""
    uri = "ws://localhost:8000/api/v2/ws/building_a"
    
    try:
        print(f"🔌 Connecting to {uri}...")
        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")
            
            # Just send a simple message
            simple_message = {
                "message_type": "heartbeat",
                "data": {"test": True},
                "timestamp": datetime.now().isoformat(),
                "message_id": "simple_test"
            }
            
            print("📤 Sending simple message...")
            await websocket.send(json.dumps(simple_message))
            
            # Wait a bit
            await asyncio.sleep(2)
            
            print("✅ Test completed without errors")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(simple_test()) 