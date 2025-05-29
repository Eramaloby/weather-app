import { useState, useEffect } from 'react';

import { fetchWeather } from '../apiService';

const Weather = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchWeather();
        setData(res);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }
  return (
    <div>
      <p>adda</p>
      <p>{typeof data}</p>
    </div>
  );
};

export default Weather;
