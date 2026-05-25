
import { ShippingEstimate } from '../definitions';
import { simularCalculoEnvio } from '../placeholder-data';

export async function getShippingEstimate(
  origen_cp: string, 
  destino_cp: string, 
  peso: number
): Promise<ShippingEstimate> {
  
  return simularCalculoEnvio(origen_cp, destino_cp, peso);
}