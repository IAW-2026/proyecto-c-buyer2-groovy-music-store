import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {Metadata } from 'next'

export const metadata: Metadata = {
  title: "Panel de administración - Groovy Music Store",
  description: "Panel de administración de Groovy Music Store." }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  //chequeo de que el usaurio sea admin efectivamente
  const { sessionClaims } = await auth();
  
  
  const userRoles = (sessionClaims?.roles as string[]) || [];

  
  if (!userRoles.includes("admin") && !userRoles.includes("super_admin") && !userRoles.includes("admin_buyer")) {
    redirect("/");
  }

  return (
    <div className="bg-background min-h-screen">
      {children}
    </div>
  );
}