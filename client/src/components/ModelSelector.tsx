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
        <SelectItem value="chutes/deepseek-v3">DeepSeek V3 (free)</SelectItem>
        <SelectItem value="chutes/mistral-small-3.1-24b">Mistral Small 3.1 24B (free)</SelectItem>
        <SelectItem value="novitaai/qwen3-4b">Qwen3 4B (free)</SelectItem>
      </SelectContent>
    </Select>
  );
}
