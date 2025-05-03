# Gem AI Chat

A flexible AI chat application that leverages OpenRouter models with advanced model selection and robust error handling capabilities.

## Key Features

- Multiple AI model support (GPT-4o, Claude 3 Opus, Claude 3 Sonnet, Llama 3 70B)
- Advanced OpenRouter integration
- Comprehensive error handling and rate limit management
- Code syntax highlighting
- Responsive web interface
- Chat history with localStorage persistence

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Express.js
- API Integration: OpenRouter API
- State Management: React Hooks
- Styling: Tailwind CSS

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gem-ai-chat.git
   cd gem-ai-chat
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

This application can be deployed on Render.com or other similar platforms. Follow these steps for Render deployment:

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add the environment variable `OPENROUTER_API_KEY`
5. Set the build command to `npm install && npm run build`
6. Set the start command to `npm run start`

## License

MIT