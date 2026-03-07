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
    let occasion: string | undefined;
    let weather: any;
    let wardrobeItems: any[];

    // Try to parse JSON body safely
    try {
      const body = await req.json();
      occasion = body.occasion;
      weather = body.weather;
      wardrobeItems = body.wardrobeItems;
    } catch (e) {
      // If JSON parsing fails, return error
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    if (!occasion || !wardrobeItems) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: occasion and wardrobeItems' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const weatherContext = weather
      ? `Weather: ${weather.temp}°F, ${weather.condition}. Consider layering and weather-appropriate items.`
      : '';

    const itemsList = wardrobeItems
      .map(
        (item: any) =>
          `- ${item.subcategory || item.category} (${item.colors.join(', ')}, ${item.formality})`
      )
      .join('\n');

    const prompt = `You are a personal stylist. The user is dressing for: "${occasion}".
${weatherContext}

Their wardrobe contains:
${itemsList}

Suggest 2-3 complete outfit combinations. For each outfit:
- Give it a creative name
- List the specific items to wear (reference by category/subcategory)
- Explain why this combination works (1-2 sentences)

Return JSON array:
[
  {
    "name": "Outfit Name",
    "item_indices": [0, 2, 5],
    "reasoning": "Why this works..."
  }
]

Return only valid JSON.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    // Log the full response for debugging
    console.log('Claude API response:', JSON.stringify(data));

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

    let suggestionsText = data.content[0].text;

    // Strip markdown code blocks if present
    // Claude sometimes wraps JSON in ```json ... ```
    suggestionsText = suggestionsText.replace(/^```json\s*/m, '').replace(/\s*```$/m, '');

    const parsed = JSON.parse(suggestionsText);

    const suggestions = parsed.map((suggestion: any) => ({
      name: suggestion.name,
      items: suggestion.item_indices.map((idx: number) => wardrobeItems[idx]),
      reasoning: suggestion.reasoning,
      occasion,
    }));

    return new Response(
      JSON.stringify({ suggestions }),
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
