import fs from 'fs';
import path from 'path';

/**
 * Function to transcribe an audio file using the OpenAI API.
 *
 * @param {string} filePath - The path to the audio file to transcribe.
 * @param {Object} openaiInstance - Instance of OpenAI API client.
 * @returns {Promise<string>} - The transcription text.
 */
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
