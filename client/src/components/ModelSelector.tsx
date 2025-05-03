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
        <SelectItem value="deepseek-ai/deepseek-coder-33b-instruct">DeepSeek Coder 33B</SelectItem>
        <SelectItem value="deepseek-ai/deepseek-math-7b-instruct">DeepSeek Math 7B</SelectItem>
        <SelectItem value="01-ai/yi-34b-chat">Yi 34B Chat</SelectItem>
      </SelectContent>
    </Select>
  );
}
