import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { messages, response_format } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    const payload = {
      model: 'gpt-5.4-mini',
      input: messages,
      tools: [{ type: 'web_search_preview' }],
      text: { 
        format: response_format?.type === 'json_object' ? { type: 'json_object' } : { type: 'text' }
      }
    };

    const response = await axios.post('https://api.openai.com/v1/responses', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    const content = response.data.output
      ?.find((o: any) => o.type === 'message')
      ?.content
      ?.find((c: any) => c.type === 'output_text')
      ?.text || '';

    return NextResponse.json({
      choices: [{
        message: { content }
      }]
    });
  } catch (err: any) {
    console.error('[/api/chat] Error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    const errorData = err.response?.data || { error: { message: err.message } };
    return NextResponse.json(errorData, { status });
  }
}
