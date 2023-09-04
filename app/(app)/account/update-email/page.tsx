import EmailForm from "./email-form";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function UpdateEmail() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <EmailForm user={session?.user} />;
}
