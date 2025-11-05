import { redirect } from "next/navigation";

export default function Home() {
  // Since we're using demo user (no authentication),
  // redirect directly to the dashboard
  redirect("/dashboard");
}
