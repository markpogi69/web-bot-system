const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Load commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}

// Bot endpoint
app.post('/bot', async (req, res) => {
    const message = req.body.message?.trim();

    if (!message) {
        return res.json({ response: 'Please send a message' });
    }

    if (message.startsWith('/')) {
        const [commandName, ...args] = message.slice(1).split(' ');
        const command = commands.find(cmd => cmd.command === commandName.toLowerCase());

        if (command) {
            try {
                const response = await command.execute(args, commands);
                return res.json({ response });
            } catch (error) {
                console.error('Command error:', error);
                return res.json({ response: 'An error occurred executing the command' });
            }
        }
        return res.json({ response: 'Unknown command. Type /help to see available commands.' });
    }

    // Default AI response for non-commands
    try {
        const response = await axios.get(`https://api.shizuki.linkpc.net/api/gpt?q=${encodeURIComponent(message)}`);
        const data = await response.json();
        return res.json({ response: data.message || 'No response from AI' });
    } catch (error) {
        console.error('AI Error:', error);
        return res.json({ response: 'Sorry, I could not process that message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
