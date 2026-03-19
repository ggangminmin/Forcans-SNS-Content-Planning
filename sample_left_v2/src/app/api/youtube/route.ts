import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.YOUTUBE_API_KEY;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=4&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    const items = data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumb: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    })) || [];

    return NextResponse.json(items);
  } catch (err: any) {
    console.error('[/api/youtube] Error:', err.message);
    const status = err.response?.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
