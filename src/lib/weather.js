import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';

// TODO (you): create one cache for the whole app, with a time to live of
// config.cacheTtlSeconds.

// TODO (you): return the weather summary for one city, in the shape shown on
// the assignment page. Check the cache first. On a miss, geocode the city, get
// the forecast, build the summary, store it, and return it with cached: false.
// On a hit, return the stored summary with cached: true.
export async function getCityWeather(city) {
  const summary1 = await geocodeCity(city)
  const summary2 = await getForecast(summary1.latitude, summary1.longitude)
  const current = summary2.current
  const daily = summary2.daily
  const summary = {
    location: {
      name: summary1.name,
      region: summary1.region,
      country: summary1.country,
      latitude: summary1.latitude,
      longitude: summary1.longitude,
      timezone: summary1.timezone,
    },
    current: {
      time: current.time,
      temperatureC: current.temperature_2m,
      feelsLikeC: current.apparent_temperature,
      humidityPercent: current.relative_humidity_2m,
      windKmh: current.wind_speed_10m,
      weatherCode: current.weather_code,
      conditions: describeWeatherCode(current.weather_code)
    },
    daily: daily.time.map((date, i) => ({
      date,
      minC: daily.temperature_2m_min[i],
      maxC: daily.temperature_2m_max[i],
      precipitationChancePercent: daily.precipitation_probability_max[i],
      weatherCode: daily.weather_code[i],
      conditions: describeWeatherCode(daily.weather_code[i]),
      fetchedAt: new Date().toISOString()
    }))
  }
  return summary
}

// TODO (you): return the cache statistics for GET /api/cache/stats.
export function getCacheStats() {
  throw new Error('getCacheStats is not written yet');
}
