const axios = require('axios');

module.exports = {
    name: 'flux',
    description: 'Generate an image based on prompt',
    usage: '/flux <prompt>',
    examples: [
        '/flux a beautiful sunset',
        '/flux cyberpunk city at night'
    ],
    async execute(args) {
        if (!args.length) {
            throw new Error('Please provide a prompt for the image generation');
        }

        const prompt = args.join(' ');
        
        try {
            const response = await axios.get(`https://api.shizuki.linkpc.net/api/fluxschnell?prompt=${encodeURIComponent(prompt)}`, {
                responseType: 'arraybuffer' // This tells axios to return the response as a buffer
            });

            // Convert the image buffer to a base64 string
            const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');

            return JSON.stringify({
                type: 'image',
                data: imageBase64, // Return the base64-encoded image data
                prompt: prompt
            });
        } catch (error) {
            throw new Error('Failed to generate image');
        }
    }
};
