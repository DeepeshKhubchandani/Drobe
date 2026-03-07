import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    let imageUrl: string | undefined;

    // Try to parse JSON body safely
    try {
      const body = await req.json();
      imageUrl = body.imageUrl;
    } catch (e) {
      // If JSON parsing fails, check URL params
      const url = new URL(req.url);
      imageUrl = url.searchParams.get('imageUrl') || undefined;
    }

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing imageUrl parameter' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
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
        model: 'claude-sonnet-4-5-20250929',
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

    // Check if response has error
    if (data.error) {
      return new Response(
        JSON.stringify({ error: `Claude API error: ${data.error.message}` }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if response has expected structure
    if (!data.content || !data.content[0] || !data.content[0].text) {
      return new Response(
        JSON.stringify({ error: 'Unexpected Claude API response format' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    let analysisText = data.content[0].text;

    // Strip markdown code blocks if present
    // Claude sometimes wraps JSON in ```json ... ```
    analysisText = analysisText.replace(/^```json\s*/m, '').replace(/\s*```$/m, '');

    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});
