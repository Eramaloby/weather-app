import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { WeatherState } from '../../types/types';

import { fetchWeather } from '../../apiService';

const initialState: WeatherState = {
  data: null,
  city: '',
  isLoading: false,
  error: null,
  history: [],
  favorites: [],
};

export const weatherSlice = createSlice({
  name: 'weatherData',
  initialState,
  reducers: {
    addCityToHistory: (state: WeatherState, action: PayloadAction<string>) => {
      const newCity = action.payload;
      if (!state.history.includes(newCity)) {
        state.history.unshift(newCity);

        if (state.history.length > 10) {
          state.history.pop();
        }
      } else {
        const cityIndex = state.history.indexOf(newCity);
        if (cityIndex > -1) {
          state.history = state.history.splice(cityIndex);
          state.history.unshift(newCity);
        }
      }
    },
    setCity: (state: WeatherState, action: PayloadAction<string>) => {
      const newCity = action.payload;
      if (newCity !== state.city) {
        state.city = newCity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state: WeatherState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state: WeatherState, action) => {});
  },
});
