import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';


export async function fetchStockData(symbol) {
  const apiKey = process.env.VANTAGE_API_KEY;  

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`;
    const response = await fetch(url);

    console.log(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data['Time Series (Daily)']) {
      return data;
    } else if (data['Error Message']) {
      throw new Error(data['Error Message']);
    } else {
      throw new Error('Unexpected response from stock API');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return { error: error.message }; // Return an error object for handling
  }
}

