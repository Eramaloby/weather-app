import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchWeather } from '../apiService';
import { RootState, AppDispatch } from '../app/store';
import {
  setDefaultCity,
  addCityToFavorites,
} from '../features/weather/weatherSlice';

import ForecastBox from './ForecastBox';

import './/Weather.css';

const Weather: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data, city, isLoading, error, history, defaultCity, favorites } =
    useSelector((state: RootState) => state.weather);

  const getWeatherIconUrl = (iconCode: string) => {
    return `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      dispatch(fetchWeather(searchTerm));
      setSearchTerm('');
    }
  };

  const handleHistory = (city: string) => {
    dispatch(fetchWeather(city));
  };

  const handleDefaultCity = (city: string) => {
    dispatch(setDefaultCity(city));
  };

  const handleAddCityToFavorites = (city: string) => {
    dispatch(addCityToFavorites(city));
  };

  useEffect(() => {
    if (!data && !isLoading && !error) {
      dispatch(fetchWeather(defaultCity));
    }
  }, [dispatch, data, isLoading, error, defaultCity]);

  return (
    <div>
      {data && (
        <button onClick={() => handleDefaultCity(data.city.name)}>
          Set as default city
        </button>
      )}
      {history.length > 0 &&
        history.map((city, index) => (
          <button name={city} key={index} onClick={() => handleHistory(city)}>
            {city}
          </button>
        ))}
      <form onSubmit={handleSubmit}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></input>
        <button type='submit'>Search for weather</button>
      </form>
      {!data && <div>No data</div>}
      {data && (
        <div>
          <div className='current-forecast'>
            <h1>{data.city.name}</h1>
            <p>Current temperature: {data.list[0].main.temp}</p>
            <p>Feels like: {data.list[0].main.feels_like}</p>
            <p>{data.list[0].weather[0].description}</p>
            <button onClick={() => handleAddCityToFavorites(data.city.name)}>
              Add to favorites
            </button>
            <img
              alt={data.list[0].weather[0].description}
              src={getWeatherIconUrl(data.list[0].weather[0].icon)}
            ></img>
          </div>
          <div className='daily-forecast'>
            {data.list.slice(1, 9).map((forecastItem, index) => {
              return (
                <ForecastBox
                  key={index}
                  forecastItem={forecastItem}
                ></ForecastBox>
              );
            })}
          </div>
        </div>
      )}
      {favorites && (
        <div>
          <h2>Favorite cities</h2>
          {favorites.map((favorite, index) => (
            <button key={index} onClick={() => handleHistory(favorite)}>
              {favorite}
            </button>
          ))}
        </div>
      )}
      {isLoading && <div>Loading weather data...</div>}
      {error && <div> Error: {error}</div>}
    </div>
  );
};

export default Weather;
