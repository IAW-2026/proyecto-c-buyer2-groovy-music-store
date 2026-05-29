import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  //chequeo de que el usaurio sea admin efectivamente
  const { sessionClaims } = await auth();

  if (sessionClaims?.roles !== "admin") {
    redirect("/");
  }


  return (
    <div className="bg-background min-h-screen">
      {children}
    </div>
  );
}