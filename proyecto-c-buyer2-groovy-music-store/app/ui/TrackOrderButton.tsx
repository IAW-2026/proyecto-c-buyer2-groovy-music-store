'use client'


export default function TrackOrderButton({ orderId }: { orderId: number }) {
    
    const handleTrackShipment = () => {
        
        console.log(`Rastreando la orden: ${orderId}`);
        alert(`Acá se abriría el seguimiento de la orden ${orderId}`);
    }

    return (
        <button 
            onClick={handleTrackShipment}
            className="font-dm text-sm font-medium border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
        >
            Seguir Envío
        </button>
    )
}