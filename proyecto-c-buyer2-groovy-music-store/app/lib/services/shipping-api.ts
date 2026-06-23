
'use server'
import { ShippingEstimate, ShipmentResponse } from '../definitions';
import { simularCalculoEnvio, mockShipments} from '../placeholder-data';
import { SignJWT } from "jose";

const SHIPPING_API_URL = process.env.NEXT_PUBLIC_SHIPPING_API_URL;



//7. Calcular costo de envío
//GET /api/shipments/estimate
export async function getShippingEstimate(
  origen_cp: string, 
  destino_cp: string, 
  peso: number,
): Promise<ShippingEstimate> {
  
  
  const secret = process.env.SHIPPING_JWT_SECRET;
  if (!secret) {
    throw new Error("SHIPPING_JWT_SECRET no está definido en el archivo .env");
  }

  const secretKey = new TextEncoder().encode(secret);

  
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" }) // Algoritmo estándar de firma
    .setIssuedAt()
    .setExpirationTime("5m") 
    .sign(secretKey);

    
  const url = new URL(`${SHIPPING_API_URL}/api/shipments/estimate`);
  url.searchParams.append("origen_cp", origen_cp);
  url.searchParams.append("destino_cp", destino_cp);
  url.searchParams.append("peso", peso.toString());

  try {
    
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.error}: ${errorData.mensaje}`);
    }

    const data = await response.json();

    return {
      costo: data.costo,
      fechaEntregaEstimada: data["fechaEntregaEstimada "] || data.fechaEntregaEstimada
    };

  } catch (error) {
    console.error("Falló la llamada a la API de envíos:", error);
    throw error;
  }
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