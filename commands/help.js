const config = require('../config.json');

const header = "𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 ⚡\n━━━━━━━━━━\n\n";
const cmdHeader = "𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗗𝗲𝘁𝗮𝗶𝗹𝘀 📌\n━━━━━━━━━━\n\n";

module.exports = {
   name: 'help',
   description: 'Show available commands',
   usage: '/help [command]',
   async execute(args, commands) {
       if (args.length > 0) {
           const commandName = args[0].toLowerCase();
           const command = commands.get(commandName);
           
           if (!command) {
               return `❌ Command "${commandName}" not found. Use /help to see all commands.`;
           }

           let helpText = cmdHeader;
           helpText += `🔹 Name: ${command.name}\n`;
           helpText += `🔸 Description: ${command.description}\n`;
           if (command.usage) helpText += `📝 Usage: ${command.usage}\n`;
           if (command.examples) {
               helpText += `\n💡 Examples:\n${command.examples.map(ex => `• ${ex}`).join('\n')}`;
           }
           return helpText;
       }

       const commandList = [];
       commands.forEach(cmd => {
           commandList.push(`⭐ /${cmd.name} - ${cmd.description}`);
       });

       return `${header}${commandList.join('\n')}\n\n📌 For details, type: /help <command>`;
   }
};
