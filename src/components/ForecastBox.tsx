import React, { useState, useEffect } from 'react';

import { ForecastItem } from '../types/types';

interface ForecastBoxProps {
  forecastItem: ForecastItem;
}

const ForecastBox: React.FC<ForecastBoxProps> = ({ forecastItem }) => {
  return (
    <div className='forecast-item'>
      <h2>{new Date(forecastItem.dt_txt).toLocaleTimeString().slice(0, 5)}</h2>
      <p>{forecastItem.main.temp}</p>
    </div>
  );
};

export default ForecastBox;
