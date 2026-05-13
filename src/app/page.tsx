import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabaseSession = cookieStore.get("sb-access-token");
  const guestSession = cookieStore.get("sk_guest_session");

  // If user is logged in (Supabase or Guest), go to /trangchu
  if (supabaseSession || guestSession) {
    redirect("/trangchu");
  }

  // Not logged in → go to login
  redirect("/login");
}
