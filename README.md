# Openmeteo

Simple API wrapper around the [Open-Meteo](https://open-meteo.com/) API.

## Usage

```typescript
import { forecast, queryGeocoding } from "openmeteo";


let search_results = await queryGeocoding("London");
let result = search_results.results[0];

let forecast_result = await forecast({latitude: result.latitude, longitude: result.longitude, hourly: ["temperature_2m"]});

console.log(forecast_result)
```
