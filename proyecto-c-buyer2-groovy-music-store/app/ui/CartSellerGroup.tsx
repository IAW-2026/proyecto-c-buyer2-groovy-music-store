import type { HydratedCartItem } from '@/app/lib/definitions';
import { CartItem } from './CartItem'; // Ajustá el import si usás archivos separados

interface CartSellerGroupProps {
    vendedorId: string;
    items: HydratedCartItem[];
    onUpdateQuantity: (id_carrito: string, producto_id: string, delta: number) => void;
    onRemoveItem: (id_carrito: string, producto_id: string) => void;
    onCheckout: (vendedorId: string, itemsDelVendedor: HydratedCartItem[]) => void;
}

export function CartSellerGroup({ vendedorId, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartSellerGroupProps) {
    const idSellerReal = items[0].producto.seller_id.id;
    const subtotal = items.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);

    return (
        <div className="border border-border rounded-lg p-3 bg-white shadow-sm">
            <ul className="list-none p-0 m-0 mb-3 flex flex-col gap-4">
                {items.map((item) => (
                    <CartItem 
                        key={item.producto_id} 
                        item={item} 
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                    />
                ))}
            </ul>

            <div className="border-t border-border pt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-foreground/60 font-dm">Subtotal:</span>
                    <span className="text-sm font-semibold text-foreground font-syne">
                        ${(subtotal || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </span>
                </div>
                <button 
                    onClick={() => onCheckout(idSellerReal, items)}
                    className="block text-center w-full bg-foreground text-background border-none rounded-md py-2 text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity font-dm"
                >
                    Iniciar compra
                </button>
            </div>
        </div>
    );
}