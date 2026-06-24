import Image from 'next/image';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import type { HydratedCartItem } from '@/app/lib/definitions';

interface CartItemProps {
    item: HydratedCartItem;
    onUpdateQuantity: (id_carrito: string, producto_id: string, delta: number) => void;
    onRemoveItem: (id_carrito: string, producto_id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
    const reachedMax = item.cantidad >= item.producto.stock;
    const sinStock = item.producto.stock <= 0;

    return (
        <li className={`flex gap-3 items-center border-b border-border pb-3 last:border-0 last:pb-0 ${sinStock ? 'opacity-50 grayscale' : ''}`}>
            <div className="w-12 h-12 relative bg-gray-200 rounded shrink-0 overflow-hidden">
                <Image 
                    src={item.producto.imagen_principal || '/placeholder-record.png'} 
                    alt={item.producto.titulo} 
                    fill 
                    className="object-cover"
                />
            </div>
            
            <div className="grow min-w-0">
                <p className="m-0 text-[13px] font-medium text-foreground truncate font-syne">
                    {item.producto.titulo}
                </p>
                {sinStock && (
                    <span className="text-[10px] text-red-500 font-bold block mt-0.5">Agotado / No disponible</span>
                )}
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="text-[13px] font-semibold text-foreground font-syne">
                    ${(item.producto.precio * item.cantidad || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="w-fit flex items-center border border-border rounded-md">
                        <button 
                            onClick={() => onUpdateQuantity(item.id_carrito, item.producto_id, -1)}
                            disabled={item.cantidad <= 1 || sinStock}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 transition-colors"
                        >
                            <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-[11px] font-medium min-w-[20px] text-center text-gray-900">
                            {item.cantidad}
                        </span>
                        <button 
                            onClick={() => onUpdateQuantity(item.id_carrito, item.producto_id, 1)}
                            disabled={reachedMax || sinStock}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 transition-colors"
                        >
                            <PlusIcon className="w-3 h-3" />
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => onRemoveItem(item.id_carrito, item.producto_id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar producto"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
                
                {reachedMax && !sinStock && (
                    <span className="text-[10px] text-orange-500 block text-right">
                        Solo {item.producto.stock === 1 ? 'queda' : 'quedan'} {item.producto.stock} {item.producto.stock === 1 ? 'unidad' : 'unidades'}
                    </span>
                )}
            </div>
        </li>
    );
}