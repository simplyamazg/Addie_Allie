// pages/preview.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Preview() {
  const router = useRouter();
  const [story, setStory] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (router.query.storyText && router.query.imageUrl) {
      setStory(decodeURIComponent(router.query.storyText));
      setImage(router.query.imageUrl);
    }
  }, [router.query]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📖 Your Magical Book Preview</h1>
      {image && <img src={image} alt="Book Cover" className="mb-6 w-full rounded shadow-md" />}
      <div className="whitespace-pre-wrap text-lg leading-relaxed bg-yellow-50 p-4 rounded">{story}</div>
    </div>
  );
}
