const express = require('express')
const path = require('path')
const fs = require('fs')
const config = require('./config.json')
const app = express()
const PORT = config.port || 3000

app.use(express.static('public'))
app.use(express.json())

const commands = new Map()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.set(command.name, command)
}

app.post('/bot', async (req, res) => {
    const message = req.body.message?.trim()
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' })
    }

    if (message.startsWith(config.prefix)) {
        const args = message.slice(config.prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command = commands.get(commandName)

        if (!command) {
            return res.json({ 
                response: `Unknown command. Use ${config.prefix}help to see available commands.` 
            })
        }

        try {
            const response = await command.execute(args, commands)
            return res.json({ response })
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error)
            return res.status(500).json({ 
                error: 'Command execution failed' 
            })
        }
    }

    try {
        return res.json({ 
            response: "Please use a command with prefix '/'. Type /help for available commands." 
        })
    } catch (error) {
        console.error('Server Error:', error)
        return res.status(500).json({ 
            error: 'Internal server error' 
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
