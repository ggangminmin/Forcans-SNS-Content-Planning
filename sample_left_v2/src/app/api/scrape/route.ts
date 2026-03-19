import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    console.log(`[/api/scrape] Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    $('script, style, nav, footer, iframe, ads').remove();

    const title = $('title').text().trim();
    let text = $('body').find('h1, h2, h3, p, span').map((_, el) => $(el).text().trim()).get().join('\n');
    text = text.replace(/\n\s*\n/g, '\n').slice(0, 5000); 

    return NextResponse.json({ title, content: text });
  } catch (err: any) {
    console.error('[/api/scrape] Error:', err.message);
    return NextResponse.json({ title: 'Error', content: `URL을 읽어올 수 없습니다: ${err.message}` });
  }
}
