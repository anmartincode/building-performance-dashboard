"""
Test runner script
"""

import sys
import os
import subprocess
import importlib

def run_simple_test():
    """Run the simple test first"""
    print("🧪 Running simple test...")
    try:
        result = subprocess.run([sys.executable, "simple_test.py"], 
                              capture_output=True, text=True, cwd=os.getcwd())
        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Simple test failed: {e}")
        return False

def install_dependencies():
    """Install missing dependencies"""
    print("🔧 Installing missing dependencies...")
    try:
        result = subprocess.run([sys.executable, "install_deps.py"], 
                              capture_output=True, text=True, cwd=os.getcwd())
        print(result.stdout)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Dependency installation failed: {e}")
        return False

def run_comprehensive_test():
    """Run comprehensive test if dependencies are available"""
    print("🧪 Running comprehensive test...")
    try:
        result = subprocess.run([sys.executable, "comprehensive_test.py"], 
                              capture_output=True, text=True, cwd=os.getcwd())
        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Comprehensive test failed: {e}")
        return False

def main():
    """Main test runner"""
    print("🏢 Building Performance Dashboard - Test Runner")
    print("="*60)
    
    # Check if we're in the backend directory
    if not os.path.exists("main.py"):
        print("❌ Error: Please run this script from the backend directory")
        print("Current directory:", os.getcwd())
        return False
    
    # Step 1: Run simple test
    print("\n📋 Step 1: Running simple test...")
    simple_success = run_simple_test()
    
    if not simple_success:
        print("❌ Simple test failed. Please check the errors above.")
        return False
    
    # Step 2: Install dependencies
    print("\n📋 Step 2: Installing dependencies...")
    deps_success = install_dependencies()
    
    if not deps_success:
        print("⚠️ Some dependencies couldn't be installed automatically.")
        print("Please install manually: pip install websockets requests")
    
    # Step 3: Run comprehensive test
    print("\n📋 Step 3: Running comprehensive test...")
    comprehensive_success = run_comprehensive_test()
    
    # Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)
    print(f"Simple Test: {'✅ PASS' if simple_success else '❌ FAIL'}")
    print(f"Dependencies: {'✅ INSTALLED' if deps_success else '⚠️ PARTIAL'}")
    print(f"Comprehensive Test: {'✅ PASS' if comprehensive_success else '❌ FAIL'}")
    
    if simple_success and comprehensive_success:
        print("\n🎉 All tests passed! Your server is ready.")
        print("\n💡 To start the server:")
        print("   python start_server.py")
        return True
    else:
        print("\n⚠️ Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 