import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { modelOptions } from "@shared/schema";

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
        {modelOptions.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
