# Supabase Edge Functions Setup

You need to deploy 3 Edge Functions to Supabase for AI and weather features to work.

## How to Deploy

Go to your Supabase Dashboard → **Edge Functions** → **New Function**

---

## 1. analyze-clothing

**Purpose:** Uses Claude Vision API to auto-categorize uploaded clothing photos

**Function Name:** `analyze-clothing`

**Code:** See implementation plan lines 283-360 or paste this:

```typescript
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
```

**Environment Variable:** Set `ANTHROPIC_API_KEY` in Supabase Edge Function secrets

---

## 2. suggest-outfits

**Purpose:** Uses Claude API to generate outfit combinations based on wardrobe + occasion + weather

**Function Name:** `suggest-outfits`

**Code:** See implementation plan lines 366-473 or paste this:

```typescript
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
```

**Environment Variable:** Uses same `ANTHROPIC_API_KEY`

---

## 3. get-weather

**Purpose:** Proxies OpenWeatherMap API to fetch weather data without exposing API key

**Function Name:** `get-weather`

**Code:** See implementation plan lines 479-534 or paste this:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

serve(async (req) => {
  try {
    const { location } = await req.json();

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Missing location' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const weather = {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      precipitation_probability: data.pop || 0,
      wind_speed: data.wind.speed,
      icon: data.weather[0].icon,
    };

    return new Response(
      JSON.stringify({ weather }),
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
```

**Environment Variable:** Set `OPENWEATHER_API_KEY` in Supabase Edge Function secrets

---

## Environment Variables

In Supabase Dashboard → **Edge Functions** → **Settings** → **Secrets**, add:

1. `ANTHROPIC_API_KEY` - Your Anthropic API key
2. `OPENWEATHER_API_KEY` - Your OpenWeatherMap API key (get free at openweathermap.org)

---

## Testing

After deployment, you can test Edge Functions:
- Go to Edge Functions in Supabase Dashboard
- Click on each function → **Invoke**
- Test with sample JSON payloads

**Note:** Edge Functions are optional for initial development. The app will work without them, but AI features won't function until deployed.
