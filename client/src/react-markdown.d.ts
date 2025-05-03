import React from 'react';

declare module 'react-markdown' {
  export interface CodeProps {
    node: any;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
  }
  
  export default ReactMarkdown;
}