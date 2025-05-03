import { ReactNode } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const renderers = {
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className="relative">
        <SyntaxHighlighter
          language={match[1]}
          style={atomDark}
          showLineNumbers={match[1] !== "bash" && match[1] !== "plaintext"}
          customStyle={{
            borderRadius: '0.375rem',
            fontSize: '0.875rem', 
            fontFamily: 'JetBrains Mono, monospace',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
        <button
          className="copy-button"
          onClick={() => {
            navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
          }}
        >
          Copy
        </button>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

// Helper function to escape HTML characters
export function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Process markdown-like text into JSX
export function processMarkdown(text: string): ReactNode {
  let processed = escapeHTML(text);
  
  // Handle code blocks
  processed = processed.replace(/```(\w*)([\s\S]*?)```/g, (match, language, code) => {
    return `<pre><code class="language-${language || 'plaintext'}">${code.trim()}</code></pre>`;
  });
  
  // Handle inline code
  processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle bold text
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic text
  processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Handle lists
  processed = processed.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
  processed = processed.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  
  // Add list containers
  processed = processed.replace(/<li>(.+)<\/li>/g, '<ul><li>$1</li></ul>');
  processed = processed.replace(/<\/ul>\s*<ul>/g, '');
  
  // Handle paragraphs
  processed = processed.replace(/\n\n/g, '</p><p>');
  
  return <div dangerouslySetInnerHTML={{ __html: processed }} />;
}
