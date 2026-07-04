import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateMessageStatus } from "@/actions/admin-submissions";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Contact Messages</h1>
        <p className="mt-1 text-sm text-ink-500">{messages.length} total messages</p>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink-800">{m.name}</p>
                <p className="text-xs text-ink-400">
                  {m.email} {m.phone && `· ${m.phone}`} · {m.submittedAt.toLocaleString("en-US")}
                </p>
              </div>
              <StatusSelect id={m.id} status={m.status} onUpdate={updateMessageStatus} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-700">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="rounded-2xl border border-ink-100 bg-white p-10 text-center text-sm text-ink-400 shadow-sm">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
