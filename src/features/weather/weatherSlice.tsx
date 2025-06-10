import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { WeatherState } from '../../types/types';
import { WeatherApiData } from '../../types/types';

import { fetchWeather } from '../../apiService';

import {
  LOCAL_STORAGE_FAVORITES_KEY,
  LOCAL_STORAGE_DEFAULT_CITY_KEY,
} from '../../utils/localStorageKeys';

const getInitialState = (): WeatherState => {
  const serializedFavorites = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
  const favorites = serializedFavorites ? JSON.parse(serializedFavorites) : [];
  return {
    data: null,
    city: '',
    isLoading: false,
    error: null,
    history: [],
    favorites: favorites,
    defaultCity:
      localStorage.getItem(LOCAL_STORAGE_DEFAULT_CITY_KEY) || 'Moscow',
  };
};

const initialState: WeatherState = getInitialState();

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
    addCityToFavorites: (
      state: WeatherState,
      action: PayloadAction<string>
    ) => {
      const newCity = action.payload;
      state.favorites = state.favorites.filter((city) => city !== newCity);
      state.favorites.unshift(newCity);
      localStorage.setItem(
        LOCAL_STORAGE_FAVORITES_KEY,
        JSON.stringify(state.favorites)
      );
    },
    setDefaultCity: (state: WeatherState, action: PayloadAction<string>) => {
      const newCity = action.payload;
      if (newCity !== state.defaultCity) {
        state.defaultCity = newCity;
        localStorage.setItem(LOCAL_STORAGE_DEFAULT_CITY_KEY, newCity);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state: WeatherState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchWeather.fulfilled,
        (state: WeatherState, action: PayloadAction<WeatherApiData>) => {
          state.isLoading = false;
          state.error = null;
          state.data = action.payload;
          state.city = action.payload.city.name;

          const newCity = state.city;
          state.history = state.history.filter((city) => city !== newCity);
          state.history.unshift(newCity);

          if (state.history.length > 10) {
            state.history.pop();
          }
        }
      )
      .addCase(fetchWeather.rejected, (state: WeatherState, action) => {
        state.isLoading = false;
        state.data = null;
        state.city = '';
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'An unknown error occurred';
      });
  },
});

export const { addCityToHistory, addCityToFavorites, setDefaultCity } =
  weatherSlice.actions;

export default weatherSlice.reducer;
