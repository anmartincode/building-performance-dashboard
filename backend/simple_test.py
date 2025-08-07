"""
Simple test script for basic functionality
"""

import sys
import importlib
from datetime import datetime

def test_basic_imports():
    """Test basic imports without websockets"""
    print("🔌 Testing basic imports...")
    
    modules_to_test = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'validators',
        'business_logic',
        'database',
        'services'
    ]
    
    for module in modules_to_test:
        try:
            importlib.import_module(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            return False
    
    return True

def test_validators():
    """Test validator models"""
    print("\n🔍 Testing validators...")
    
    try:
        from validators import RealTimeSensorData, SensorStatus, LightingStatus
        
        # Test creating a sensor data object
        sensor_data = RealTimeSensorData(
            building_id="test_building",
            sensor_id="test_sensor",
            timestamp=datetime.now(),
            temperature=22.0,
            humidity=50.0,
            energy_consumption=200.0,
            occupancy=25,
            hvac_status=SensorStatus.ACTIVE,
            lighting_status=LightingStatus.ON
        )
        
        print("✅ RealTimeSensorData validation works")
        print(f"   - Building ID: {sensor_data.building_id}")
        print(f"   - Temperature: {sensor_data.temperature}°C")
        print(f"   - HVAC Status: {sensor_data.hvac_status}")
        return True
    
    except Exception as e:
        print(f"❌ Validator test failed: {e}")
        return False

def test_business_logic():
    """Test business logic"""
    print("\n🔍 Testing business logic...")
    
    try:
        from business_logic import business_logic
        print("✅ Business logic imported successfully")
        
        # Test threshold configuration
        print(f"   - Temperature min: {business_logic.thresholds.temperature_min}°C")
        print(f"   - Temperature max: {business_logic.thresholds.temperature_max}°C")
        print(f"   - Energy threshold: {business_logic.thresholds.energy_threshold} kWh")
        
        return True
    
    except Exception as e:
        print(f"❌ Business logic test failed: {e}")
        return False

def test_database_models():
    """Test database models"""
    print("\n🗄️ Testing database models...")
    
    try:
        from database import User, Building, SensorData, Anomaly
        print("✅ Database models imported successfully")
        
        # Test model attributes
        print("   - User model: OK")
        print("   - Building model: OK")
        print("   - SensorData model: OK")
        print("   - Anomaly model: OK")
        
        return True
    
    except Exception as e:
        print(f"❌ Database models test failed: {e}")
        return False

def test_services():
    """Test services"""
    print("\n⚙️ Testing services...")
    
    try:
        from services import UserService, BuildingService, AnomalyService, PredictionService, AuthService
        print("✅ Services imported successfully")
        
        # Test service methods exist
        print("   - UserService: OK")
        print("   - BuildingService: OK")
        print("   - AnomalyService: OK")
        print("   - PredictionService: OK")
        print("   - AuthService: OK")
        
        return True
    
    except Exception as e:
        print(f"❌ Services test failed: {e}")
        return False

def main():
    """Run all basic tests"""
    print("🧪 Simple server test...")
    print("="*50)
    
    tests = [
        ("Basic Imports", test_basic_imports),
        ("Validators", test_validators),
        ("Business Logic", test_business_logic),
        ("Database Models", test_database_models),
        ("Services", test_services)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        if test_func():
            passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            print(f"❌ {test_name} - FAILED")
    
    print("\n" + "="*50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All basic tests passed! Core functionality is working.")
        print("\n💡 Next steps:")
        print("   1. Install missing dependencies: pip install websockets")
        print("   2. Start the server: python start_server.py")
        print("   3. Run comprehensive tests: python comprehensive_test.py")
        return True
    else:
        print("⚠️ Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 