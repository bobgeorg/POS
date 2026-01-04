const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const clientPath = path.join(__dirname, 'client');
const buildPath = path.join(clientPath, 'build');
const srcPath = path.join(clientPath, 'src');

// Check if build directory exists
if (!fs.existsSync(buildPath)) {
    console.log('Build folder not found. Building client...');
    buildClient();
    process.exit(0);
}

// Get the most recent modification time from build folder
const buildTime = getNewestFileTime(buildPath);

// Get the most recent modification time from src folder
const srcTime = getNewestFileTime(srcPath);

// Also check package.json modification time
const packageJsonTime = fs.statSync(path.join(clientPath, 'package.json')).mtime.getTime();

if (srcTime > buildTime || packageJsonTime > buildTime) {
    console.log('Source files or dependencies changed. Rebuilding client...');
    buildClient();
} else {
    console.log('No changes detected. Skipping client build.');
}

function getNewestFileTime(dir) {
    let latestTime = 0;
    
    function traverse(directory) {
        const files = fs.readdirSync(directory);
        
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Skip node_modules and other build directories
                if (file !== 'node_modules' && file !== 'build' && file !== '.git') {
                    traverse(filePath);
                }
            } else {
                const fileTime = stat.mtime.getTime();
                if (fileTime > latestTime) {
                    latestTime = fileTime;
                }
            }
        }
    }
    
    traverse(dir);
    return latestTime;
}

function buildClient() {
    try {
        console.log('Installing dependencies...');
        execSync('npm install', { cwd: clientPath, stdio: 'inherit' });
        
        console.log('Building React application...');
        execSync('npm run build', { cwd: clientPath, stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: '--openssl-legacy-provider' } });
        
        console.log('Client build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error.message);
        process.exit(1);
    }
}
