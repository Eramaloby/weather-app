import axios from 'axios';
import { WeatherApiResponce, WeatherApiData } from './types/types';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const CITY_ID = 524901;

export const fetchWeather = async (): Promise<WeatherApiData> => {
  if (!API_KEY) {
    throw new Error(
      'API_ERROR is not defined. Set REACT_APP_OPENWEATHER_API_KEY in .env file.'
    );
  }

  try {
    const responce: WeatherApiResponce = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&appid=${API_KEY}&units=metric`
    );
    console.log('data', responce.data);
    return responce.data;
  } catch (error) {
    throw error;
  }
};
