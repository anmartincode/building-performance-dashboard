#!/usr/bin/env node

/**
 * Cross-Platform Server Launcher
 * Automatically detects the operating system and runs the appropriate startup script
 */

const { spawn, exec } = require('child_process');
const os = require('os');
const path = require('path');

console.log('🚀 Building Performance Dashboard - Cross-Platform Launcher');
console.log('=' .repeat(60));

// Detect operating system
const platform = os.platform();
const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';

console.log(`📋 Detected OS: ${os.type()} ${os.release()}`);
console.log(`🔧 Platform: ${platform}`);

// Determine which script to run
let scriptPath;
let command;
let args;

if (isWindows) {
    // Check if PowerShell is available
    exec('powershell -Command "Get-Host"', (error) => {
        if (error) {
            console.log('🔧 Using Command Prompt (batch file)...');
            scriptPath = path.join(__dirname, 'start-servers.bat');
            command = 'cmd';
            args = ['/c', scriptPath];
        } else {
            console.log('🔧 Using PowerShell...');
            scriptPath = path.join(__dirname, 'start-servers.ps1');
            command = 'powershell';
            args = ['-ExecutionPolicy', 'Bypass', '-File', scriptPath];
        }
        runScript(command, args);
    });
} else {
    // macOS or Linux
    console.log('🔧 Using Bash script...');
    scriptPath = path.join(__dirname, 'start-servers.sh');
    
    // Check if script is executable
    const fs = require('fs');
    try {
        fs.accessSync(scriptPath, fs.constants.X_OK);
        command = scriptPath;
        args = [];
    } catch (error) {
        // Script is not executable, run with bash
        command = 'bash';
        args = [scriptPath];
    }
    runScript(command, args);
}

function runScript(command, args) {
    console.log(`🚀 Starting servers with: ${command} ${args.join(' ')}`);
    console.log('');
    
    const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true
    });
    
    child.on('error', (error) => {
        console.error(`❌ Failed to start servers: ${error.message}`);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('1. Make sure all dependencies are installed');
        console.log('2. Check if the startup scripts exist');
        console.log('3. Try running the platform-specific script manually:');
        
        if (isWindows) {
            console.log('   - start-servers.bat (Command Prompt)');
            console.log('   - start-servers.ps1 (PowerShell)');
        } else {
            console.log('   - ./start-servers.sh (Bash)');
        }
        
        process.exit(1);
    });
    
    child.on('close', (code) => {
        if (code !== 0) {
            console.log(`\n⚠️  Servers stopped with code: ${code}`);
        } else {
            console.log('\n✅ Servers stopped successfully');
        }
    });
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down servers...');
        child.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down servers...');
        child.kill('SIGTERM');
    });
} 