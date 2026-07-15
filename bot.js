const { Client, Events, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const { generateImage } = require('./lib/imageGenerator');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.content.startsWith('!dalle')) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  try {
    const imageUrl = await generateImage(message.content, openai);
    await message.reply({ content: 'Here is your generated image:', files: [{ attachment: imageUrl }] });
  } catch (error) {
    console.error('Image generation failed:', error);
    await message.reply(error.message || 'Image generation failed. Please try again later.');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);