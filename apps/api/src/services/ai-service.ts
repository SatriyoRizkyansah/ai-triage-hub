import { fetch } from "undici";
import { env } from "../env";
import { parseJson } from "../lib/json";
import { logger } from "../lib/logger";
import { AiTriageResult, parseAiTriageResult } from "../schemas/ticket";
import { AppError } from "../utils/app-error";

const TRIAGE_PROMPT = `You are an AI support triage system.

Your task:
1. Categorize the complaint into one of:
   - Billing
   - Technical
   - Feature Request

2. Score sentiment from 1 (very negative) to 10 (very positive)

3. Determine urgency:
   - High: business blocking, angry customer
   - Medium: normal complaint
   - Low: suggestions, mild issues

4. Draft a polite, professional reply.

IMPORTANT:
Return ONLY valid JSON.
No markdown.
No explanation.
No text outside JSON.

JSON Schema:
{
  "category": "Billing | Technical | Feature Request",
  "sentiment": number,
  "urgency": "High | Medium | Low",
  "draft_reply": string
}`;

export class AIService {
  constructor(
    private readonly config = {
      apiBase: env.ZAI_API_BASE,
      model: env.ZAI_MODEL,
      token: env.ZAI_TOKEN,
    },
  ) {}

  async triageTicket(message: string): Promise<AiTriageResult> {
    const response = await fetch(`${this.config.apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.token}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        temperature: 0.2,
        messages: [
          { role: "system", content: TRIAGE_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({ errorBody }, "Z.AI API error");
      throw new AppError(502, "Failed to reach Z.AI", errorBody);
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const choices = payload?.choices as Array<{ message?: { content?: string } }> | undefined;
    const content: unknown = choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      throw new AppError(502, "Z.AI returned an empty response");
    }

    try {
      const parsed = parseJson<Record<string, unknown>>(content);
      return parseAiTriageResult(parsed);
    } catch (error) {
      logger.error({ error, content }, "Unable to parse Z.AI response");
      throw new AppError(502, "Z.AI returned invalid JSON", error);
    }
  }
}
