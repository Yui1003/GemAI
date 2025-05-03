import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint - connects to OpenRouter API
  app.post('/api/chat', async (req, res) => {
    try {
      const { model, messages } = req.body;

      if (!model || !messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid request. Model and messages array are required.' });
      }

      // Add a system message about internet access if not already present
      const systemMessage = {
        role: "system",
        content: `You are Gem AI, a helpful assistant with internet access. Today's date is ${new Date().toLocaleDateString()}. 

1. You have internet access and can provide up-to-date information.
2. When asked about current events, respond as if you've just checked online sources.
3. For complex topics, mention that you're providing information based on available sources.`
      };
      
      // Prepend system message if needed
      const messagesWithSystem = messages.some(msg => msg.role === 'system') 
        ? messages 
        : [systemMessage, ...messages];

      // Get OpenRouter API key from environment
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({
          error: 'OpenRouter API key not found. Please set the OPENROUTER_API_KEY environment variable.'
        });
      }
      
      // Make the request to OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://replit.com',
          'X-Title': 'Gem AI'
        },
        body: JSON.stringify({
          model,
          messages: messagesWithSystem,
          max_tokens: 500,  // Limit response size to stay within free tier
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check specifically for rate limit errors
        if (response.status === 429 || (errorData.error?.message && errorData.error.message.includes('Rate limit'))) {
          console.error('Rate limit reached:', errorData.error?.message);
          return res.status(429).json({ 
            error: 'Rate limit reached for the free OpenRouter model. We can only make a limited number of requests per day with the free tier. Please try again tomorrow or try a simpler question.'
          });
        }
        
        // Check for credit limit errors
        if (response.status === 402 || (errorData.error?.message && errorData.error.message.includes('credits'))) {
          console.error('Credit limit reached:', errorData.error?.message);
          return res.status(402).json({ 
            error: 'This model requires more credits than available in the free tier. Please try again with a different model or upgrade to a paid OpenRouter account.'
          });
        }
        
        return res.status(response.status).json({ 
          error: errorData.error?.message || `API returned ${response.status}`
        });
      }

      const data = await response.json();
      
      // Check if the response has the expected structure
      if (!data.choices || !data.choices.length || !data.choices[0].message) {
        console.error('Unexpected API response format:', JSON.stringify(data));
        return res.status(500).json({
          error: 'The AI model returned an unexpected response format. Please try again with a different prompt.'
        });
      }
      
      return res.json({ 
        message: data.choices[0].message.content,
        model: data.model
      });
    } catch (error) {
      console.error('Error processing chat request:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
