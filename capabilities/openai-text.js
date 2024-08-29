/**
 * Function to send a new message to the OpenAI API and receive a response.
 *
 * @param {Array} history - Array of message objects representing the conversation history.
 * @param {Object} message - New message object to send.
 * @param {Object} openaiInstance - Instance of OpenAI API client.
 * @returns {Promise<Object>} - The response message from the OpenAI API.
 */
export const newMessage = async (history, message, openaiInstance) => {
    try {
      const chatCompletion = await openaiInstance.chat.completions.create({
        messages: [...history, message],
        model: 'gpt-3.5-turbo',
      });
  
      return chatCompletion.choices[0].message;
    } catch (error) {
      // console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  };