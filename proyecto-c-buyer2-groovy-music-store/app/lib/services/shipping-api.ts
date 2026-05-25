
import { ShippingEstimate } from '../definitions';
import { simularCalculoEnvio } from '../placeholder-data';


//7. Calcular costo de envío
//GET /api/shipments/estimate
export async function getShippingEstimate(
  origen_cp: string, 
  destino_cp: string, 
  peso: number
): Promise<ShippingEstimate> {
  
  return simularCalculoEnvio(origen_cp, destino_cp, peso);
}