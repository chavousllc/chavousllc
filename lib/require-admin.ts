import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Defense in depth: middleware already gates /admin/* routes, but server
// actions can be invoked directly, so every admin action re-checks the
// session before touching the database.
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}
