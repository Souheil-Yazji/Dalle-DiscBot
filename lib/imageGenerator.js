function normalizePrompt(input = '') {
  return input.trim().replace(/^!dalle\b\s*/i, '').trim();
}

async function generateImage(prompt, openaiClient, model = 'dall-e-3') {
  const normalizedPrompt = normalizePrompt(prompt);

  if (!normalizedPrompt) {
    throw new Error('Please provide a prompt after !dalle.');
  }

  const response = await openaiClient.images.generate({
    model,
    prompt: normalizedPrompt,
    n: 1,
    size: '1024x1024',
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error('The OpenAI API did not return an image.');
  }

  return imageUrl;
}

module.exports = {
  normalizePrompt,
  generateImage,
};
