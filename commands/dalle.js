const { SlashCommandBuilder } = require('discord.js');
const { generateImage } = require('../lib/imageGenerator');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dalle')
    .setDescription('Generate an image from a prompt using OpenAI')
    .addStringOption((option) =>
      option.setName('prompt').setDescription('What should the image depict?').setRequired(true)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString('prompt');

    await interaction.deferReply();

    try {
      const imageUrl = await generateImage(prompt, openai);
      await interaction.editReply({ content: 'Here is your generated image:', files: [{ attachment: imageUrl }] });
    } catch (error) {
      console.error('Slash command image generation failed:', error);
      await interaction.editReply(error.message || 'Image generation failed. Please try again later.');
    }
  },
};
