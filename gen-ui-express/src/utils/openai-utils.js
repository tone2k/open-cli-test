import fs from 'fs';
import { fetchWeather } from '../api/weather-api.js';
import { fetchNews } from '../api/news-api.js';
import { fetchStockData } from '../api/stock-api.js';
import { formatNewsHtml } from '../templates/news.js';
import { formatWeatherHtml } from '../templates/weather.js';
import { formatStockHtml } from '../templates/stock.js';

export const transcribeAudio = async (filePath, openaiInstance) => {
  try {
    const transcription = await openaiInstance.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (error) {
    throw new Error('Failed to transcribe audio from OpenAI');
  }
};


export const generateImage = async (description, openaiInstance) => {
  try {
    const imageResponse = await openaiInstance.images.generate({
      model: 'dall-e-3',
      prompt: description,
      n: 1,
      size: '1024x1024',
    });

    return imageResponse.data[0];
  } catch (error) {
    throw new Error('Failed to generate image from OpenAI');
  }
};


export const newMessage = async (history, message, openaiInstance) => {
  try {
    const chatCompletion = await openaiInstance.chat.completions.create({
      messages: [...history, message],
      model: 'gpt-4',
      functions: [
        {
          name: 'weatherTool',
          description: 'Fetch weather data for a location.',
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string', description: 'City name' },
            },
            required: ['location'],
          },
        },
        {
          name: 'generateImageTool',
          description: 'Generate an image based on a description.',
          parameters: {
            type: 'object',
            properties: {
              description: { type: 'string', description: 'Description of the image to generate.' },
            },
            required: ['description'],
          },
        },
        {
          name: 'fetchNewsTool',
          description: 'Fetch top news headlines for a specific country.',
          parameters: {
            type: 'object',
            properties: {
              country: { type: 'string', description: 'Country code (ISO Alpha-2 format) to fetch news for.' },
            },
            required: ['country'],
          },
        },
        {
          name: 'stockDataTool',
          description: 'Fetch stock data for a specific stock symbol.',
          parameters: {
            type: 'object',
            properties: {
              symbol: { type: 'string', description: 'Stock symbol to fetch data for.' },
            },
            required: ['symbol'],
          },
        }
      ],
    });

    const response = chatCompletion.choices[0].message;

    if (response.function_call) {
      const { name, arguments: args } = response.function_call;

      if (name === 'stockDataTool') {
        const { symbol } = JSON.parse(args);
        console.log("--->", symbol);
        const stockData = await fetchStockData(symbol);
        const stockHtmlResponse = formatStockHtml(stockData);
        return { role: 'assistant', content: stockHtmlResponse };
      }

      if (name === 'weatherTool') {
        const { location } = JSON.parse(args);
        const weatherData = await fetchWeather(location);

        const weatherHtmlResponse = formatWeatherHtml(weatherData);
        return { role: 'assistant', content: weatherHtmlResponse };
      }

      if (name === 'fetchNewsTool') {
        const articles = await fetchNews();
        const newsHtml = formatNewsHtml(articles);
        return { role: 'assistant', content: newsHtml };

      }

      if (name === 'generateImageTool') {
        const { description } = JSON.parse(args);
        const imageResult = await generateImage(description, openaiInstance);

        return { role: 'assistant', content: `Image generated: ${imageResult.url}` };
      }
    }

    return response;
  } catch (error) {
    console.error('Error occurred:', error.message);
    throw new Error('Failed to get response from OpenAI');
  }
};
