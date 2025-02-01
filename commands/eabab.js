const axios = require('axios');

module.exports = {
    name: 'eabab',
    description: 'Get a random eabab video',
    usage: '/eabab',
    async execute() {
        try {
            const response = await axios.get('https://shoti-v2-production.up.railway.app/api/shoti');
            return JSON.stringify({
                type: 'video',
                url: response.data.url,
                title: 'Random Video'
            });
        } catch (error) {
            throw new Error('Failed to fetch video');
        }
    }
};
