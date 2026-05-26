import Image from 'next/image';

import {ItemCheckout} from '@/app/lib/definitions';

interface ListaArticulosProps {
    items: (ItemCheckout | null)[];
}

export default function ListaArticulos({ items }: ListaArticulosProps) {
    return (
        <div className="space-y-5">
            {items.map((item) => item && (
                <div key={item.id} className="flex gap-5 items-center bg-card p-5 rounded-xl border border-border shadow-sm">
                    <div className="w-24 h-24 relative bg-border/30 rounded-md shrink-0 overflow-hidden">
                        <Image src={item.imagen_principal} alt={item.titulo} fill className="object-cover" />
                    </div>
                    <div className="grow min-w-0">
                        <h3 className="font-syne font-semibold text-xl truncate">{item.titulo}</h3>
                        <p className="text-sm text-foreground/70 font-medium">{item.artista}</p>
                        <p className="text-sm text-foreground/70 mt-1">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="font-syne font-bold text-xl">${(item.precio * item.cantidad).toFixed(2)}</p>
                        {item.cantidad > 1 && (
                            <p className="text-xs text-foreground/60 mt-1">${item.precio.toFixed(2)} c/u</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}