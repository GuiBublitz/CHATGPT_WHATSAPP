const OpenAI = require('openai');
const openai = new OpenAI();

async function gptHandler(message) {
    try {

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message}
            ]
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error in generating response from GPT:', error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}

module.exports = gptHandler;