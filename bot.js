const Discord = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Discord.Client();
const bot_token = 'YOUR_DISCORD_BOT_TOKEN'
const openai = new OpenAIApi(configuration);


client.on('ready', () => {
    console.log('Logged in ass ${client.user.tag}');
});

client.on('message', async(message) => {
    if (message.content.startsWith('!dalle')) {
        const query = message.content.slice(7); // remove "!dalle" prefix
        const generatedImage = await generateImage(query);
        message.channel.send({files: [generatedImage]});
    }
})

async function generateImage(query) {
    try {
        const response = await openai.createImage ({
            prompt: query,
            n: 1,
            model: 'dalle'
        });
    

    const imageId = response.id;
    const imageUrl = response.output.url;

    const imageResponse = await openai.retrieveImage(imageId);

    const attachment = new Discord.MessageAttachment(imageResponse, 'generated_image.png');
    return attachment;
    } catch (error) {
        console.error('An error occurred while generating the image:', error);
        throw new Error('Image generation failed. Please try again later.');
    }
}