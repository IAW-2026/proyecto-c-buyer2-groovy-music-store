//server component
import PagoClient from "@/app//ui/PagoClient";

export default async function PagoPage({ params }: { params: Promise<{ ordenId: string }> }) {
    
    const { ordenId } = await params;

    return <PagoClient ordenId={ordenId} />;
}