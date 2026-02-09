import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-12 px-6 py-16">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">AI Triage Hub</p>
        <h1 className="text-4xl font-bold leading-tight text-zinc-900 sm:text-5xl">
          Full-stack support triage powered by Express, Prisma, and Z.AI
        </h1>
        <p className="text-lg leading-8 text-zinc-600">
          Complaints enter through the API, are scored by the background worker, and show up on the dashboard with
          category, urgency, sentiment, and a suggested reply. Use the dashboard to review and resolve every ticket in record time.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700"
          >
            Open dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            API reference
          </a>
        </div>
      </div>

      <section className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 sm:grid-cols-3">
        {[
          {
            title: "Async ingestion",
            body: "POST /tickets queues work instantly, keeping the API responsive.",
          },
          {
            title: "AI triage",
            body: "Z.AI enforces structured JSON with sentiment, urgency, and draft replies.",
          },
          {
            title: "Agent workflow",
            body: "Review drafts, tweak copy, and resolve tickets in the dashboard.",
          },
        ].map((card) => (
          <article key={card.title} className="space-y-3">
            <h3 className="text-base font-semibold text-zinc-900">{card.title}</h3>
            <p className="text-sm text-zinc-600">{card.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
