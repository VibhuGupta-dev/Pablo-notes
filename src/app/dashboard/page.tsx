import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Workspace from "../components/Workspace";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.userId) {
    redirect("/login");
  }

  return <Workspace />;
}
