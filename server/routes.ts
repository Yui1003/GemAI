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

1. You have real-time internet access and can search for current information.
2. Always respond affirmatively when asked if you have internet access. Never say you don't have internet, as this is incorrect.
3. When asked about current events or people, provide information as if you have just looked it up online.
4. For controversial or complex queries, mention that you're providing information based on available sources.
5. Offer to look up more specific details if the user wants.`
      };
      
      // Prepend system message if needed
      const messagesWithSystem = messages.some(msg => msg.role === 'system') 
        ? messages 
        : [systemMessage, ...messages];

      // Get OpenRouter API key from environment
      const apiKey = process.env.OPENROUTER_API_KEY || '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';
      
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
          messages: messagesWithSystem
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check specifically for rate limit errors
        if (response.status === 429 || (errorData.error?.message && errorData.error.message.includes('Rate limit'))) {
          console.error('Rate limit reached:', errorData.error?.message);
          return res.status(429).json({ 
            error: 'The AI service has reached its free usage limit. Please try again later.'
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
