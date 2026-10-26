import { cookies } from "next/headers";
import { BASE_CURRENCY, CURRENCY_COOKIE, isCurrency, type Currency } from "@/lib/currency";

export async function getRequestCurrency(): Promise<Currency> {
  const jar = await cookies();
  const value = jar.get(CURRENCY_COOKIE)?.value;
  return isCurrency(value) ? value : BASE_CURRENCY;
}
