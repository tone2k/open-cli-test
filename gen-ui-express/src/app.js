import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';
import { newMessage, newJSONMessage } from './utils/openai-utils.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

let chatHistory = [
  { role: 'system', content: 'You are a helpful assistant, you are capable of function calling. You have access to the following tools: fetchWeather, fetchNews, generateImage.' }
];

const schema = {
  type: 'object',
  properties: {
    itemid: {
      type: 'string',
      description: 'The unique identifier for the bike or product'
    },
    name: {
      type: 'string',
      description: 'The name of the bike or product being ordered'
    },
    price: {
      type: 'string',
      description: 'The price of the bike or product'
    },
    quantity: {
      type: 'number',
      description: 'The quantity of bikes or products ordered'
    },
    shortDescription: {
      type: 'string',
      description: 'A brief description of the bike or product'
    }
  },
  required: ['itemid', 'name', 'price', 'quantity', 'shortDescription']
};

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const userMessage = { role: 'user', content: message };
    const response = await newMessage(chatHistory, userMessage, openai);

    chatHistory.push(userMessage, response);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bike', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const userMessage = { role: 'user', content: message };
    const response = await newJSONMessage(chatHistory, userMessage, openai, schema);

    chatHistory.push(userMessage, response);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clear-chat', (req, res) => {
  chatHistory = [
    { role: 'system', content: 'You are a helpful assistant capable of generating images and answering queries.' }
  ];
  res.status(200).send('Chat history cleared.');
});

app.listen(port, () => {
  console.log(`AI Express app listening on http://localhost:${port}`);
});

