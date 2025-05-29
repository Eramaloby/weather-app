import { AxiosResponse } from 'axios';

export interface WeatherApiResponce extends AxiosResponse<WeatherApiData> {}

export interface WeatherApiData {
  city: City;
  cnt: number;
  cod: string;
  list: ForecastItem[];
  message: number;
}

interface City {
  coord: Coords;
  country: string;
  id: number;
  name: string;
  population: number;
  sunrise?: number;
  sunset?: number;
  timezone?: number;
}

interface Coords {
  lat: number;
  lon: number;
}

interface ForecastItem {
  clouds: Clouds;
  dt: number;
  dt_txt: string;
  main: Main;
  pop: number;
  sys: Sys;
  visibility: number;
  weather: Weather;
  wind: Wind;
}

//clouds percentage
interface Clouds {
  all: number;
}

interface Main {
  feels_like: number;
  grnd_level: number;
  humidity: number;
  pressure: number;
  sea_level: number;
  temp: number;
  temp_kf: number;
  temp_min: number;
  temp_max: number;
}

//d - day, n - night
interface Sys {
  pod: string;
}

interface Weather {
  description: string;
  icon: string;
  id: number;
  main: string;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface WeatherState {
  data: WeatherApiData | null;
  city: string;
  isLoading: boolean;
  error: Error | null;
  history: string[];
  favorites: string[];
}
