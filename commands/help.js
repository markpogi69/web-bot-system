const config = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Show available commands',
    usage: '/help [command]',
    async execute(args, commands) {
        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName);
            
            if (!command) {
                return `Command "${commandName}" not found. Use /help to see all commands.`;
            }

            let helpText = `Command: ${command.name}\n`;
            helpText += `Description: ${command.description}\n`;
            if (command.usage) helpText += `Usage: ${command.usage}\n`;
            if (command.examples) {
                helpText += `Examples:\n${command.examples.join('\n')}`;
            }
            return helpText;
        }

        const commandList = [];
        commands.forEach(cmd => {
            commandList.push(`/${cmd.name} - ${cmd.description}`);
        });

        return `Available Commands:\n\n${commandList.join('\n')}\n\nFor detailed help on a command, type: /help <command>`;
    }
};
