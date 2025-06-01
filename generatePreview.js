import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // ✅ Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { childName, age, interests, guide } = req.body;

    const storyPrompt = `Write a magical children's story featuring ${guide} and ${childName}, a ${age}-year-old who loves ${interests}. Make it whimsical and suitable for bedtime.`;
    const imagePrompt = `Children's book cover showing ${childName}, ${guide}, and a magical world. Colorful, imaginative, in storybook illustration style.`;

    const [storyRes, imageRes] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: storyPrompt }],
      }),
      openai.images.generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
      }),
    ]);

    return res.status(200).json({
      storyText: storyRes.choices[0].message.content,
      imageUrl: imageRes.data[0].url,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
