# City Weather API

This service is a simple API to get the weather and compare weather of cities

## Run it

You can run it by doing `npm install`, `cp .env.example .env`, and `npm start`

## Environment variables

`PORT`: sets the port of the server  
`GEOCODING_URL`: sets the geocoding url  
`FORECAST_URL`: sets the forecast url  
`UPSTREAM_TIMEOUT_MS`: sets when to call a timeout error  
`CACHE_TTL_SECONDS`: sets how long until cached data gets deleted

## Endpoints

`GET /api/weather?city=Toronto`: returns up to 2 days of weather for the selected city  
`GET /api/compare?cities=Toronto,Vancouver,Halifax`: returns 2-5 cities and shows what is warmest and coldest  
`GET /api/cache/stats`: returns cache stats of which ones hit

## Testing

```bash
# route not found: 404
curl -i "http://localhost:4000/a"
# Weather for a city: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"
# Timeout error (modify UPSTREAM_TIMEOUT_MS to 1 to try): 504
curl -i "http://localhost:4000/api/weather?city=Toronto"
# City that does not exist: 404
curl -i "http://localhost:4000/api/weather?city=Qwertyville"
# Weather for a city that is less than 2 or greater than 60 characters: 400
curl -i "http://localhost:4000/api/weather?city=T"
# Weather compare for 2-5 cities: 200
curl -i "http://localhost:4000/api/compare?cities=Toronto,Vancouver,Halifax"
# Weather compare for 2-5 cities, but one is invalid: 200 (invalid city gets 404)
curl -i "http://localhost:4000/api/compare?cities=Vancouver,Halifax,Qwertyville"
# Using /api/compare for less than 2 or greater than 6 cities: 400
curl -i "http://localhost:4000/api/compare?cities=Toronto"
# Using /api/compare that has duplicate cities: 400
curl -i "http://localhost:4000/api/compare?cities=Toronto,Halifax,Toronto"
# Cache: 200
curl -i "http://localhost:4000/api/cache/stats"

```

## Data source

The data source is from https://open-meteo.com/.

## AI use

No AI tools used.
