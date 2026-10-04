import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserData } from "@/lib/data";
import { getTone } from "@/lib/outbox";
import { DashboardShell } from "@/components/DashboardShell";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [{ messages, tasks, connections, commitments }, tone] = await Promise.all([
    getUserData(session.user.id),
    getTone(session.user.id)
  ]);

  const userName = session.user.name?.split(" ")[0] ?? "Clare";

  return (
    <DashboardShell
      userName={userName}
      userEmail={session.user.email ?? ""}
      data={{ messages, tasks, connections, commitments }}
      tone={tone}
    />
  );
}
