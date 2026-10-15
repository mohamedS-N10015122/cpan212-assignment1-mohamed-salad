import { HttpError } from '../lib/http-error.js';

// TODO (you): check ?city= and return the trimmed city name. Throw a 400
// HttpError with details.city when it breaks a rule from the assignment page.
export function parseCity(value) {
  if (value.trim().length < 2 || value.trim().length > 60 || typeof value !== 'string') {
    throw new HttpError(400, "Invalid query" ,"city must be 2 to 60 characters");
  }
  return value.trim()
}

// TODO (you): check ?cities= and return an array of trimmed city names. Throw a
// 400 HttpError with details.cities when it breaks a rule from the assignment page.
export function parseCities(value) {
  if (typeof value !== 'string' ||  value.trim()==="") {
    throw new HttpError(400, "invalid query", {cities: "there must be 2 to 5 cities"});
  }
  const cities = value.split(',').map((city) => city.trim())
  if (cities.length<2 || cities.length>5|| cities.some((city) => city.length<2 || city.length>60)) {
      throw new HttpError(400, "Invalid query", { cities: 'there must be 2-5 cities and each having 2-60 characters'})
  }
  const set = new Set();
  for (const city of cities){
    const uniqCity = city.toLowerCase()
    if (set.has(uniqCity)) {
      throw new HttpError(400, "Invalid query", { cities: `"${uniqCity}" is listed more than once`})
    }
    set.add(uniqCity)
  }
  return cities
}
