import 'dotenv/config';
import { newMessage } from '../capabilities/openai-text.js';
import { generateImage } from '../capabilities/openai-image.js';
import { generateSpeech } from '../capabilities/openai-tts.js'
import { transcribeAudio } from '../capabilities/openai-stt.js';
const { encode } = require('gpt-3-encoder');
import path from 'path';
import fs from 'fs';
import OpenAI from 'openai';

// Set Jest timeout globally for all tests to 10 seconds
jest.setTimeout(10000);

const clearDirectory = (directoryPath) => {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const currentPath = path.join(directoryPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        clearDirectory(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
  }
};

const countTokens = (text) => {
  const tokens = encode(text);
  const tokenCount = tokens.length;
  return tokenCount;
}

describe('OpenAI Integration', () => {
  let openai;

  beforeAll(() => {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const audioDir = path.resolve(__dirname, 'audio-output');
    clearDirectory(audioDir);
  });

  it('should successfully call the OpenAI Text Generation API and return a valid response', async () => {
    const history = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ];
    const message = { role: 'user', content: 'What is the capital of France?' };

    const result = await newMessage(history, message, openai);

    expect(result).toHaveProperty('content');
    expect(typeof result.content).toBe('string');
    expect(result.content.trim()).not.toBe('');
    expect(result.content.toLowerCase()).toContain('paris');
  });

  it('should handle Text Generation API errors gracefully', async () => {
    const invalidOpenAI = new OpenAI({ apiKey: 'invalid_key' });

    const history = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ];
    const message = { role: 'user', content: 'Test message' };

    await expect(newMessage(history, message, invalidOpenAI)).rejects.toThrow('Failed to get response from OpenAI');
  });

  it('should generate reproducible outputs with a seed parameter for the Text Generation', async () => {
    const seed = 42;
    const history = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of Japan?' }
    ];

    const chatCompletion1 = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: history,
      max_tokens: 10,
      temperature: 0,
      user: 'test-user',
      seed: seed
    });

    const chatCompletion2 = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: history,
      max_tokens: 10,
      temperature: 0,
      user: 'test-user',
      seed: seed
    });

    expect(chatCompletion1.choices[0].message.content).toBe(chatCompletion2.choices[0].message.content);
  });

  it('should generate reproducible outputs and equivilant token usage totals', async () => {
    const seed = 42;
    const prompt = 'What is the capital of Japan?';
    const history = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ];

    const expectedTokens = countTokens("role: 'system', content: 'You are a helpful assistant.' ,role: 'user', content: 'What is the capital of Japan?' ")

    const chatCompletion1 = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: history,
      max_tokens: 10,
      temperature: 0,
      user: 'test-user',
      seed: seed
    });


    const chatCompletion2 = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: history,
      max_tokens: 10,
      temperature: 0,
      user: 'test-user',
      seed: seed
    });

    const { usage } = chatCompletion1;

    expect(usage).toHaveProperty('total_tokens');
    expect(usage.total_tokens).toBe(expectedTokens);
    expect(usage.total_tokens).toBe(chatCompletion2.usage.total_tokens);
  });

  it('should generate a structured response for baking a cake with Text Generation', async () => {
    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the recipe'
        },
        ingredients: {
          type: 'array',
          items: {
            type: 'string',
            description: 'A single ingredient needed for the recipe'
          },
          description: 'List of ingredients required to bake the cake'
        },
        instructions: {
          type: 'array',
          items: {
            type: 'string',
            description: 'Step-by-step instructions for baking the cake'
          },
          description: 'List of steps to follow to complete the recipe'
        },
        bake_time: {
          type: 'string',
          description: 'The time required to bake the cake'
        },
        oven_temperature: {
          type: 'string',
          description: 'The temperature setting for the oven'
        }
      },
      required: ['title', 'ingredients', 'instructions', 'bake_time', 'oven_temperature']
    };

    const messages = [
      { role: 'system', content: 'You are a helpful assistant who provides structured recipe information.' },
      { role: 'user', content: 'Please provide a recipe to bake a chocolate cake.' }
    ];

    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      functions: [
        {
          name: 'bake_cake',
          description: 'Provides a structured response for a cake recipe',
          parameters: schema
        }
      ],
      function_call: { name: 'bake_cake' }
    });

    expect(result.choices[0].message).toHaveProperty('function_call');
    const { function_call } = result.choices[0].message;
    expect(function_call).toHaveProperty('arguments');

    const response = JSON.parse(function_call.arguments);
    expect(response).toHaveProperty('title');
    expect(response).toHaveProperty('ingredients');
    expect(Array.isArray(response.ingredients)).toBe(true);
    expect(response).toHaveProperty('instructions');
    expect(Array.isArray(response.instructions)).toBe(true);
    expect(response).toHaveProperty('bake_time');
    expect(response).toHaveProperty('oven_temperature');
  });

  it('should successfully call the OpenAI Image Generation API and return a valid response', async () => {
    const description = 'A test image for VMWare Tanzu by Broadcom';

    const result = await generateImage(description, openai);

    expect(result).toHaveProperty('url');
    expect(typeof result.url).toBe('string');
    expect(result.url.trim()).not.toBe('');
  }, 30000);

  it('should handle Image Generation API errors gracefully', async () => {
    const invalidOpenAI = new OpenAI({ apiKey: 'invalid_key' });

    const description = 'A test image for VMWare Tanzu by Broadcom';

    await expect(generateImage(description, invalidOpenAI)).rejects.toThrow('Failed to generate image from OpenAI');
  });

  it('should successfully call the OpenAI Text to Speech API and return a valid response', async () => {
    const text = 'Today is a wonderful day to build!';
    const voice = 'alloy';

    const audioPath = await generateSpeech(text, voice, openai);

    expect(fs.existsSync(audioPath)).toBe(true);
    expect(path.extname(audioPath)).toBe('.mp3');
  });

  it('should handle Text to Speech API errors gracefully', async () => {
    const invalidOpenAI = new OpenAI({ apiKey: 'invalid_key' });

    const text = 'Today is a wonderful day to build!';
    const voice = 'alloy';

    await expect(generateSpeech(text, voice, invalidOpenAI)).rejects.toThrow('Failed to generate speech from OpenAI');
  });

  it('should successfully transcribe audio using the OpenAI Speech to Text API and return a valid response', async () => {
    const filePath = path.resolve(__dirname, 'audio_input', 'audio-input.mp3');

    // Ensure the test file exists for transcription
    if (!fs.existsSync(filePath)) {
      throw new Error('Test audio file does not exist.');
    }

    const transcriptionText = await transcribeAudio(filePath, openai);

    expect(typeof transcriptionText).toBe('string');
    expect(transcriptionText).toBe('Today is a wonderful day to build.');
    expect(transcriptionText.trim()).not.toBe('');
  });

  it('should handle OpenAI Speech to Text API errors gracefully', async () => {
    const invalidOpenAI = new OpenAI({ apiKey: 'invalid_key' });

    const filePath = path.resolve(__dirname, 'audio', 'audio.mp3');

    await expect(transcribeAudio(filePath, invalidOpenAI)).rejects.toThrow('Failed to transcribe audio from OpenAI');
  });


});