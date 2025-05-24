export default function ChatApiServices() {
  const streamGeminiResponse = async ({
    contents,
    apiKey,
  }: {
    contents: any;
    apiKey: string;
  }) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}&alt=sse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
        }),
      }
    );
    return response;
  };

  return { streamGeminiResponse };
}