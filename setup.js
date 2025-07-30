#!/usr/bin/env node

/**
 * Cross-Platform Setup Script
 * Automatically detects the operating system and runs the appropriate setup
 */

const { spawn, exec } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

console.log('🏗️ Building Performance Dashboard - Cross-Platform Setup');
console.log('=' .repeat(60));

// Detect operating system
const platform = os.platform();
const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';

console.log(`📋 Detected OS: ${os.type()} ${os.release()}`);
console.log(`🔧 Platform: ${platform}`);

// Check prerequisites
async function checkPrerequisites() {
    console.log('\n🔍 Checking prerequisites...');
    
    const checks = [
        { name: 'Python', command: isWindows ? 'python --version' : 'python3 --version' },
        { name: 'Node.js', command: 'node --version' },
        { name: 'npm', command: 'npm --version' },
        { name: 'MySQL', command: 'mysql --version' }
    ];
    
    for (const check of checks) {
        try {
            await new Promise((resolve, reject) => {
                exec(check.command, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`❌ ${check.name}: Not found`);
                        reject(error);
                    } else {
                        console.log(`✅ ${check.name}: ${stdout.trim()}`);
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.log(`\n❌ Missing prerequisite: ${check.name}`);
            console.log(`Please install ${check.name} and try again.`);
            
            if (check.name === 'Python') {
                console.log('Download from: https://www.python.org/downloads/');
            } else if (check.name === 'Node.js') {
                console.log('Download from: https://nodejs.org/');
            } else if (check.name === 'MySQL') {
                console.log('Download from: https://dev.mysql.com/downloads/');
            }
            
            process.exit(1);
        }
    }
    
    console.log('\n✅ All prerequisites are installed!');
}

// Install dependencies
async function installDependencies() {
    console.log('\n🔧 Installing dependencies...');
    
    // Install Node.js dependencies
    console.log('📦 Installing Node.js dependencies...');
    await runCommand('npm', ['install']);
    
    // Install Python dependencies
    console.log('🐍 Installing Python dependencies...');
    const pythonCmd = isWindows ? 'python' : 'python3';
    const pipCmd = isWindows ? 'python -m pip' : 'python3 -m pip';
    
    await runCommand(pipCmd.split(' ')[0], pipCmd.split(' ').slice(1).concat(['install', '--upgrade', 'pip']));
    await runCommand(pipCmd.split(' ')[0], pipCmd.split(' ').slice(1).concat(['install', '-r', 'backend/requirements.txt']));
}

// Setup database
async function setupDatabase() {
    console.log('\n🗄️ Setting up database...');
    
    const setupScript = isWindows ? 'backend/setup_database_windows.py' : 'backend/setup_database.py';
    const pythonCmd = isWindows ? 'python' : 'python3';
    
    if (!fs.existsSync(setupScript)) {
        console.log(`❌ Database setup script not found: ${setupScript}`);
        process.exit(1);
    }
    
    await runCommand(pythonCmd, [setupScript]);
}

// Run a command
function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true
        });
        
        child.on('error', (error) => {
            console.error(`❌ Failed to run ${command}: ${error.message}`);
            reject(error);
        });
        
        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`❌ ${command} exited with code ${code}`);
                reject(new Error(`Command failed with code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

// Main setup function
async function main() {
    try {
        await checkPrerequisites();
        await installDependencies();
        await setupDatabase();
        
        console.log('\n🎉 Setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Start the servers: npm run start-servers');
        console.log('2. Or use platform-specific commands:');
        
        if (isWindows) {
            console.log('   - npm run start-windows (Command Prompt)');
            console.log('   - start-servers.ps1 (PowerShell)');
        } else {
            console.log('   - npm run start-mac (Bash)');
            console.log('   - ./start-servers.sh (Bash)');
        }
        
        console.log('\n🌐 Access points:');
        console.log('   - Frontend: http://localhost:3000');
        console.log('   - Backend API: http://localhost:8000');
        console.log('   - API Docs: http://localhost:8000/docs');
        
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Setup interrupted');
    process.exit(1);
});

// Run setup
main(); 