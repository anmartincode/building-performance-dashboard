"""
Comprehensive test script for the real-time server
"""

import asyncio
import json
import requests
import websockets
import time
from datetime import datetime
from typing import Dict, Any

class ServerTester:
    """Comprehensive server testing class"""
    
    def __init__(self, base_url: str = "http://localhost:8000", ws_url: str = "ws://localhost:8000"):
        self.base_url = base_url
        self.ws_url = ws_url
        self.test_results = []
    
    def log_test(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        })
    
    def test_server_health(self) -> bool:
        """Test server health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.log_test("Server Health", True, f"Status: {data.get('status')}")
                return True
            else:
                self.log_test("Server Health", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Server Health", False, str(e))
            return False
    
    def test_api_documentation(self) -> bool:
        """Test if API documentation is accessible"""
        try:
            response = requests.get(f"{self.base_url}/docs", timeout=5)
            if response.status_code == 200:
                self.log_test("API Documentation", True, "Documentation accessible")
                return True
            else:
                self.log_test("API Documentation", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Documentation", False, str(e))
            return False
    
    async def test_websocket_connection(self) -> bool:
        """Test WebSocket connection"""
        try:
            uri = f"{self.ws_url}/api/v2/ws/building_a"
            async with websockets.connect(uri) as websocket:
                self.log_test("WebSocket Connection", True, "Connected successfully")
                return True
        except Exception as e:
            self.log_test("WebSocket Connection", False, str(e))
            return False
    
    async def test_sensor_data_transmission(self) -> bool:
        """Test sensor data transmission via WebSocket"""
        try:
            uri = f"{self.ws_url}/api/v2/ws/building_a"
            async with websockets.connect(uri) as websocket:
                # Create test sensor data
                sensor_data = {
                    "building_id": "building_a",
                    "sensor_id": "test_sensor_1",
                    "timestamp": datetime.now().isoformat(),
                    "temperature": 22.5,
                    "humidity": 45.0,
                    "air_quality": 85.0,
                    "energy_consumption": 250.0,
                    "power_factor": 0.95,
                    "voltage": 230.0,
                    "current": 25.0,
                    "occupancy": 30,
                    "occupancy_density": 0.5,
                    "hvac_status": "active",
                    "lighting_status": "on",
                    "hvac_efficiency": 85.0,
                    "lighting_efficiency": 90.0,
                    "location": "Test Floor 1",
                    "floor": 1,
                    "zone": "office"
                }
                
                # Send sensor data
                message = {
                    "message_type": "sensor_data",
                    "data": sensor_data,
                    "timestamp": datetime.now().isoformat(),
                    "message_id": f"test_{int(time.time())}"
                }
                
                await websocket.send(json.dumps(message))
                
                # Wait for response
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                
                if response_data.get("message_type") == "sensor_data_confirmed":
                    self.log_test("Sensor Data Transmission", True, "Data sent and confirmed")
                    return True
                else:
                    self.log_test("Sensor Data Transmission", False, f"Unexpected response: {response_data}")
                    return False
                
        except Exception as e:
            self.log_test("Sensor Data Transmission", False, str(e))
            return False
    
    def test_rest_endpoints(self) -> bool:
        """Test REST endpoints"""
        endpoints = [
            ("/api/v2/realtime/status/building_a", "Real-time Status"),
            ("/api/v2/realtime/connections", "Connection Stats"),
            ("/api/v2/realtime/alerts/building_a", "Real-time Alerts")
        ]
        
        all_success = True
        for endpoint, name in endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=5)
                if response.status_code in [200, 404]:  # 404 is OK for empty data
                    self.log_test(name, True, f"Status: {response.status_code}")
                else:
                    self.log_test(name, False, f"Status: {response.status_code}")
                    all_success = False
            except Exception as e:
                self.log_test(name, False, str(e))
                all_success = False
        
        return all_success
    
    async def test_command_transmission(self) -> bool:
        """Test command transmission via WebSocket"""
        try:
            uri = f"{self.ws_url}/api/v2/ws/building_a"
            async with websockets.connect(uri) as websocket:
                # Create test command
                command_data = {
                    "command_id": f"test_cmd_{int(time.time())}",
                    "building_id": "building_a",
                    "target_system": "hvac",
                    "command_type": "set_temperature",
                    "parameters": {"temperature": 24.0},
                    "timestamp": datetime.now().isoformat(),
                    "priority": 5
                }
                
                # Send command
                message = {
                    "message_type": "command",
                    "data": command_data,
                    "timestamp": datetime.now().isoformat(),
                    "message_id": f"cmd_{int(time.time())}"
                }
                
                await websocket.send(json.dumps(message))
                
                # Wait for response
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                
                if response_data.get("message_type") == "command_response":
                    self.log_test("Command Transmission", True, "Command sent and processed")
                    return True
                else:
                    self.log_test("Command Transmission", False, f"Unexpected response: {response_data}")
                    return False
                
        except Exception as e:
            self.log_test("Command Transmission", False, str(e))
            return False
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*50)
        print("📊 TEST SUMMARY")
        print("="*50)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "="*50)
    
    async def run_all_tests(self):
        """Run all tests"""
        print("🧪 Starting comprehensive server tests...")
        print("="*50)
        
        # Test basic server functionality
        self.test_server_health()
        self.test_api_documentation()
        
        # Test REST endpoints
        self.test_rest_endpoints()
        
        # Test WebSocket functionality
        await self.test_websocket_connection()
        await self.test_sensor_data_transmission()
        await self.test_command_transmission()
        
        # Print summary
        self.print_summary()
        
        # Return overall success
        return all(result["success"] for result in self.test_results)

async def main():
    """Main test function"""
    tester = ServerTester()
    success = await tester.run_all_tests()
    
    if success:
        print("🎉 All tests passed! Server is working correctly.")
        return 0
    else:
        print("⚠️ Some tests failed. Check the server configuration.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code) 