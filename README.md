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

### Render.com Deployment (Recommended)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add the environment variable `OPENROUTER_API_KEY` with your OpenRouter API key
5. Use the following configuration:
   - Build Command: `./render-build.sh`
   - Start Command: `npm start`
   - Root Directory: `./`
6. Click "Create Web Service"

### Troubleshooting Deployment

If you encounter issues with missing CSS on your deployed site:
1. Make sure the `OPENROUTER_API_KEY` is properly set
2. Check Render logs for any build errors
3. Verify that assets are being generated properly during the build process
4. Try redeploying with "Clear build cache & deploy" option

## License

MIT