"use client";
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function renderFormattedText(
  text: string,
  baseIndex: number
): React.ReactNode[] {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-3 mt-5 border-b pb-1">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>
    ),
    p: ({ children }) => <p className="whitespace-pre-wrap mb-2">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-6">{children}</ul>,
    li: ({ children }) => <li>{children}</li>,
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ inline, children, ...props }: CodeProps) => {
      if (inline) {
        return (
          <code className="bg-gray-200 rounded px-1" {...props}>
            {children}
          </code>
        );
      }
      return <code {...props}>{children}</code>;
    },
  };

  return [
    <ReactMarkdown
      key={`${baseIndex}-markdown`}
      remarkPlugins={[remarkGfm, remarkCustomHeading]}
      components={components}
    >
      {text}
    </ReactMarkdown>,
  ];
}

function remarkCustomHeading() {
  return (tree: any) => {
    visit(tree, "paragraph", (node) => {
      if (node.children.length === 1) {
        const child = node.children[0];
        if (
          child.type === "strong" &&
          child.children.length === 1 &&
          child.children[0].type === "text" &&
          child.children[0].value.endsWith(":")
        ) {
          node.type = "heading";
          node.depth = 3;
          node.children = child.children;
        }
      }
    });
  };
}