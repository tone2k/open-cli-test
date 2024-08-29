import path from 'path';
import fs from 'fs';

/**
 * Function to generate spoken audio from input text using the OpenAI API and save it locally.
 *
 * @param {string} text - The input text to convert to speech.
 * @param {string} voice - The voice model to use for speech synthesis.
 * @param {Object} openaiInstance - Instance of OpenAI API client.
 * @returns {Promise<string>} - The file path where the audio is saved.
 */
export const generateSpeech = async (text, voice, openaiInstance) => {
    try {
        const audioResponse = await openaiInstance.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: text,
        });

        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
        const audioPath = path.resolve(__dirname, 'audio_output', 'audio-output.mp3');

        // Ensure the 'audio' directory exists
        fs.mkdirSync(path.dirname(audioPath), { recursive: true });

        // Write the audio file to the local directory
        await fs.promises.writeFile(audioPath, audioBuffer);

        return audioPath;
    } catch (error) {
        throw new Error('Failed to generate speech from OpenAI');
    }
};