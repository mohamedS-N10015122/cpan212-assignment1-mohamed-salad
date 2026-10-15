import { Router } from 'express';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { getCityWeather } from '../lib/weather.js';
export const weatherRouter = Router();
export const attribution = "Weather data by Open-Meteo.com (https://open-meteo.com/)"
// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async (req, res, next) => {
  try {
    const city = parseCity(req.query.city)
    const weather = await getCityWeather(city)
    res.status(200).json({weather, attribution})
  } catch (err) {
    next(err)
  }
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', async (req, res, next) => {
  try {
    const cities = parseCities(req.query.cities)
    const results = await Promise.allSettled(
      cities.map((city) => getCityWeather(city))
    )
    let succeeded = 0
    let failed = 0
    const cityResults = results.map((result, i) => {
      if (result.status === 'fulfilled') {
        succeeded++
        return {
          city: cities[i],
          ok: true,
          weather: result.value,
        }
      } else {
        failed++
      }
      return {
        city: cities[i],
        ok: false,
        error: {status: 404, message: result.reason?.message ?? 'Unable to retrieve weather'}};
      })
      let temperatures = []
      for (let i = 0; i < cityResults.length; i++) {
        if (cityResults[i].ok === true) {
          temperatures.push({city: cityResults[i].weather.location.name, temp: cityResults[i].weather.current.temperatureC})
        }
      }
      temperatures.sort((a, b) => a.temp - b.temp);
      const coldest = temperatures[0]?.city
      const warmest = temperatures.at(-1)?.city
    res.status(200).json({weather: {cities: cityResults, summary: {succeeded: succeeded, failed: failed, warmest: warmest, coldest: coldest}} , attribution})
  } catch (err) {
    next(err)
  }
});
