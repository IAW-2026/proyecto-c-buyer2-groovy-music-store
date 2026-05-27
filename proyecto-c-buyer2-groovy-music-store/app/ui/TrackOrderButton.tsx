'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getShipmentTracking } from '@/app/lib/services/shipping-api'
import { ShipmentResponse } from '@/app/lib/definitions'

// Definimos el tipo para la dirección según tu esquema de Prisma
interface DireccionProps {
    calle: string;
    ciudad: string;
    provincia: string;
    cod_postal: string;
    pais: string;
}

export default function TrackOrderButton({ 
    orderId, 
    direccion 
}: { 
    orderId: number | string;
    direccion?: DireccionProps | null; // Recibimos la dirección opcionalmente
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shipmentData, setShipmentData] = useState<ShipmentResponse | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleOpenModal = async () => {
        setIsOpen(true);
        setIsLoading(true);
        
        try {
            const data = await getShipmentTracking(orderId.toString());
            setShipmentData(data);
        } catch (error) {
            console.error("Error al rastrear envío:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatEstado = (estado?: string) => {
        if (estado === 'en_transito') return 'En Tránsito';
        if (estado === 'entregado') return 'Entregado';
        if (estado === 'pendiente') return 'Preparando Paquete';
        return estado;
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            
            <div className="bg-[#f2efe9] border border-[#d6d3cd] rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                
                {/* BOTÓN DE CERRAR */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h3 className="font-syne text-2xl font-semibold text-black mb-6">Estado del Envío</h3>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-8 h-8 border-4 border-[#e55a3d]/30 border-t-[#e55a3d] rounded-full animate-spin mb-4"></div>
                        <p className="font-dm text-gray-600">Conectando con el correo...</p>
                    </div>
                ) : shipmentData ? (
                    <div className="flex flex-col gap-4">
                        
                        {/* Bloque del Estado del Envío */}
                        <div className="bg-[#e9e6df] rounded-xl p-5 border border-[#d6d3cd]">
                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-dm">Estado Actual</p>
                            <p className="font-syne text-2xl font-semibold text-[#e55a3d] capitalize">
                                {formatEstado(shipmentData.estado)}
                            </p>
                        </div>

                        {/* NUEVO BLOQUE: Dirección de Entrega */}
                        {direccion && (
                            <div className="bg-[#e9e6df] rounded-xl p-5 border border-[#d6d3cd] font-dm text-sm text-gray-800">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-dm">Destino de Entrega</p>
                                <p className="font-medium text-black text-base">{direccion.calle}</p>
                                <p className="text-gray-600 mt-0.5">
                                    {direccion.ciudad}, {direccion.provincia}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    CP: {direccion.cod_postal} - {direccion.pais}
                                </p>
                            </div>
                        )}

                        {/* Datos del Código y Fecha */}
                        <div className="grid grid-cols-2 gap-4 font-dm mt-2 bg-[#e9e6df]/40 p-4 rounded-xl border border-[#d6d3cd]/50">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Código</p>
                                <p className="font-medium text-black tracking-wide text-sm truncate" title={shipmentData.codigoSeguimiento}>
                                    {shipmentData.codigoSeguimiento}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Llegada Estimada</p>
                                <p className="font-medium text-black text-sm">
                                    {new Date(shipmentData.fechaEntregaEstimada || shipmentData.fechaEntregaEstimada).toLocaleDateString('es-AR')}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="font-dm text-gray-600">No pudimos encontrar la información de este envío.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <button 
                onClick={handleOpenModal}
                className="font-dm text-sm font-medium bg-[#e55a3d] text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            >
                Seguir Envío
            </button>

            {isOpen && isMounted && createPortal(modalContent, document.body)}
        </>
    )
}