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
          messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ 
          error: errorData.error?.message || `API returned ${response.status}`
        });
      }

      const data = await response.json();
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
