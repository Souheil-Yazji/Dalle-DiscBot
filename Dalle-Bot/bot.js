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
    const response = await openai.createImage ({
        prompt: query,
        n: 1,
        models: 'dalle'
    })
}