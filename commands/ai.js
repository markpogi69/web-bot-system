const axios = require('axios')
const config = require('../config.json')

module.exports = {
    name: 'ai',
    description: 'Ask AI a question',
    usage: `${config.prefix}ai <question>`,
    examples: [
        `${config.prefix}ai What is the meaning of life?`,
        `${config.prefix}ai How does photosynthesis work?`
    ],
    async execute(args) {
        if (!args.length) {
            throw new Error(`Please provide a question. Usage: ${this.usage}`)
        }

        const question = args.join(' ')
        
        try {
            const response = await axios.get(`${config.aiEndpoint}/gpt?q=${encodeURIComponent(question)}`)
            return response.data.message || 'AI provided no response'
        } catch (error) {
            console.error('AI Command Error:', error.message)
            if (error.response) {
                throw new Error(`AI service error: ${error.response.status}`)
            }
            throw new Error('Failed to connect to AI service')
        }
    }
}
