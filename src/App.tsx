import { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from "recharts";

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────

const INITIAL_ASSETS = [
  { id: 1,  name: "Apple Inc.",     ticker: "AAPL", type: "Aandeel", sector: "Technologie", country: "VS", currency: "USD", qty: 15,   avgBuy: 148.50,  current: 189.30,  flag: "🇺🇸" },
  { id: 2,  name: "NVIDIA Corp.",   ticker: "NVDA", type: "Aandeel", sector: "Technologie", country: "VS", currency: "USD", qty: 8,    avgBuy: 420.00,  current: 875.50,  flag: "🇺🇸" },
  { id: 3,  name: "Bitcoin",        ticker: "BTC",  type: "Crypto",  sector: "Crypto",      country: "—",  currency: "USD", qty: 0.45, avgBuy: 28500,   current: 67200,   flag: "₿", coingeckoId: "bitcoin" },
  { id: 4,  name: "Ethereum",       ticker: "ETH",  type: "Crypto",  sector: "Crypto",      country: "—",  currency: "USD", qty: 3.2,  avgBuy: 1800,    current: 3450,    flag: "Ξ", coingeckoId: "ethereum" },
  { id: 5,  name: "VWCE ETF",       ticker: "VWCE", type: "ETF",     sector: "Wereldwijd",  country: "EU", currency: "EUR", qty: 40,   avgBuy: 95.20,   current: 118.40,  flag: "🇪🇺" },
  { id: 6,  name: "Microsoft",      ticker: "MSFT", type: "Aandeel", sector: "Technologie", country: "VS", currency: "USD", qty: 10,   avgBuy: 285.00,  current: 415.20,  flag: "🇺🇸" },
  { id: 7,  name: "ASML Holding",   ticker: "ASML", type: "Aandeel", sector: "Technologie", country: "NL", currency: "EUR", qty: 5,    avgBuy: 620.00,  current: 780.00,  flag: "🇳🇱" },
  { id: 8,  name: "Solana",         ticker: "SOL",  type: "Crypto",  sector: "Crypto",      country: "—",  currency: "USD", qty: 25,   avgBuy: 95,      current: 165,     flag: "◎", coingeckoId: "solana" },
  { id: 9,  name: "Amazon.com",     ticker: "AMZN", type: "Aandeel", sector: "E-commerce",  country: "VS", currency: "USD", qty: 12,   avgBuy: 132.00,  current: 185.50,  flag: "🇺🇸" },
  { id: 10, name: "Cash (EUR)",     ticker: "EUR",  type: "Cash",    sector: "Cash",        country: "EU", currency: "EUR", qty: 1,    avgBuy: 4200,    current: 4200,    flag: "💶"  },
];

const NEWS = [
  { id: 1, source: "Bloomberg",      title: "NVIDIA's AI Chip Dominance Set to Continue",          summary: "Analisten verwachten dat NVIDIA zijn marktaandeel in AI-versnellers verder uitbreidt.", sentiment: "positief", asset: "NVDA", time: "2u geleden",  impact: "Positief voor NVDA (+2.3% verwacht)" },
  { id: 2, source: "Reuters",        title: "Bitcoin ETF Inflows Reach Record High This Week",     summary: "Institutionele instroom in Bitcoin ETF's bereikte deze week een recordniveau.", sentiment: "positief", asset: "BTC",  time: "4u geleden",  impact: "Positief voor BTC — hogere vraag verwacht" },
  { id: 3, source: "Financial Times",title: "Apple Plans Major AI Integration Across Product Line",  summary: "Apple kondigde aan dat AI-functionaliteiten in alle producten worden geïntegreerd.", sentiment: "positief", asset: "AAPL", time: "6u geleden",  impact: "Positief voor AAPL — groeikatalysator" },
  { id: 4, source: "CNBC",           title: "Fed Signals Possible Rate Cuts Later This Year",       summary: "De Federal Reserve hintte op mogelijke renteverlagingen in de komende kwartalen.", sentiment: "positief", asset: "Markt",time: "8u geleden",  impact: "Breed positief voor tech-portefeuilles" },
];

const CHART_PERIODS = {
  "1U":    [ {date:"09:00",value:50200},{date:"10:00",value:50650},{date:"11:00",value:50420},{date:"12:00",value:51100},{date:"13:00",value:50880},{date:"14:00",value:51340},{date:"15:00",value:51620},{date:"16:00",value:51800} ],
  "1D":    [ {date:"09:00",value:49400},{date:"10:30",value:50100},{date:"12:00",value:49800},{date:"13:30",value:50600},{date:"15:00",value:51200},{date:"16:30",value:51800} ],
  "1W":    [ {date:"Ma",value:49200},{date:"Di",value:50100},{date:"Wo",value:49600},{date:"Do",value:51200},{date:"Vr",value:50800},{date:"Za",value:51800} ],
  "1M":    [ {date:"1 Apr",value:46800},{date:"8 Apr",value:47600},{date:"15 Apr",value:48200},{date:"22 Apr",value:47900},{date:"29 Apr",value:49100},{date:"6 Mei",value:50400},{date:"13 Mei",value:51800} ],
  "1J":    [ {date:"Jun",value:38100},{date:"Jul",value:40200},{date:"Aug",value:39400},{date:"Sep",value:42000},{date:"Okt",value:43800},{date:"Nov",value:45600},{date:"Dec",value:44200},{date:"Jan",value:46500},{date:"Feb",value:48100},{date:"Mar",value:47100},{date:"Apr",value:49600},{date:"Mei",value:51800} ],
  "Alles": [ {date:"Nov '23",value:24000},{date:"Jan '24",value:28500},{date:"Mar '24",value:32000},{date:"Jun '24",value:35400},{date:"Sep '24",value:38200},{date:"Nov '24",value:41500},{date:"Jan '25",value:39800},{date:"Mar '25",value:44200},{date:"Mei '25",value:47100},{date:"Jul '25",value:45600},{date:"Okt '25",value:49200},{date:"Mei '26",value:51800} ],
};

const PERIOD_STATIC = {
  "1U":  { eur: 160,   pct: 0.31 },
  "1D":  { eur: 1103,  pct: 2.13 },
  "1W":  { eur: 2600,  pct: 5.28 },
  "1M":  { eur: 5000,  pct: 10.7 },
  "1J":  { eur: 13700, pct: 35.9 },
};

const PIE_COLORS = ["#7c6af7", "#38bdf8", "#22d3a0", "#f5a623", "#f4645f"];
const TYPE_FLAGS = { "Aandeel": "📈", "Crypto": "🪙", "ETF": "🌐", "Cash": "💶" };
const SECTOR_OPTIONS = ["Technologie", "Crypto", "Wereldwijd", "E-commerce", "Energie", "Gezondheidszorg", "Financiën", "Cash", "Overig"];
const TYPE_OPTIONS   = ["Aandeel", "Crypto", "ETF", "Cash"];
const COUNTRY_OPTIONS= ["VS", "EU", "NL", "BE", "UK", "DE", "JP", "CN", "—"];

const NAV = {
  home:      (act) => <span style={{color: act?"var(--accent2)":"var(--muted)", fontSize:20}}>📊</span>,
  portfolio: (act) => <span style={{color: act?"var(--accent2)":"var(--muted)", fontSize:20}}>💼</span>,
  news:      (act) => <span style={{color: act?"var(--accent2)":"var(--muted)", fontSize:20}}>📰</span>,
  settings:  (act) => <span style={{color: act?"var(--accent2)":"var(--muted)", fontSize:20}}>⚙️</span>,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function enrich(assets) {
  return assets.map(a => {
    const currentVal = a.qty * a.current;
    const buyVal     = a.qty * a.avgBuy;
    const pnl        = currentVal - buyVal;
    const pnlPct     = buyVal === 0 ? 0 : ((currentVal - buyVal) / buyVal) * 100;
    return { ...a, currentVal, buyVal, pnl, pnlPct };
  });
}

function fmt(n) {
  return Number(n).toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <span style={{color: "var(--accent2)"}}>€{fmt(payload[0].value)}</span>
      </div>
    );
  }
  return null;
}

function DonutChart({ data, colors }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{display:"flex", alignItems:"center", gap:14}}>
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" strokeWidth={0} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{flex:1, display: 'flex', flexDirection: 'column', gap: 6}}>
        {data.filter(d=>d.value>0).map((d, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length]}}/>
            <span style={{fontSize: 12, color: 'var(--muted)', flex: 1}}>{d.name}</span>
            <span style={{fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)'}}>
              {total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────

function AddAssetModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name:"", ticker:"", type:"Aandeel", sector:"Technologie",
    country:"VS", currency:"EUR", qty:"", avgBuy:"", current:""
  });
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  function handleAdd() {
    if (!form.name || !form.ticker || !form.qty || !form.avgBuy || !form.current) return;
    
    const generatedGeckoId = form.type === "Crypto"
      ? form.name.toLowerCase().trim().replace(/\s+/g, '-')
      : undefined;

    onAdd({
      ...form,
      id: Date.now(),
      qty: parseFloat(form.qty),
      avgBuy: parseFloat(form.avgBuy),
      current: parseFloat(form.current),
      flag: TYPE_FLAGS[form.type] || "📈",
      coingeckoId: generatedGeckoId
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle"/>
        <div className="modal-title">Positie toevoegen</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Naam</label><input className="form-input" placeholder="Bijv. Bitcoin of Apple" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Ticker</label><input className="form-input" placeholder="AAPL / BTC" value={form.ticker} onChange={e=>set("ticker",e.target.value.toUpperCase())}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>set("type",e.target.value)}>{TYPE_OPTIONS.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Sector</label><select className="form-select" value={form.sector} onChange={e=>set("sector",e.target.value)}>{SECTOR_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Land</label><select className="form-select" value={form.country} onChange={e=>set("country",e.target.value)}>{COUNTRY_OPTIONS.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Valuta</label><select className="form-select" value={form.currency} onChange={e=>set("currency",e.target.value)}>{["EUR","USD","GBP","CHF"].map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="form-group"><label className="form-label">Aantal</label><input className="form-input" type="number" placeholder="10" value={form.qty} onChange={e=>set("qty",e.target.value)}/></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Aankoopprijs (€)</label><input className="form-input" type="number" placeholder="150.00" value={form.avgBuy} onChange={e=>set("avgBuy",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Huidige koers (€)</label><input className="form-input" type="number" placeholder="Indien crypto: live via API" value={form.current} onChange={e=>set("current",e.target.value)}/></div>
        </div>
        <button className="btn-primary" onClick={handleAdd}>✓ Toevoegen aan portfolio</button>
        <button className="btn-cancel" onClick={onClose}>Annuleren</button>
      </div>
    </div>
  );
}

function EditAssetModal({ asset, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    name: asset.name, ticker: asset.ticker, type: asset.type,
    sector: asset.sector, country: asset.country, currency: asset.currency,
    qty: String(asset.qty), avgBuy: String(asset.avgBuy), current: String(asset.current),
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  function handleSave() {
    if (!form.qty || !form.avgBuy || !form.current) return;
    onSave({ 
      ...asset, 
      ...form, 
      qty: parseFloat(form.qty), 
      avgBuy: parseFloat(form.avgBuy), 
      current: parseFloat(form.current), 
      flag: TYPE_FLAGS[form.type] || asset.flag 
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle"/>
        <div className="modal-title">{asset.ticker} bewerken</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Naam</label><input className="form-input" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Ticker</label><input className="form-input" value={form.ticker} onChange={e=>set("ticker",e.target.value.toUpperCase())}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>set("type",e.target.value)}>{TYPE_OPTIONS.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Sector</label><select className="form-select" value={form.sector} onChange={e=>set("sector",e.target.value)}>{SECTOR_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="form-group"><label className="form-label">Aantal</label><input className="form-input" type="number" value={form.qty} onChange={e=>set("qty",e.target.value)}/></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Aankoopprijs (€)</label><input className="form-input" type="number" value={form.avgBuy} onChange={e=>set("avgBuy",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Huidige koers (€)</label><input className="form-input" type="number" disabled={!!asset.coingeckoId} placeholder={asset.coingeckoId ? "Live via API" : ""} value={form.current} onChange={e=>set("current",e.target.value)}/></div>
        </div>
        <button className="btn-primary" onClick={handleSave}>Opslaan</button>
        {!confirmDelete
          ? <button className="btn-danger" onClick={()=>setConfirmDelete(true)}>🗑 Verwijderen uit portfolio</button>
          : <button className="btn-danger" onClick={()=>{onDelete(asset.id); onClose();}}>⚠️ Bevestig verwijderen</button>
        }
        <button className="btn-cancel" onClick={onClose}>Annuleren</button>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ assets, onAdd, onEdit }) {
  const [period, setPeriod] = useState("1D");
  const enriched = useMemo(() => enrich(assets), [assets]);

  const totalValue = enriched.reduce((s, a) => s + a.currentVal, 0);
  const totalCost  = enriched.reduce((s, a) => s + a.buyVal, 0);
  const totalPnL   = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const periodPnl = period === "Alles" ? { eur: totalPnL, pct: totalPnLPct } : PERIOD_STATIC[period] || {eur:0, pct:0};
  const isPos = periodPnl.eur >= 0;
  const periods = ["1U", "1D", "1W", "1M", "1J", "Alles"];
  const chartData = CHART_PERIODS[period] || CHART_PERIODS["1D"];

  return (
    <div className="content">
      <div className="hero">
        <div className="hero-label">Totale Portefeuillewaarde</div>
        <div className="hero-value">€{fmt(totalValue)}</div>
        <div className="hero-row">
          <span className={"badge " + (isPos ? "green" : "red")}>
            {isPos ? "▲" : "▼"} €{fmt(Math.abs(periodPnl.eur))} ({period})
          </span>
          <span className={"badge " + (isPos ? "green" : "red")}>
            {isPos ? "+" : ""}{Number(periodPnl.pct).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="card" style={{paddingBottom: 14}}>
        <div style={{display: "flex", gap: 3, marginBottom: 14}}>
          {periods.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              flex: 1, padding: "5px 0", borderRadius: 8, fontSize: 11, fontWeight: 700,
              fontFamily: "var(--mono)", border: "none", cursor: "pointer", transition: "all 0.18s",
              background: period === p ? "var(--accent)" : "transparent",
              color: period === p ? "#fff" : "var(--muted)",
            }}>{p}</button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={148}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cgrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#cgrad)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-title">Top Holdings</div>
        {enriched.slice(0, 3).map(asset => (
          <div key={asset.id} className="asset-item" onClick={() => onEdit(asset)}>
            <div className="asset-icon">{asset.flag}</div>
            <div className="asset-info">
              <div className="asset-name">{asset.name}</div>
              <div className="asset-ticker">{asset.qty} {asset.ticker}</div>
            </div>
            <div className="asset-right">
              <div className="asset-value">€{fmt(asset.currentVal)}</div>
              <div className={"asset-pnl " + (asset.pnl >= 0 ? "text-green" : "text-red")}>
                {asset.pnl >= 0 ? "+" : ""}€{fmt(asset.pnl)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioPage({ assets, onEdit, onDelete }) {
  const enriched = useMemo(() => enrich(assets), [assets]);
  const byType = useMemo(() => {
    return TYPE_OPTIONS.map(t => ({
      name: t, value: enriched.filter(a => a.type === t).reduce((s, a) => s + a.currentVal, 0)
    }));
  }, [enriched]);

  return (
    <div className="content">
      <div className="card">
        <div className="card-title">Allokatie per Type</div>
        <DonutChart data={byType} colors={PIE_COLORS} />
      </div>

      <div className="card">
        <div className="card-title">Alle Activa ({assets.length})</div>
        {enriched.map(asset => (
          <div key={asset.id} className="asset-item" onClick={() => onEdit(asset)}>
            <div className="asset-icon">{asset.flag}</div>
            <div className="asset-info">
              <div className="asset-name">{asset.name}</div>
              <div className="asset-ticker">{asset.qty} {asset.ticker}</div>
            </div>
            <div className="asset-right">
              <div className="asset-value">€{fmt(asset.currentVal)}</div>
              <div className={"asset-pnl " + (asset.pnl >= 0 ? "text-green" : "text-red")}>
                {asset.pnl >= 0 ? "+" : ""}{asset.pnlPct.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsPage() {
  return (
    <div className="content">
      <div className="card">
        <div className="card-title">Marktnieuws & Sentiment</div>
        {NEWS.map(n => (
          <div key={n.id} className="news-item">
            <div className="news-meta">
              <span className="news-source">{n.source}</span>
              <span className="news-time">{n.time}</span>
            </div>
            <div className="news-title">{n.title}</div>
            <div className="news-summary">{n.summary}</div>
            <div className="news-footer">
              <span className={"sentiment-badge " + n.sentiment}>{n.sentiment}</span>
              <span className="news-impact">{n.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage({ assetCount }) {
  return (
    <div className="content">
      <div className="card">
        <div className="card-title">Instellingen</div>
        <div style={{padding: '10px 0', borderBottom: '1px solid var(--border)'}}>Valuta: <b>EUR (€)</b></div>
        <div style={{padding: '10px 0', borderBottom: '1px solid var(--border)'}}>Totaal posities: <b>{assetCount}</b></div>
        <div style={{padding: '10px 0', color: 'var(--muted)', fontSize: 12}}>Watch me invest v1.2.0 — Live Crypto API via CoinGecko</div>
      </div>
    </div>
  );
}

// ─── STYLES (CSS) ─────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
:root {
  --bg: #09090f; --surface: #111118; --surface2: #18181f;
  --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.1);
  --text: #f0f0f8; --muted: #6b6b8a;
  --accent: #7c6af7; --accent2: #a78bfa;
  --green: #22d3a0; --red: #f4645f; --gold: #f5a623; --blue: #38bdf8;
  --font: 'Sora', sans-serif; --mono: 'JetBrains Mono', monospace;
}
* { margin: 0; padding: 0; box-size: border-box; -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100dvh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.app { max-width: 430px; margin: 0 auto; min-height: 100dvh; background: var(--bg); padding-bottom: 90px; }
.header { position: sticky; top: 0; z-index: 100; background: rgba(9,9,15,0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 14px 20px 12px; display: flex; align-items: center; justify-content: space-between; }
.header-logo { font-size: 15px; font-weight: 700; background: linear-gradient(135deg, var(--accent2), var(--blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.3px; }
.header-right { display: flex; gap: 8px; align-items: center; }
.icon-btn { width: 34px; height: 34px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 15px; transition: all 0.2s; }
.icon-btn:active { transform: scale(0.92); }
.tabs { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; z-index: 100; background: rgba(9,9,15,0.93); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid var(--border); padding: 8px 0 max(8px, env(safe-area-inset-bottom)); display: flex; }
.tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 0; cursor: pointer; transition: all 0.2s; }
.tab-label { font-size: 10px; font-weight: 500; color: var(--muted); transition: color 0.2s; letter-spacing: 0.3px; }
.tab.active .tab-label { color: var(--accent2); }
.tab-icon-wrap { transition: transform 0.2s; }
.tab.active .tab-icon-wrap { transform: translateY(-2px); }
.tab:active .tab-icon-wrap { transform: scale(0.88); }
.content { padding: 0 0 20px; animation: fadeIn 0.25s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 18px; margin: 0 16px 12px; }
.card-title { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; }
.hero { padding: 22px 20px 18px; text-align: center; }
.hero-label { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
.hero-value { font-size: 40px; font-weight: 700; letter-spacing: -2px; font-family: var(--mono); background: linear-gradient(135deg, #fff 0%, var(--accent2) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; margin-bottom: 12px; }
.hero-row { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: var(--mono); }
.badge.green { background: rgba(34,211,160,0.12); color: var(--green); border: 1px solid rgba(34,211,160,0.2); }
.badge.red { background: rgba(244,100,95,0.12); color: var(--red); border: 1px solid rgba(244,100,95,0.2); }
.asset-item { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: opacity 0.15s; }
.asset-item:last-child { border-bottom: none; padding-bottom: 0; }
.asset-item:first-child { padding-top: 0; }
.asset-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--surface2); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
.asset-info { flex: 1; min-width: 0; }
.asset-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.asset-ticker { font-size: 11px; color: var(--muted); font-family: var(--mono); margin-top: 1px; }
.asset-right { text-align: right; flex-shrink: 0; }
.asset-value { font-size: 13px; font-weight: 600; font-family: var(--mono); }
.asset-pnl { font-size: 11px; font-family: var(--mono); margin-top: 2px; }
.text-green { color: var(--green); } .text-red { color: var(--red); } .text-muted { color: var(--muted); }
.news-item { padding: 14px 0; border-bottom: 1px solid var(--border); }
.news-item:last-child { border-bottom: none; }
.news-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.news-source { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--accent2); }
.news-time { font-size: 11px; color: var(--muted); }
.news-title { font-size: 14px; font-weight: 600; line-height: 1.4; margin-bottom: 6px; }
.news-summary { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 8px; }
.news-footer { display: flex; align-items: center; justify-content: space-between; }
.sentiment-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; }
.sentiment-badge.positief { background: rgba(34,211,160,0.12); color: var(--green); }
.sentiment-badge.negatief { background: rgba(244,100,95,0.12); color: var(--red); }
.sentiment-badge.neutraal { background: rgba(107,107,138,0.12); color: var(--muted); }
.news-impact { font-size: 11px; color: var(--muted); }
.custom-tooltip { background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 8px 12px; font-family: var(--mono); font-size: 12px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: flex-end; justify-content: center; animation: fadeIn 0.2s ease; }
.modal { background: var(--surface); border: 1px solid var(--border2); border-radius: 24px 24px 0 0; padding: 20px 20px max(20px, env(safe-area-inset-bottom)); width: 100%; max-width: 430px; max-height: 90dvh; overflow-y: auto; }
.modal-handle { width: 36px; height: 4px; background: var(--border2); border-radius: 2px; margin: 0 auto 18px; }
.modal-title { font-size: 17px; font-weight: 700; margin-bottom: 18px; letter-spacing: -0.3px; }
.form-group { margin-bottom: 14px; }
.form-label { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; display: block; }
.form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: 12px; padding: 11px 14px; font-family: var(--font); font-size: 14px; color: var(--text); outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--accent); }
.form-select { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: 12px; padding: 11px 14px; font-family: var(--font); font-size: 14px; color: var(--text); outline: none; cursor: pointer; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn-primary { width: 100%; padding: 14px; border-radius: 14px; border: none; background: var(--accent); color: #fff; font-family: var(--font); font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 6px; }
.btn-danger { width: 100%; padding: 12px; border-radius: 14px; border: 1px solid rgba(244,100,95,0.3); background: rgba(244,100,95,0.08); color: var(--red); font-family: var(--font); font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 8px; }
.btn-cancel { width: 100%; padding: 12px; border-radius: 14px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: var(--font); font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 8px; }
`;

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [isLoaded, setIsLoaded] = useState(false); // Waterdichte check voor laden

  const [showAdd, setShowAdd] = useState(false);
  const [editAsset, setEditAsset] = useState(null);

  // STAP A: Eerst data ophalen bij opstarten
  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio_assets");
      if (saved) {
        setAssets(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Fout bij laden van localStorage", e);
    }
    setIsLoaded(true); // Pas nu mag er worden opgeslagen!
  }, []);

  // STAP B: Alleen opslaan ALS het laden klaar is en de assets veranderen
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("portfolio_assets", JSON.stringify(assets));
    }
  }, [assets, isLoaded]);

  // STAP C: Realtime CoinGecko API Engine (Met stabiele intervallen)
  useEffect(() => {
    if (!isLoaded) return;

    async function fetchLivePrices() {
      const cryptoIds = assets
        .filter(a => a.coingeckoId)
        .map(a => a.coingeckoId)
        .join(",");

      if (!cryptoIds) return;

      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=eur`;
        const response = await fetch(url);
        const data = await response.json();

        setAssets(prevAssets => {
          const hasChanges = prevAssets.some(asset => 
            asset.coingeckoId && data[asset.coingeckoId] && asset.current !== data[asset.coingeckoId].eur
          );

          if (!hasChanges) return prevAssets;

          return prevAssets.map(asset => {
            if (asset.coingeckoId && data[asset.coingeckoId]) {
              return {
                ...asset,
                current: data[asset.coingeckoId].eur
              };
            }
            return asset;
          });
        });
      } catch (error) {
        console.error("CoinGecko API fout:", error);
      }
    }

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000);
    return () => clearInterval(interval);
  }, [isLoaded, assets.length]); // Start API als laden klaar is of lengte verandert

  function handleAdd(asset) {
    setAssets(prev => [...prev, asset]);
  }

  function handleSave(updated) {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
  }

  function handleDelete(id) {
    setAssets(prev => prev.filter(a => a.id !== id));
  }

  const navItems = [
    {id:"home",label:"Dashboard"},
    {id:"portfolio",label:"Portfolio"},
    {id:"news",label:"Nieuws"},
    {id:"settings",label:"Instellingen"},
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-logo">◈ Watch me invest</div>
          <div className="header-right">
            <div className="icon-btn" onClick={()=>setShowAdd(true)} title="Positie toevoegen">＋</div>
          </div>
        </div>

        <div>
          {tab==="home"      && <HomePage      assets={assets} onAdd={()=>setShowAdd(true)} onEdit={setEditAsset}/>}
          {tab==="portfolio" && <PortfolioPage assets={assets} onEdit={setEditAsset} onDelete={handleDelete}/>}
          {tab==="news"      && <NewsPage/>}
          {tab==="settings"  && <SettingsPage assetCount={assets.length}/>}
        </div>

        <div className="tabs">
          {navItems.map(item=>(
            <div key={item.id} className={"tab"+(tab===item.id?" active":"")} onClick={()=>setTab(item.id)}>
              <div className="tab-icon-wrap">{NAV[item.id](tab===item.id)}</div>
              <span className="tab-label">{item.label}</span>
            </div>
          ))}
        </div>

        {showAdd && <AddAssetModal onClose={()=>setShowAdd(false)} onAdd={handleAdd}/>}
        {editAsset && <EditAssetModal asset={editAsset} onClose={()=>setEditAsset(null)} onSave={handleSave} onDelete={handleDelete}/>}
      </div>
    </>
  );
}