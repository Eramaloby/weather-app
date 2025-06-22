import axios from 'axios';
import { WeatherApiResponce, WeatherApiData } from './types/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export const fetchWeather = createAsyncThunk<WeatherApiData, string>(
  'weather/fetchWeather',
  async (cityOrCityId: string, { rejectWithValue }) => {
    if (!API_KEY) {
      throw new Error(
        'API_ERROR is not defined. Set REACT_APP_OPENWEATHER_API_KEY in .env file.'
      );
    }

    try {
      const isCityId = !isNaN(Number(cityOrCityId));

      const url = isCityId
        ? `http://api.openweathermap.org/data/2.5/forecast?id=${cityOrCityId}&appid=${API_KEY}&units=metric`
        : `http://api.openweathermap.org/data/2.5/forecast?q=${cityOrCityId}&appid=${API_KEY}&units=metric`;

      const response: WeatherApiResponce = await axios.get(url);
      console.log('data', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
