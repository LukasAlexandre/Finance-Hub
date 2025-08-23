import React, { useState } from "react";
import { useState as useTimeoutState, useEffect as useTimeoutEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Exemplo de lista de ações e FIIs (pode ser substituída por uma API real)
const stockList = [
  "PETR4", "VALE3", "ITUB4", "BBDC4", "BBAS3", "ABEV3", "MGLU3", "WEGE3", "B3SA3", "RENT3"
];
const fiiList = [
  "HGLG11", "MXRF11", "KNRI11", "VISC11", "XPLG11", "BCFF11", "VILG11", "HCTR11", "XPML11", "RBRF11"
];
const cryptoList = [
  "BTC", "ETH", "SOL", "ADA", "XRP", "DOGE", "BNB", "MATIC", "DOT", "AVAX"
];

type AssetType = "Ação" | "FII" | "Renda Fixa" | "Criptomoeda";

export function ManualAssetInput({ onSave }: { onSave?: (data: any) => void }) {
  const [manualMode, setManualMode] = useState(false);
  const [type, setType] = useState<AssetType>("Ação");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [showSuccess, setShowSuccess] = useState(false);
  const [monthName, setMonthName] = useState<string>("");

  // Atualiza o mês por extenso ao mudar a data
  React.useEffect(() => {
    if (purchaseDate) {
      try {
        const dateObj = parseISO(purchaseDate);
        const mes = format(dateObj, 'MMMM', { locale: ptBR });
        setMonthName(mes.charAt(0).toUpperCase() + mes.slice(1));
      } catch {
        setMonthName("");
      }
    } else {
      setMonthName("");
    }
  }, [purchaseDate]);

  async function fetchAssetPrice(ticker: string) {
    setLoading(true);
    try {
      let url = '';
      if (type === "Criptomoeda") {
        url = `/api/quote?symbol=${ticker}&type=Criptomoeda`;
      } else {
        url = `/api/quote?symbol=${ticker}&type=${type}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setPrice(data.price ?? null);
    } catch {
      setPrice(null);
    } finally {
      setLoading(false);
    }
  }

  function handleTickerChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setTicker(e.target.value);
    if (e.target.value && type !== "Renda Fixa") fetchAssetPrice(e.target.value);
    if (type === "Renda Fixa") setPrice(Number(e.target.value) || null);
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuantity(Number(e.target.value));
    if (type === "Renda Fixa") setPrice(Number(e.target.value) || null);
  }

  async function handleSave() {
    if (type === "Renda Fixa" ? quantity : ticker && price) {
      const asset = { type, ticker, quantity, price, total: price ? price * quantity : 0, purchaseDate };
      try {
        await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(asset),
        });
        if (onSave) onSave(asset);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch {
        // TODO: tratar erro
      }
    }
  }

  const formatBRL = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg max-w-md bg-white space-y-4">
      {showSuccess && (
        <div className="mb-2 p-2 rounded bg-green-100 text-green-800 text-center font-semibold animate-fade-in">Ativo cadastrado com sucesso!</div>
      )}
      <div>
        <label className="block mb-1 font-semibold text-lg">Tipo de ativo</label>
        <select
          value={type}
          onChange={e => {
            setType(e.target.value as AssetType);
            setTicker("");
            setPrice(null);
          }}
          className="w-full border rounded px-3 py-2 focus:outline-primary bg-white appearance-none pr-8"
        >
          <option value="Ação">Ação</option>
          <option value="FII">FII</option>
          <option value="Renda Fixa">Renda Fixa</option>
          <option value="Criptomoeda">Criptomoeda</option>
        </select>
      </div>
      {type === "Ação" && (
        <div>
          <label className="block mb-1 font-medium">Ação</label>
          <select value={ticker} onChange={handleTickerChange} className="w-full border rounded px-3 py-2 focus:outline-primary bg-white">
            <option value="">Selecione...</option>
            {stockList.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
      {type === "FII" && (
        <div>
          <label className="block mb-1 font-medium">FII</label>
          <select value={ticker} onChange={handleTickerChange} className="w-full border rounded px-3 py-2 focus:outline-primary bg-white">
            <option value="">Selecione...</option>
            {fiiList.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
      {type === "Criptomoeda" && (
        <div>
          <label className="block mb-1 font-medium">Criptomoeda</label>
          <select value={ticker} onChange={handleTickerChange} className="w-full border rounded px-3 py-2 focus:outline-primary bg-white">
            <option value="">Selecione...</option>
            {cryptoList.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
      {type === "Renda Fixa" && (
        <div>
          <label className="block mb-1 font-medium">Valor investido</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full border rounded px-3 py-2 focus:outline-primary"
            placeholder="Valor aplicado"
          />
        </div>
      )}
      {/* Data de compra + mês automático */}
      <div>
        <label className="block mb-1 font-medium">Data de compra</label>
        <input
          type="date"
          value={purchaseDate}
          onChange={e => setPurchaseDate(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-primary"
        />
        {monthName && (
          <div className="mt-1 text-sm text-blue-700 font-semibold">Mês: {monthName}</div>
        )}
      </div>
      {/* Quantidade, preço e total para ativos que não são renda fixa */}
      {(type === "Ação" || type === "FII" || type === "Criptomoeda") && (
        <>
          <div>
            <label className="block mb-1 font-medium">Quantidade</label>
            <input
              type="number"
              min={type === "Criptomoeda" ? 0.00001 : 1}
              step={type === "Criptomoeda" ? "any" : 1}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full border rounded px-3 py-2 focus:outline-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block mb-1 font-medium">Preço atual</label>
              <button
                type="button"
                className={`ml-2 px-2 py-1 rounded text-xs font-semibold border ${manualMode ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'} transition-all`}
                onClick={() => setManualMode(m => !m)}
              >
                {manualMode ? 'Ajuste manual ativado' : 'Ajuste manual'}
              </button>
            </div>
            {manualMode ? (
              <input
                type="number"
                className="w-full border rounded px-3 py-2 focus:outline-primary mt-1"
                value={price ?? ''}
                onChange={e => setPrice(Number(e.target.value))}
                placeholder="Digite o preço manualmente"
                min={0}
                step="any"
              />
            ) : (
              <div className="font-mono text-base text-primary-700">{loading ? "Buscando..." : price !== null ? formatBRL(price) : "-"}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Valor total</label>
            <div className="font-mono text-base text-primary-700">{price !== null ? formatBRL(price * quantity) : "-"}</div>
          </div>
        </>
      )}
      {type === "Renda Fixa" && (
        <div>
          <label className="block mb-1 font-medium">Valor total</label>
          <div className="font-mono text-base text-primary-700">{formatBRL(quantity)}</div>
        </div>
      )}
      <button
        onClick={handleSave}
        className="w-full mt-2 px-4 py-2 bg-primary text-white rounded font-semibold text-base hover:bg-primary/90 disabled:opacity-60 transition-all"
        disabled={type !== "Renda Fixa" ? (!ticker || !price) : !quantity}
      >
        Salvar
      </button>
    </div>
  );
}
