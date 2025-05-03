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
  { value: "deepseek-ai/deepseek-coder-33b-instruct", label: "DeepSeek Coder 33B" },
  { value: "deepseek-ai/deepseek-math-7b-instruct", label: "DeepSeek Math 7B" },
  { value: "01-ai/yi-34b-chat", label: "Yi 34B Chat" },
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
