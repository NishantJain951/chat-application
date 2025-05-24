"use client";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import React from "react";
import renderFormattedText from "./FormatModelNonCodeMessages";

export default function formatAssistantMessage(
  content: string,
  onCopy: (code: string) => void,
  copiedCode: string | null
) {
  const codeRegex = /```([\s\S]*?)```/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index);
    if (before) {
      parts.push(...renderFormattedText(before, lastIndex));
    }

    const code = match[1];
    const newCode = code.split("\n");
    const firstLine = newCode.length ? newCode[0] : "Code";
    const restOfLines = newCode.slice(1).join("\n");

    parts.push(
      <div
        key={`code-${match.index}`}
        className="relative group my-6 rounded-xl bg-gray-900 text-gray-100 border border-gray-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
          <span className="text-xs font-mono text-gray-400 font-extrabold capitalize">
            {firstLine || "Code"}
          </span>
          <button
            onClick={() => onCopy(restOfLines)}
            className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white transition-all duration-200 flex items-center gap-2"
            title="Copy code"
          >
            {copiedCode === restOfLines ? (
              <CheckIcon className="w-4 h-4 text-green-400" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
          </button>
        </div>
        <pre className="px-5 py-4 text-sm font-mono overflow-x-auto bg-gray-900!">
          <code className="language-jsx bg-gray-900!">{restOfLines}</code>
        </pre>
        <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-blue-500/30 rounded-xl transition-colors duration-300"></div>
      </div>
    );
    lastIndex = codeRegex.lastIndex;
  }
  const remaining = content.slice(lastIndex);
  if (remaining) {
    parts.push(...renderFormattedText(remaining, lastIndex));
  }
  return parts;
}