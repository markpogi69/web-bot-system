module.exports = {
  command: 'time',
  description: 'Show current time',
  execute() {
    return `🕒 Current time: ${new Date().toLocaleTimeString()}`;
  }
};