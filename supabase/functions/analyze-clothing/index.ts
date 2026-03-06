import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing imageUrl' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'url',
                  url: imageUrl,
                },
              },
              {
                type: 'text',
                text: `Analyze this clothing item and return a JSON object with:
- category: one of [tops, bottoms, outerwear, shoes, accessories]
- subcategory: specific type (e.g., "t-shirt", "jeans", "blazer")
- colors: array of color names
- seasons: array from [spring, summer, fall, winter, all-season]
- formality: one of [casual, smart_casual, formal]
- patterns: array of patterns (e.g., "solid", "striped", "floral")
- style_notes: brief description

Return only valid JSON, no markdown.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const analysisText = data.content[0].text;
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
