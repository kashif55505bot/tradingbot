const BASE_URL = "https://api.mexc.com";

export async function fetchKlines(symbol: string, interval: string, limit: number = 300) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      { next: { revalidate: 10 } }
    );

    if (!res.ok) throw new Error("Failed to fetch klines");
    return await res.json();
  } catch (error) {
    console.error("MEXC API Error:", error);
    return [];
  }
}

export async function fetchFundingRate(symbol: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v3/fundingRate?symbol=${symbol}`);
    if (!res.ok) throw new Error("Failed to fetch funding rate");
    const data = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error("Funding Rate Error:", error);
    return null;
  }
}
