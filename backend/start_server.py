"""
Simple server startup script for testing
"""

import uvicorn
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def start_server():
    """Start the FastAPI server"""
    try:
        print("🚀 Starting Building Performance Dashboard API...")
        print("�� Real-time features enabled")
        print("�� API Documentation: http://localhost:8000/docs")
        print("�� WebSocket endpoint: ws://localhost:8000/api/v2/ws/{building_id}")
        print("�� Health check: http://localhost:8000/api/health")
        
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_server()