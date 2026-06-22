
import { ShippingEstimate, ShipmentResponse } from '../definitions';
import { simularCalculoEnvio, mockShipments} from '../placeholder-data';

const SHIPPING_API_URL = process.env.NEXT_PUBLIC_SHIPPING_API_URL;


//7. Calcular costo de envío
//GET /api/shipments/estimate
//mockeado
// TODO: BORRAR CUANDO SE INTEGRE LA API REAL
export async function getShippingEstimate(
  origen_cp: string, 
  destino_cp: string, 
  peso: number,
  token: string 
): Promise<ShippingEstimate> {
  

  return simularCalculoEnvio(origen_cp, destino_cp, peso);
}

//para integrar cuando este la api lista
//TODO: DESCOMENTAR CUANDO LA API ESTE LISTA
// export async function getShippingEstimate(
//   origen_cp: string, 
//   destino_cp: string, 
//   peso: number,
//   token: string // Ahora es un parámetro obligatorio
// ): Promise<ShippingEstimate> {
  
  
//   const url = new URL(`${SHIPPING_API_URL}/api/shipments/estimate`);

//   url.searchParams.append("origen_cp", origen_cp);
//   url.searchParams.append("destino_cp", destino_cp);
//   url.searchParams.append("peso", peso.toString());

//   try {
//     const response = await fetch(url.toString(), {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}` // El token se envía siempre
//       },
//     });

//     if (!response.ok) {
//       // Manejo de errores según tu convención JSON
//       const errorData = await response.json();
//       throw new Error(`${errorData.error}: ${errorData.mensaje}`);
//     }

//     const data = await response.json();

//     return {
//       costo: data.costo,
//       fechaEntregaEstimada: data["fechaEntregaEstimada "] || data.fechaEntregaEstimada
//     };

//   } catch (error) {
//     console.error("Falló la llamada a la API de envíos:", error);
//     throw error;
//   }
// }








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