'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getShipmentTracking } from '@/app/lib/services/shipping-api'
import { ShipmentResponse } from '@/app/lib/definitions'
import { Direccion } from '@/app/lib/definitions'

export default function TrackOrderButton({ 
    orderId, 
    direccion 
}: { 
    orderId: number | string;
    direccion?: Direccion | null;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); 
    const [shipmentData, setShipmentData] = useState<ShipmentResponse | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleOpenModal = async () => {
        setIsOpen(true);
        setIsLoading(true);
        setError(null); 
        
        try {
            const data = await getShipmentTracking(orderId.toString());
            if (data) {
                setShipmentData(data);
            } else {
                setError("No pudimos encontrar la información de este envío.");
            }
        } catch (error) {
            console.error("Error al rastrear envío:", error);
            setError("Ocurrió un problema de conexión. Por favor, intentá de nuevo más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatEstado = (estado?: string) => {
        if (!estado) return 'Estado desconocido';

        // Normalizamos el texto para evitar problemas de mayúsculas/minúsculas o espacios extra
        const estadoNormalizado = estado.trim().toUpperCase();

        switch (estadoNormalizado) {
            case 'EN PREPARACIÓN':
                return 'En Preparación';
            case 'EN CAMINO':
                return 'En Camino';
            case 'ENTREGADO':
                return 'Entregado';
            default:
                
                return estado.toLowerCase().replace(/\b\w/g, (letra) => letra.toUpperCase());
        }
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-title"
        >
            <div className="bg-[#f2efe9] border border-[#d6d3cd] rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                    aria-label="Cerrar ventana de estado del envío"
                >
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                <h3 id="modal-title" className="font-syne text-2xl font-semibold text-black mb-6">
                    Estado del Envío
                </h3>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10" aria-live="polite">
                        <div className="w-8 h-8 border-4 border-[#e55a3d]/30 border-t-[#e55a3d] rounded-full animate-spin mb-4"></div>
                        <p className="font-dm text-gray-600">Conectando con el correo...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8" role="alert">
                        <p className="font-dm text-[#e55a3d] font-medium">{error}</p>
                    </div>
                ) : shipmentData ? (
                    <div className="flex flex-col gap-4">
                        <div className="bg-[#e9e6df] rounded-xl p-5 border border-[#d6d3cd]">
                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-dm">Estado Actual</p>
                            <p className="font-syne text-2xl font-semibold text-[#e55a3d] capitalize">
                                {formatEstado(shipmentData.estado)}
                            </p>
                        </div>

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

                        <div className="flex flex-col gap-4 font-dm mt-2 bg-[#e9e6df]/40 p-4 rounded-xl border border-[#d6d3cd]/50">
                            {/* Información de la empresa  */}
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Empresa de Transporte</p>
                                <p className="font-medium text-black text-sm">
                                    {shipmentData.empresa?.nombre || "Asignando correo..."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-[#d6d3cd]/50 pt-4 mt-1">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Código</p>
                                    <p className="font-medium text-black tracking-wide text-sm truncate" title={shipmentData.codigoSeguimiento}>
                                        {/* Si no hay código, mostramos un fallback */}
                                        {shipmentData.codigoSeguimiento || "A asignar"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Llegada Estimada</p>
                                    <p className="font-medium text-black text-sm">
                                        {/* Validamos que exista la fecha y que sea válida antes de formatearla */}
                                        {shipmentData.fechaEntregaEstimada && !isNaN(new Date(shipmentData.fechaEntregaEstimada).getTime())
                                            ? new Date(shipmentData.fechaEntregaEstimada).toLocaleDateString('es-AR')
                                            : "A confirmar"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );

    return (
        <>
            <button 
                onClick={handleOpenModal}
                className="font-dm text-sm font-medium bg-primary text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                Seguir Envío
            </button>

            {isOpen && isMounted && createPortal(modalContent, document.body)}
        </>
    )
}