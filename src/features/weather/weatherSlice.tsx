import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { WeatherState } from '../../types/types';

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
      }
    },
  },
});
