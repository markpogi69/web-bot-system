module.exports = {
  command: 'greet',
  description: 'Greet someone',
  execute(args) {
    const name = args.join(' ') || 'there';
    return `👋 Hello ${name}!`;
  }
};
