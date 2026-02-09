# 🧠 FULL STACK AI MVP — OPTION A
## AI Support "Triage & Recovery" Hub
Role: You are a senior full-stack engineer building a production-grade MVP.

---

## 1. Objective

Build a full-stack MVP system that:
- Accepts user complaints via API.
- Processes them asynchronously with an LLM.
- Categorizes, scores, and drafts responses.
- Provides an agent dashboard to resolve tickets.

This is NOT a toy project.
Treat this as a production-ready system:
- Clean architecture
- Async processing
- Proper database design
- Error handling
- Valid JSON from AI
- No blocking HTTP requests

---

## 2. Tech Stack

### Monorepo
- Root: npm workspaces

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind (optional)

### Backend
- Node.js + Express
- TypeScript
- Z.AI as LLM provider
- Background worker (BullMQ or in-process queue)

### Database
- PostgreSQL
- Prisma ORM (preferred)

---

## 3. System Architecture

apps/
frontend/ (Next.js)
backend/ (Express API)
packages/
db/ (Prisma schema)

yaml
Copy code

Flow:

User → POST /tickets  
→ API stores ticket  
→ returns 201 immediately  
→ background worker calls Z.AI  
→ AI result saved  
→ dashboard shows triaged ticket  

---

## 4. Core Features

### 4.1 Ticket Ingestion API

Endpoint:
POST /tickets

css
Copy code

Body:
```json
{
  "email": "user@example.com",
  "message": "I was charged twice and nobody replied"
}
Behavior:

Validate input

Save ticket with status = "PENDING"

Return 201 immediately

DO NOT WAIT for AI

5. Background AI Worker
Process each ticket:

Call Z.AI with prompt to return JSON:

Required output schema:

json
Copy code
{
  "category": "Billing | Technical | Feature Request",
  "sentiment": 1-10,
  "urgency": "High | Medium | Low",
  "draft_reply": "string"
}
Must:

Enforce JSON-only output

Parse safely

Retry on failure

Store structured fields

6. Z.AI Integration
Use env:

ini
Copy code
zai_token=YOUR_TOKEN
Example API call:

POST https://api.z.ai/v1/chat/completions

Headers:

pgsql
Copy code
Authorization: Bearer ${process.env.zai_token}
Content-Type: application/json
Payload:

json
Copy code
{
  "model": "glm-4.5",
  "messages": [
    {
      "role": "system",
      "content": "You are a support ticket triage AI. Output ONLY valid JSON."
    },
    {
      "role": "user",
      "content": "TICKET TEXT HERE"
    }
  ],
  "temperature": 0.2
}
7. Master AI Prompt (Critical)
This prompt MUST be used in the worker:

yaml
Copy code
You are an AI support triage system.

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
}
8. Database Schema (Prisma)
Ticket model:

prisma
Copy code
model Ticket {
  id           String   @id @default(uuid())
  email        String
  message      String
  category     String?
  sentiment    Int?
  urgency      String?
  draftReply   String?
  status       String   @default("PENDING")
  createdAt    DateTime @default(now())
  processedAt  DateTime?
}
9. Agent Dashboard
Frontend routes:

List View
bash
Copy code
/dashboard
Shows:

email

category

urgency (color coded)

status

Detail View
bash
Copy code
/dashboard/tickets/[id]
Shows:

original message

AI draft (editable)

Resolve button

Resolve:

PATCH /tickets/:id/resolve

status = "RESOLVED"

10. Engineering Constraints
You MUST implement:

Non-blocking POST /tickets

Background queue

Retry logic for AI

Safe JSON parsing

Input validation

Proper HTTP status codes

Env-based secrets

Prisma migrations

Typed DTOs

11. Bonus (if time)
Docker Compose (Postgres + API)

Rate limiting

Basic auth for dashboard

Logging

12. Quality Bar
This must look like:

A real SaaS MVP

Something deployable

Not a tutorial project

Code must show:

Clean separation of concerns

Proper async patterns

Defensive programming

No blocking I/O

Final Goal
Deliver a working system where:

User submits ticket
→ API responds instantly
→ AI processes in background
→ Agent sees structured result
→ Agent resolves ticket

This proves:

Full-stack skill

Async architecture

AI integration

Production mindset