# OpenAI CLI Test Project

This project tests various capabilities of the OpenAI API using a Command Line Interface (CLI) built with the OpenAI Node.js SDK.

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/tone2k/openai-cli-test.git
   cd openai-test
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Add API key**:

   Create a `.env` file in the root directory with your OpenAI API key:

   ```
   OPENAI_API_KEY=your_actual_openai_api_key
   ```

## Usage

Run the CLI to test chat:

```bash
node openai.js
```

## Running Tests

Test all OpenAI capabilities (chat, image generation, speech synthesis, transcription) with:

```bash
npm test
```

## Notes

- Ensure `.env` is in `.gitignore` to keep your API key secure.
- The `.env` file should contain `OPENAI_API_KEY`.

## License

MIT License

For more details, visit the [OpenAI API Documentation](https://platform.openai.com/docs).