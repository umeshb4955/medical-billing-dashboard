import { spawn } from 'child_process';
import { platform } from 'os';

const url = 'http://localhost:3000';

// Wait a moment for server to start
setTimeout(() => {
  const os = platform();
  
  try {
    if (os === 'win32') {
      // Windows - use start command
      spawn('cmd', ['/c', 'start', 'chrome', url], { detached: true, stdio: 'ignore' });
    } else if (os === 'darwin') {
      // macOS
      spawn('open', ['-a', 'Google Chrome', url], { detached: true });
    } else {
      // Linux
      spawn('google-chrome', [url], { detached: true });
    }
    console.log(`✓ Opening ${url} in Chrome...`);
  } catch (err) {
    console.warn('Could not open Chrome automatically');
  }
}, 2000);
