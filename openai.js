import 'dotenv/config';
import readline from 'node:readline';
import OpenAI from 'openai';


// Initialize OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Format user input for chat message.
 *
 * @param {string} userInput - User input string.
 * @returns {Object} - Formatted message object.
 */
const formatMessage = (userInput) => ({ role: 'user', content: userInput });

/**
 * Function to generate an image using the OpenAI API.
 *
 * @param {string} description - Description of the image to generate.
 * @returns {Promise<Object>} - The generated image response from the OpenAI API.
 */
export const generateImageTool = async (description) => {
  try {
    const imageResponse = await openai.images.generate({
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


/**
 * Function to handle new messages and integrate function calling.
 *
 * @param {Array} history - Array of message objects representing the conversation history.
 * @param {Object} message - New message object to send.
 * @returns {Promise<Object>} - The response message from the OpenAI API.
 */
const newMessage = async (history, message) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [...history, message],
      model: 'gpt-4',  // Ensure you're using a model that supports function calling
      functions: [
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
      ],
    });

    const response = chatCompletion.choices[0].message;

    // Check if the model wants to call a function
    if (response.function_call) {
      const { name, arguments: args } = response.function_call;

      if (name === 'generateImageTool') {
        const { description } = JSON.parse(args);
        const imageResult = await generateImageTool(description);
        return { role: 'assistant', content: `Image generated: ${imageResult.url}` };
      }
    }

    return response;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from OpenAI');
  }
};

/**
 * Main chat function to start CLI interaction.
 */
const chat = () => {
  const history = [
    {
      role: 'system',
      content: `You are assisting in the testing and development of a new application. The developer interacting with you just wrote their first Node app to interact with you via the CLI. Respond appropriately.`,
    },
  ];

  const start = () => {
    rl.question('Dev: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      const userMessage = formatMessage(userInput);
      const response = await newMessage(history, userMessage);

      history.push(userMessage, response);
      console.log(`\n\nAI: ${response.content}\n\n`);
      start();
    });
  };

  start();
  console.log('\n\nAI: How can I help you today?\n\n');
};

console.log("Chatbot initialized. Type 'exit' to end the chat.");
chat();