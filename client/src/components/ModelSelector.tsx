import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <Select
      value={selectedModel}
      onValueChange={onModelChange}
    >
      <SelectTrigger className="h-9 w-[200px] bg-gray-100 text-sm">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
        <SelectItem value="anthropic/claude-instant-v1">Claude Instant</SelectItem>
        <SelectItem value="google/palm">Google PaLM</SelectItem>
        <SelectItem value="meta-llama/llama-2-13b-chat">Llama 2 13B</SelectItem>
      </SelectContent>
    </Select>
  );
}
