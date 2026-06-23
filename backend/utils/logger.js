const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const logger = {
  info: (message) => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${new Date().toISOString()} - ${message}`);
  },
  error: (message) => {
    console.log(`${colors.red}[ERROR]${colors.reset} ${new Date().toISOString()} - ${message}`);
  },
  success: (message) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${new Date().toISOString()} - ${message}`);
  },
  warning: (message) => {
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${new Date().toISOString()} - ${message}`);
  }
};

module.exports = logger;
