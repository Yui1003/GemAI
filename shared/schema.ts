import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Chat message interface
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// Chat model options
export const modelOptions = [
  { value: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "anthropic/claude-instant-v1", label: "Claude Instant" },
  { value: "google/palm", label: "Google PaLM" },
  { value: "meta-llama/llama-2-13b-chat", label: "Llama 2 13B" },
];

// Chat completion request schema
export const chatCompletionSchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
});

export type ChatCompletionRequest = z.infer<typeof chatCompletionSchema>;
