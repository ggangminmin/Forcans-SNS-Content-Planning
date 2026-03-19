import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    console.log(`[/api/trend] Hunting viral trends for: ${keyword}`);

    // GPT-4o나 gpt-5.4-mini를 사용하여 실시간 트렌드 정보를 "검색 기반"으로 생성 (OpenAI Search 활용)
    const payload = {
      model: 'gpt-5.4-mini',
      input: [
        { role: 'system', content: '당신은 실시간 트렌드 분석 전문가입니다. 반드시 JSON 포맷으로 응답하세요.' },
        { role: 'user', content: `${keyword} 상품과 관련된 현재 대한민국의 실시간 구글 트렌드, 뉴스, SNS 이슈를 검색하여 아래 구조의 JSON으로 출력하세요. 
        {
          "trending_issues": [ { "title": "이슈명", "summary": "내용 요약", "source": "출처명", "url": "원문링크" } ],
          "keywords": [ { "keyword": "키워드", "reason": "이유" } ],
          "hashtags": ["#태그1", "#태그2"],
          "content_ideas": [ { "platform": "인스타/숏츠/블로그", "idea": "소재 아이디어", "angle": "공략 각도" } ]
        }
        반드시 허구의 정보가 아닌 검색을 통해 실재하는 트렌드를 반영하세요.` }
      ],
      tools: [{ type: 'web_search_preview' }],
      text: { format: { type: 'json_object' } }
    };

    const response = await axios.post('https://api.openai.com/v1/responses', payload, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }
    });

    const content = response.data.output
      ?.find((o: any) => o.type === 'message')
      ?.content
      ?.find((c: any) => c.type === 'output_text')
      ?.text || '{}';

    return NextResponse.json(JSON.parse(content));
  } catch (err: any) {
    console.error('[/api/trend] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
