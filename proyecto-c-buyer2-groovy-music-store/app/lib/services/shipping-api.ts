
'use server'
import { ShippingEstimate, ShipmentResponse } from '../definitions';
import { SignJWT } from "jose";
import { getUuidDeOrden } from '../actions/actions-order';

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



export async function getShipmentTracking(displayOrderId: string): Promise<ShipmentResponse | null> {
  try {
    
    const orderUuid = await getUuidDeOrden(displayOrderId);
    
    
    if (!orderUuid) {
      console.error(`No se encontró el UUID para la orden: ${displayOrderId}`);
      return null;
    }

    const secret = new TextEncoder().encode(process.env.SHIPPING_JWT_SECRET);
    
    const token = await new SignJWT({ 
      tipo: "usuario"
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(secret);

    
    const response = await fetch(`${SHIPPING_API_URL}/api/shipments?orderId=${orderUuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error en la API de envíos. Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      codigoSeguimiento: data.codigoSeguimiento, 
      estado: data.estado,
      fechaEntregaEstimada: data.fechaEntregaEstimada, 
      empresa: data.empresa, 
    };

  } catch (error) {
    console.error("Error al obtener el seguimiento del envío:", error);
    return null;
  }
}