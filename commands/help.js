module.exports = {
  command: 'help',
  description: 'Show all commands',
  execute(args, commandList) {
    let helpText = '🤖 Available Commands:\n\n';
    commandList.forEach(cmd => {
      helpText += `/${cmd.command} - ${cmd.description}\n`;
    });
    return helpText;
  }
};
