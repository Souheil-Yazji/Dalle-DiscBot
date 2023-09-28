const { Client, Events, GatewayIntentBits } = require('discord.js');
const OpenAIApi = require("openai");
const dotenv = require('dotenv');

const intentList = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]

const client = new Client({ intents: intentList });
const bot_token = 'YOUR_DISCORD_BOT_TOKEN'

dotenv.config();
const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});

client.once(Events.ClientReady, c => {
    console.log('Logged in ass ${client.user.tag}');
});

client.login(bot_token);

client.on('message', async (message) => {
    if (message.content.startsWith('!dalle')) {
        const query = message.content.slice(7); // remove "!dalle" prefix
        const generatedImage = await generateImage(query);
        message.channel.send({ files: [generatedImage] });
    }
})

async function generateImage(query) {
    try {
        const response = await openai.createImage({
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