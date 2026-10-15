import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.

// TODO (you): write a helper that fetches a URL and returns the parsed JSON.
//   - Pass signal: AbortSignal.timeout(config.upstreamTimeoutMs) to fetch.
//   - fetch resolves for every HTTP status, so check res.ok yourself.
//   - Turn every failure into an HttpError: 504 when the timeout fired
//     (err.name is 'TimeoutError'), 502 for a network failure, a status that
//     isn't ok, or a body that isn't JSON.
async function jsonFetch(url) {
  try {
    const res = await fetch(url, {signal: AbortSignal.timeout(config.upstreamTimeoutMs)})
    if (!res.ok) {
      throw new HttpError(
        502,
        `Could not get a valid response from the forecast/geocoding service`
      );
    }
    return await res.json()
  } catch (err) {
      if (err instanceof HttpError) {
        throw err
      }
    if (err.name == TimeoutError) {
      throw new HttpError(
        504,
        `Timeout Error: service didn't respond after ${config.upstreamTimeoutMs} milliseconds`
      );
    }
    throw new HttpError(
      502,
      `Error: Invalid response`
    );
  }
}
// TODO (you): look up a city with the geocoding API and return
// { name, region, country, latitude, longitude, timezone } for the first result.
// Throw a 404 HttpError when there are no results.
export async function geocodeCity(name) {
  const urlParams = new URLSearchParams({
    name,
    count: 1,
    language: 'en',
    format: 'json'
  })
  const data = await jsonFetch(`${config.geocodingUrl}/search?${urlParams}`)
  if (!data?.results  || data.results.length === 0) {
    throw new HttpError(404, `City not found: ${name}`);
  }
  const data1 = data.results[0]
  return {
    name: data1.name,
    region: data1.admin1 ?? null,
    country: data1.country ?? null,
    latitude: data1.latitude,
    longitude: data1.longitude,
    timezone: data1.timezone
  }
}

// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(latitude, longitude) {
  const urlParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '3'
  })
  const data = await jsonFetch(`${config.forecastUrl}/forecast?${urlParams}`)
    if (!data?.current || !data?.daily || data.results?.length === 0) {
    throw new HttpError(502, 'Invalid response');
  }
  return data
}
