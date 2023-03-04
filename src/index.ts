import axios from "axios";

function buildUrl(base: string, parameters: { [key: string]: any }): string {
	let params = Object.entries(parameters)
		.map(([key, value]) => `${key}=${value}`)
		.join("&");

	return base.concat("?").concat(params);
}

export async function forecast(parameters: ForecastParameters): Promise<ForecastData> {
	let hourly = parameters.hourly?.join(",");
	let daily = parameters.daily?.join(",");

	let params: { [key: string]: any } = parameters;

	if (hourly) {
		params.hourly = hourly;
	}

	if (daily) {
		params.daily = daily;
	}

	let url = buildUrl("https://api.open-meteo.com/v1/forecast", params);
	let resp = await axios.get(url);

	return resp.data as ForecastData;
}

export async function queryGeocoding(arg: string | { name: string; count?: number; language?: string }): Promise<{ results: Geolocation[]; generationtime_ms: number }> {
	let parameters;

	if (typeof arg == "string") {
		parameters = { name: arg };
	} else {
		parameters = arg;
	}

	let resp = await axios.get(buildUrl("https://geocoding-api.open-meteo.com/v1/search", parameters));

	return resp.data as any;
}

export function convertWeatherCode(code: number): string {
	return WEATHER_CODES[code];
}

type Geolocation = {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	elvation: number;
	feature_code: string;
	country_code: string;
	country?: string;
	country_id: number;
	population: number;
	postcodes?: string[];
	admin1: string;
	admin2?: string;
	admin3?: string;
	admin4?: string;
	admin1_id: string;
	admin2_id?: string;
	admin3_id?: string;
	admin4_id?: string;
};

type ForecastParameters = {
	latitude: number;
	longitude: number;
	elevation?: number;
	hourly?: HourlyOptions[];
	daily?: DailyOptions[];
	current_weather?: boolean;
	temperature_unit?: "celsuis" | "fahrenheit";
	windspeed_unit?: "kmh" | "ms" | "mph" | "kn";
	precipitation_unit?: "mm" | "inch";
	timeformat?: "iso8601" | "unixtime";
	timezone?: string;
	past_days?: 0 | 1 | 2;
	start_date?: string;
	end_date?: string;
	cell_selection?: "land" | "sea" | "nearest";
};

type ForecastData = {
	latitude: number;
	longitude: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	hourly?: { [key: string]: any };
	hourly_units?: { [key: string]: any };
	daily?: { [key: string]: any };
	daily_units?: { [key: string]: any };
	current_weather?: {
		time: string;
		temperature: number;
		weathercode: number;
		windspeed: number;
		winddirection: number;
	};
};

type HourlyOptions = "temperature_2m" | "relativehumidity_2m" | "dewpoint_2m" | "apparent_temperature" | "pressure_msl" | "surface_pressure" | "cloudcover" | "cloudcover_low" | "cloudcover_mid" | "cloudcover_high" | "windspeed_10m" | "windspeed_80m" | "windspeed_120m" | "windspeed_180m" | "winddirection_10m" | "winddirection_80m" | "winddirection_120m" | "winddirection_180m" | "windgusts_10m" | "shortwave_radiation" | "direct_radiation" | "direct_normal_irradiance" | "diffuse_radiation" | "vapor_pressure_deficit" | "cape" | "evapotranspiration" | "et0_fao_evapotranspiration" | "precipitation" | "snowfall" | "rain" | "showers" | "weathercode" | "snow_depth" | "freezinglevel_height" | "visibility" | "soil_temperature_0cm" | "soil_temperature_6cm" | "soil_temperature_18cm" | "soil_temperature_54cm" | "soil_moisture_0_1cm" | "soil_moisture_1_3cm" | "soil_moisture_3_9cm" | "soil_moisture_9_27cm" | "soil_moisture_27_81cm";

type DailyOptions = "temperature_2m_max" | "temperature_2m_min" | "apparent_temperature_max" | "apparent_temperature_min" | "precipitation_sum" | "rain_sum" | "showers_sum" | "snowfall_sum" | "precipitation_hours" | "weathercode" | "sunrise" | "sunset" | "windspeed_10m_max" | "windgusts_10m_max" | "winddirection_10m_dominant" | "shortwave_radiation_sum" | "et0_fao_evapotranspiration";

const WEATHER_CODES: { [key: number]: string } = {
	0: "fair",
	1: "mainly clear",
	2: "partly cloudy",
	3: "overcast",
	45: "fog",
	48: "depositing rime fog",
	51: "light drizzle",
	53: "moderate drizzle",
	55: "dense drizzle",
	56: "light freezing drizzle",
	57: "dense freezing drizzle",
	61: "slight rain",
	63: "moderate rain",
	65: "heavy rain",
	66: "light freezing rain",
	67: "heavy freezing rain",
	71: "slight snow fall",
	73: "moderate snow fall",
	75: "heavy snow fall",
	77: "snow grains",
	80: "slight rain showers",
	81: "moderate rain showers",
	82: "heavy rain showers",
	85: "slight snow showers",
	86: "heavy snow showers",
	95: "slight to moderate thunderstorm",
	96: "thunderstorm with slight hail",
	99: "thunderstorm with heavy hail"
};
