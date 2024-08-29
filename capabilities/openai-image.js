/**
 * Function to generate an image using the OpenAI API.
 *
 * @param {string} description - Description of the image to generate.
 * @param {Object} openaiInstance - Instance of OpenAI API client.
 * @returns {Promise<Object>} - The generated image response from the OpenAI API.
 */
export const generateImage = async (description, openaiInstance) => {
    try {
      const imageResponse = await openaiInstance.images.generate({
        model: 'dall-e-3', // Specify the model as per the OpenAI docs
        prompt: description,
        n: 1,
        size: '1024x1024',
      });
  
      return imageResponse.data[0];
    } catch (error) {
      throw new Error('Failed to generate image from OpenAI');
    }
  };