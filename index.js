// pages/index.js

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({ childname: '', lastname: '', childage: '', stylechoice: '', childinterests: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/generatePreview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push({
        pathname: '/preview',
        query: {
          storyText: encodeURIComponent(data.storyText),
          imageUrl: data.imageUrl,
        },
      });
    } else {
      alert('Error generating preview');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Your Magical Story</h1>
      <input placeholder="Child's Name" onChange={(e) => setForm({ ...form, childname: e.target.value })} className="border p-2 mb-2 w-full" />
      <input placeholder="Age" onChange={(e) => setForm({ ...form, childage: e.target.value })} className="border p-2 mb-2 w-full" />
      <input placeholder="Choice" onChange={(e) => setForm({ ...form, stylechoice: e.target.value })} className="border p-2 mb-2 w-full" />
      <input placeholder="Interests" onChange={(e) => setForm({ ...form, childinterests: e.target.value })} className="border p-2 mb-4 w-full" />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Crafting Magic..." : "Generate Book Preview"}
      </button>
    </div>
  );
}
