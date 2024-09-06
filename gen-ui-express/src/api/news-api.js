import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';


export const fetchNews = async (country = 'us') => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const response = await fetch(`https://newsapi.org/v2/everything?q=${country}&apiKey=${apiKey}`);


    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch news data');
    }

    return data.articles;
  } catch (error) {
    throw new Error('Error fetching news data: ' + error.message);
  }
};