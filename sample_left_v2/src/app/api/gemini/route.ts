import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { parts } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { contents: [{ parts }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return NextResponse.json({ text: response.data.candidates?.[0]?.content?.parts?.[0]?.text });
  } catch (err: any) {
    console.error('[/api/gemini] Error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
