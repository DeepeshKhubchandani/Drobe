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
