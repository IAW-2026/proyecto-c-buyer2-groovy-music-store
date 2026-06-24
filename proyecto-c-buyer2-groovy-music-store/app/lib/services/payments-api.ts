"use server";

import { CheckoutPayload, PaymentServiceResult } from '../definitions';
import { SignJWT } from 'jose'; 

const PAYMENTS_API_URL = process.env.NEXT_PUBLIC_PAYMENTS_API_URL; 

export async function createPaymentCheckout(payload: CheckoutPayload): Promise<PaymentServiceResult> {
    try {
        const url = `${PAYMENTS_API_URL}/api/payments/checkout`;
        
        const secretKey = process.env.PAYMENTS_JWT_SECRET;
        if (!secretKey) {
            throw new Error("Falta configurar JWT_SECRET en las variables de entorno");
        }
        
        const secret = new TextEncoder().encode(secretKey);
        const token = await new SignJWT({ app: 'buyer_app' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('5m')
            .sign(secret);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
            cache: 'no-store' 
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${responseText}`);
        }

        const responseData = JSON.parse(responseText);

        // Retornamos los datos permitiendo ambos formatos por seguridad
        //TODO: ACOMODAR CUANDO NOS PONGAMOS BIEN DE ACUERDO 
        return {
            success: true,
            data: {
                transaccion_id: responseData.transaccion_id || responseData.pagoId,
                init_point: responseData.init_point || responseData.urlCheckout
            }
        };

    } catch (error) {
        console.error("Error al iniciar el checkout de pago:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error desconocido al procesar el pago"
        };
    }
}