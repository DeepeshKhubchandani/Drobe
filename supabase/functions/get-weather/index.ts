import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

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
    let location: string | undefined;

    // Try to parse JSON body
    try {
      const body = await req.json();
      location = body.location;
    } catch (e) {
      // If JSON parsing fails, check URL params
      const url = new URL(req.url);
      location = url.searchParams.get('location') || undefined;
    }

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Missing location parameter' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${OPENWEATHER_API_KEY}&units=imperial`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const weather = {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      precipitation_probability: data.pop || 0,
      wind_speed: Math.round(data.wind.speed),
      icon: data.weather[0].icon,
      location: data.name, // City name from API response
    };

    return new Response(
      JSON.stringify({ weather }),
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
