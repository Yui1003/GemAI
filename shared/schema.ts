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
  { value: "chutes/deepseek-v3", label: "DeepSeek V3 (free)" },
  { value: "chutes/mistral-small-3.1-24b", label: "Mistral Small 3.1 24B (free)" },
  { value: "novitaai/qwen3-4b", label: "Qwen3 4B (free)" },
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
