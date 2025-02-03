const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config.json');

const app = express();
const PORT = config.port || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

const commands = new Map();
let startTime = Date.now();

const loadCommands = () => {
   const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
   commands.clear();
   for (const file of commandFiles) {
       const command = require(`./commands/${file}`);
       commands.set(command.name, command);
   }
};

loadCommands();

fs.watch('./commands', (eventType, filename) => {
   if (filename) {
       delete require.cache[require.resolve(`./commands/${filename}`)];
       loadCommands();
   }
});

app.get('/status', (req, res) => {
   const uptime = Math.floor((Date.now() - startTime) / 1000);
   res.json({
       status: 'online',
       uptime,
       commandsLoaded: commands.size,
       memoryUsage: process.memoryUsage(),
       version: config.version || '1.0.0'
   });
});

app.get('/commands', (req, res) => {
   const commandList = Array.from(commands.values()).map(cmd => ({
       name: cmd.name,
       description: cmd.description,
       usage: cmd.usage
   }));
   res.json(commandList);
});

app.post('/bot', async (req, res) => {
   const message = req.body.message?.trim();
   const userId = req.body.userId || 'anonymous';

   if (!message) {
       return res.status(400).json({ error: 'Message is required' });
   }

   if (message.startsWith(config.prefix)) {
       const args = message.slice(config.prefix.length).trim().split(/ +/);
       const commandName = args.shift().toLowerCase();
       const command = commands.get(commandName);

       if (!command) {
           return res.json({
               response: `⚠️ Unknown command. Use ${config.prefix}help to see available commands.`,
               timestamp: new Date().toISOString()
           });
       }

       try {
           const response = await command.execute(args, commands, userId);
           return res.json({
               response,
               command: commandName,
               timestamp: new Date().toISOString(),
               userId
           });
       } catch (error) {
           console.error(`Error executing ${commandName}:`, error);
           return res.status(500).json({
               error: '❌ Command execution failed',
               details: error.message
           });
       }
   }

   return res.json({
       response: "ℹ️ Please use a command with prefix '/'. Type /help for available commands.",
       timestamp: new Date().toISOString()
   });
});

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({
       error: '❌ Internal server error',
       timestamp: new Date().toISOString()
   });
});

const server = app.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
   server.close(() => {
       console.log('🛑 Server shutting down');
       process.exit(0);
   });
});
