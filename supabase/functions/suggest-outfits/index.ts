import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  try {
    const { occasion, weather, wardrobeItems } = await req.json();

    if (!occasion || !wardrobeItems) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const weatherContext = weather
      ? `Weather: ${weather.temp}°C, ${weather.condition}. Consider layering and weather-appropriate items.`
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
        model: 'claude-3-5-sonnet-20241022',
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
    const suggestionsText = data.content[0].text;
    const parsed = JSON.parse(suggestionsText);

    const suggestions = parsed.map((suggestion: any) => ({
      name: suggestion.name,
      items: suggestion.item_indices.map((idx: number) => wardrobeItems[idx]),
      reasoning: suggestion.reasoning,
      occasion,
    }));

    return new Response(
      JSON.stringify({ suggestions }),
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
