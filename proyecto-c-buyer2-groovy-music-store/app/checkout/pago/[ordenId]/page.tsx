//server component
import PagoClient from "@/app//ui/PagoClient";
import {Metadata } from 'next'

export const metadata: Metadata = {
  title: "Pago - Groovy Music Store",
  description: "Proceso de pago en orden de compra de Groovy Music Store." }

export default async function PagoPage({ params }: { params: Promise<{ ordenId: string }> }) {
    
    const { ordenId } = await params;

    return <PagoClient ordenId={ordenId} />;
}