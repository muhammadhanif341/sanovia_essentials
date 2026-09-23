/**
 * Shipping — query layer over data/shipping.js, same seam pattern as productRepository.js
 * (today: static config; later: a real rates API/table behind these same function names).
 */
import { shippingMethods, getShippingMethod, FREE_SHIPPING_THRESHOLD, FREE_SHIPPING_METHOD_ID } from '@/data/shipping';

/** All shipping methods available for a region. `region` is accepted for a future per-country rate table. */
export const getShippingMethods = (_region) => shippingMethods;

/** The delivery cost for a method given the order subtotal (honours the free-shipping threshold). */
export function calculateShippingCost(methodId, subtotal) {
  const method = getShippingMethod(methodId);
  if (!method) return 0;
  if (
    methodId === FREE_SHIPPING_METHOD_ID &&
    FREE_SHIPPING_THRESHOLD != null &&
    subtotal >= FREE_SHIPPING_THRESHOLD
  ) {
    return 0;
  }
  return method.price;
}

export { getShippingMethod };
