import React from 'react';

declare module 'react-markdown' {
  export interface CodeProps {
    node: any;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
    [key: string]: any;  // Allow any other properties
  }
  
  export default ReactMarkdown;
}