import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';


export const fetchWeather = async (location) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;  
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || 'Failed to fetch weather data');
    }

    return data;
  } catch (error) {
    throw new Error('Error fetching weather data: ' + error.message);
  }
};
