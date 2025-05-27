// /api/generatePreview.js

import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();
  const { childname, lastname, childage, stylechoice, childinterests } = body;

  const storyPrompt = `Write a magical children's story featuring ${childname}, a ${childage}-year-old child who loves ${childinterests}. The story should use the stylistical model of ${stylechoice}. A whirlwind of curiosity with an explorer's satchel always slung over his shoulder. Bursting with energy and questions, he's the kind of kid who can turn a quiet library into an explosion of imagination. His pockets are always stuffed with scraps of paper covered in wild "inventions," and his wide eyes sparkle with the promise of undiscovered worlds. Addie is a graceful fairy who glows with the light of a thousand stories. Her magical quill dances through the air, leaving a trail of sparkles that whisper of ancient tales and newfound adventures. More than just a guide, Allie is the keeper of wisdom, the narrator who helps children understand the true magic of storytelling. Make it whimsical and suitable for a bedtime read.`;

  const imagePrompt = `A hardcover children's book cover titled "${childName}'s Magical Adventure", showing a child exploring a magical world with a fairy and a boy, colorful and dreamy style`;

  try {
    const [storyRes, imageRes] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: storyPrompt }],
      }),
      openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
      }),
    ]);

    const storyText = storyRes.choices[0].message.content;
    const imageUrl = imageRes.data[0].url;

    return NextResponse.json({ storyText, imageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}
