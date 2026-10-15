import { Router } from 'express';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { getCityWeather } from '../lib/weather.js';
export const weatherRouter = Router();
const attribution = "Weather data by Open-Meteo.com (https://open-meteo.com/)"
// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async (req, res, next) => {
  try {
    const city = parseCity(req.query.city)
    const summary = await getCityWeather(city)
    res.status(200).json({data, attribution})
  } catch (err) {
    next(err)
  }
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', async (req, res, next) => {
  try {
    const cities = parseCities
    const results = await Promise.allSettled(
      cities.map((city) => getCityWeather(city))
    )
    const cityResults = results.map((result, i) => {
      if (result.status === 'fulfilled') {
        return {
          city: cities[i],
          data: result.value,
        }
      }
    })
    res.status(200).json({data: {cities: cityResults}, attribution})
  } catch (err) {
    next(err)
  }
});
