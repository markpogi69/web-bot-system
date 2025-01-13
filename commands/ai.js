const fetch = require('node-fetch');

module.exports = {
  command: 'ai',
  description: 'Ask AI a question',
  async execute(args) {
    if (args.length === 0) {
      return 'Please ask a question after /ai';
    }
    const question = args.join(' ');
    try {
      const response = await fetch(`https://zvik-api-rest.onrender.com/api/gpt?q=${encodeURIComponent(question)}`);
      const data = await response.json();
      return data.message || 'No response from AI';
    } catch (error) {
      console.error('AI Error:', error);
      return 'Sorry, could not get AI response';
    }
  }
};
