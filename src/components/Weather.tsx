import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchWeather } from '../apiService';
import { RootState, AppDispatch } from '../app/store';
import {
  setDefaultCity,
  addCityToFavorites,
  removeCityFromFavorites,
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

  const handleToggleFavorites = (city: string) => {
    if (favorites.includes(city)) {
      dispatch(removeCityFromFavorites(city));
    } else {
      dispatch(addCityToFavorites(city));
    }
  };

  useEffect(() => {
    if (!data && !isLoading && !error) {
      dispatch(fetchWeather(defaultCity));
    }
  }, [dispatch, data, isLoading, error, defaultCity]);

  return (
    <div className='weather-container'>
      <h1>Weather App</h1>
      <div className='search-section'>
        <div className='input-group'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
          <button className='search-button' onClick={handleSubmit}>
            {isLoading ? 'Loading...' : 'Search for weather'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className='loading-message'>Loading weather data...</div>
      )}
      {error && <div className='error-message'> Error: {error}</div>}

      {data && (
        <div className='current-weather-card'>
          <div className='header-section'>
            <h2>
              <span>
                {data.city.name}, {data.city.country}
              </span>
            </h2>
            <div className='card-buttons'>
              <button
                onClick={() => handleToggleFavorites(data.city.name)}
                className={
                  favorites.includes(data.city.name)
                    ? 'remove-from-favorites-button'
                    : 'add-to-favorites-button'
                }
              >
                {favorites.includes(data.city.name)
                  ? 'Remove from favorites'
                  : 'Add to favorites'}
              </button>
              <button
                onClick={() => handleDefaultCity(data.city.name)}
                className='set-default-city-button'
              >
                Set as default city
              </button>
            </div>
          </div>

          <div className='current-forecast'>
            <img
              alt={data.list[0].weather[0].description}
              src={getWeatherIconUrl(data.list[0].weather[0].icon)}
              className='weather-icon'
            ></img>
            <p className='temperature'>{data.list[0].main.temp.toFixed(1)}°C</p>{' '}
            <p className='description'>{data.list[0].weather[0].description}</p>
            <p>Feels like: {data.list[0].main.feels_like.toFixed(1)}°C</p>
            <p>Humidity: {data.list[0].main.humidity}%</p>
            <p>Wind Speed: {data.list[0].wind.speed.toFixed(1)} m/s</p>
          </div>

          <div className='forecast-list'>
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

      {history.length > 0 && (
        <div className='history-section'>
          <h2>History</h2>
          <ul className='city-list'>
            {history.map((city, index) => (
              <li key={index}>
                <button name={city} onClick={() => handleHistory(city)}>
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {favorites && (
        <div className='favorites-section'>
          <h2>Favorite cities</h2>
          <ul className='city-list'>
            {favorites.map((favorite, index) => (
              <li key={index}>
                <button
                  onClick={() => handleHistory(favorite)}
                  className='favorites-city-button'
                >
                  {favorite}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weather;
