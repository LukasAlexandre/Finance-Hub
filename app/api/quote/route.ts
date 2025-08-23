import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || searchParams.get("ticker");
  const type = searchParams.get("type") || "Ação";
  if (!symbol) {
    return NextResponse.json({ error: "Ticker não informado" }, { status: 400 });
  }
  try {
    let price: number | undefined = undefined;
    if (type === "Criptomoeda") {
      // Busca preço de cripto usando CoinGecko API
      const cgIdMap: Record<string, string> = {
        BTC: "bitcoin",
        ETH: "ethereum",
        SOL: "solana",
        ADA: "cardano",
        XRP: "ripple",
        DOGE: "dogecoin",
        BNB: "binancecoin",
        MATIC: "matic-network",
        DOT: "polkadot",
        AVAX: "avalanche-2"
      };
      const cgId = cgIdMap[symbol.toUpperCase()];
      if (!cgId) {
        return NextResponse.json({ error: "Criptomoeda não suportada" }, { status: 404 });
      }
      const cgRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=brl`);
      const cgData = await cgRes.json();
      price = cgData?.[cgId]?.brl;
    } else {
      // Busca preço usando a API pública Brapi (https://brapi.dev/)
      const token = process.env.BRAPI_TOKEN || "voxVZCS7UbwHWupkRzkX4y";
      const brapiRes = await fetch(`https://brapi.dev/api/quote/${symbol}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const brapiData = await brapiRes.json();
      price = brapiData?.results?.[0]?.regularMarketPrice;
    }
    if (price === undefined) {
      return NextResponse.json({ error: "Preço não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ price });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao buscar preço" }, { status: 500 });
  }
}
