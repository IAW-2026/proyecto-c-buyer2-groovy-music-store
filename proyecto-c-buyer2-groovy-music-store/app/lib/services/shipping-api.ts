
import { ShippingEstimate, ShipmentResponse } from '../definitions';
import { simularCalculoEnvio, mockShipments} from '../placeholder-data';


//7. Calcular costo de envío
//GET /api/shipments/estimate
export async function getShippingEstimate(
  origen_cp: string, 
  destino_cp: string, 
  peso: number
): Promise<ShippingEstimate> {
  
  return simularCalculoEnvio(origen_cp, destino_cp, peso);
}

export async function getShipmentTracking(orderId: string): Promise<ShipmentResponse | null> {
    // 1. Simulamos el tiempo de espera de una API real (800ms)
    await new Promise(resolve => setTimeout(resolve, 800));

    // 2. Simulamos la llamada GET /api/shipments?orderId=:orderId
    const shipment = mockShipments[orderId];

    // Si no está en el mock, devolvemos uno genérico 
    if (!shipment) {
        return {
            id: `mock_ext_${orderId}`,
            codigoSeguimiento: `TRK-${Math.floor(Math.random() * 1000000)}`,
            estado: "en_transito",
            fechaEntregaEstimada: "2026-06-02T00:00:00Z"
        };
    }

    return shipment;
}