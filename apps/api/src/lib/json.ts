export const stripCodeFences = (raw: string): string => {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "");
    const closingIndex = text.lastIndexOf("```");
    if (closingIndex !== -1) {
      text = text.slice(0, closingIndex);
    }
  }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1).trim();
  }
  return text;
};

export const parseJson = <T>(raw: string): T => {
  const cleaned = stripCodeFences(raw);
  return JSON.parse(cleaned) as T;
};
