import ChatApiServices from "./ChatApiService";

describe("ChatApiServices", () => {
  const { streamGeminiResponse } = ChatApiServices();
  const mockFetch = global.fetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("streamGeminiResponse calls fetch with correct parameters", async () => {
    const contents = [{ role: "user", parts: [{ text: "Hello" }] }];
    const apiKey = "test-api-key";

    await streamGeminiResponse({ contents, apiKey });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
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
  });

  it("streamGeminiResponse returns the fetch response", async () => {
    const mockResponse = { ok: true, body: "streamed_data" };
    mockFetch.mockResolvedValueOnce(mockResponse);

    const response = await streamGeminiResponse({
      contents: [],
      apiKey: "key",
    });
    expect(response).toBe(mockResponse);
  });
});