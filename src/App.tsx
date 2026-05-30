// @ts-nocheckS
// @ts-ignore
if (typeof window !== 'undefined' && window.crypto && !window.crypto.randomUUID) {
  // @ts-ignore
  window.crypto.randomUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}
import { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from "recharts";

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────

const INITIAL_ASSETS = [
const INITIAL_ASSETS = [
  { id: 1,  name: "Apple Inc.",      ticker: "AAPL", type: "Aandeel", sector: "Technologie", country: "VS", currency: "USD", qty: 15,   avgBuy: 148.50,  current: 189.30,  flag: "🇺🇸" },
  { id: 2,  name: "NVIDIA Corp.",    ticker: "NVDA", type: "Aandeel", sector: "Technologie", country: "VS", currency: "USD", qty: 8,    avgBuy: 420.00,  current: 875.50,  flag: "🇺🇸" },
  // VOEG coingeckoId TOE AAN DE CRYPTO'S:
  { id: 3,  name: "Bitcoin",         ticker: "BTC",  type: "Crypto",  sector: "Crypto",      country: "—",  currency: "USD", qty: 0.45, avgBuy: 28500,   current: 67200,   flag: "₿", coingeckoId: "bitcoin" },
  { id: 4,  name: "Ethereum",        ticker: "ETH",  type: "Crypto",  sector: "Crypto",      country: "—",  currency: "USD", qty: 3.2,  avgBuy: 1800,    current: 3450,    flag: "Ξ", coingeckoId: "ethereum" },
  { id: 5,  name: "VWCE ETF",        ticker: "VWCE", type: "ETF",     sector: "Wereltwijd",  country: "EU", currency: "EUR", qty: 40,   avgBuy: 95.20,   current: 118.40,  flag: "🇪🇺" },
  { id: 6,  name: "Microsoft",       ticker: "MSFT", type: "Aandeel", sector: "Technologie", country: "VS", currency: "USD", qty: 10,   avgBuy: 285.00,  current: 415.20,  flag: "🇺🇸" },
  { id: 7,  name: "ASML Holding",    ticker: "ASML", type: "Aandeel", sector: "Technologie", country: "NL", currency: "EUR", qty: 5,    avgBuy: 620.00,  current: 780.00,  flag: "🇳🇱" },
  { id: 8,  name: "Solana",          ticker: "SOL",  type: "Crypto",  sector: "Crypto",      country: "—",  currency: "USD", qty: 25,   avgBuy: 95,      current: 165,     flag: "◎", coingeckoId: "solana" },
  { id: 9,  name: "Amazon.com",      ticker: "AMZN", type: "Aandeel", sector: "E-commerce",  country: "VS", currency: "USD", qty: 12,   avgBuy: 132.00,  current: 185.50,  flag: "🇺🇸" },
  { id: 10, name: "Cash (EUR)",      ticker: "EUR",  type: "Cash",    sector: "Cash",        country: "EU", currency: "EUR", qty: 1,    avgBuy: 4200,    current: 4200,    flag: "💶"  },
];

const NEWS = [
  { id: 1, source: "Bloomberg",      title: "NVIDIA's AI Chip Dominance Set to Continue in 2026",          summary: "Analisten verwachten dat NVIDIA zijn marktaandeel in AI-versnellers verder uitbreidt dankzij de nieuwe Blackwell-architectuur.", sentiment: "positief", asset: "NVDA", time: "2u geleden",  impact: "Positief voor NVDA (+2.3% verwacht)" },
  { id: 2, source: "Reuters",        title: "Bitcoin ETF Inflows Reach Record High This Week",              summary: "Institutionele instroom in Bitcoin ETF's bereikte deze week een recordniveau, wat duidt op groeiende acceptatie bij grote beleggers.", sentiment: "positief", asset: "BTC",  time: "4u geleden",  impact: "Positief voor BTC — hogere vraag verwacht" },
  { id: 3, source: "Financial Times",title: "Apple Plans Major AI Integration Across Entire Product Line",  summary: "Apple kondigde aan dat AI-functionaliteiten in alle producten worden geïntegreerd, wat de vraag naar iPhones mogelijk stimuleert.", sentiment: "positief", asset: "AAPL", time: "6u geleden",  impact: "Positief voor AAPL — groeikatalysator" },
  { id: 4, source: "CNBC",           title: "Fed Signals Possible Rate Cuts Later This Year",               summary: "De Federal Reserve hintte op mogelijke renteverlagingen in H2 2025, wat gunstig kan zijn voor groei-aandelen.", sentiment: "positief", asset: "Markt",time: "8u geleden",  impact: "Breed positief voor tech-portefeuilles" },
  { id: 5, source: "MarketWatch",    title: "ASML Reports Strong Order Backlog for EUV Machines",           summary: "ASML rapporteerde een recordorderportefeuille voor EUV-machines, gedreven door vraag van Taiwanese en Koreaanse chipmakers.", sentiment: "positief", asset: "ASML", time: "1d geleden",  impact: "Positief voor ASML" },
  { id: 6, source: "Wall Street Journal", title: "Ethereum Upgrade Improves Network Efficiency by 40%",    summary: "De laatste Ethereum-netwerkupgrade reduceert transactiekosten aanzienlijk en verbetert verwerkingssnelheid.", sentiment: "neutraal", asset: "ETH",  time: "1d geleden",  impact: "Neutraal op korte termijn, positief op lange termijn" },
  { id: 7, source: "Bloomberg",      title: "Tech Sector Faces Regulatory Pressure in EU Markets",          summary: "Europese regelgevers overwegen strengere maatregelen voor grote techbedrijven, wat kan wegen op Europese uitbreidingsplannen.", sentiment: "negatief", asset: "Markt",time: "2d geleden", impact: "Mogelijk negatief voor MSFT, AAPL in EU" },
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

const PIE_COLORS = ["#7c6af7","#38bdf8","#22d3a0","#f5a623","#f4645f"];

const TYPE_FLAGS = { "Aandeel":"📈", "Crypto":"🪙", "ETF":"🌐", "Cash":"💶" };
const SECTOR_OPTIONS = ["Technologie","Crypto","Wereldwijd","E-commerce","Energie","Gezondheidszorg","Financiën","Cash","Overig"];
const TYPE_OPTIONS   = ["Aandeel","Crypto","ETF","Cash"];
const COUNTRY_OPTIONS= ["VS","EU","NL","BE","UK","DE","JP","CN","—"];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --bg:#09090f; --surface:#111118; --surface2:#18181f;
    --border:rgba(255,255,255,0.06); --border2:rgba(255,255,255,0.1);
    --text:#f0f0f8; --muted:#6b6b8a;
    --accent:#7c6af7; --accent2:#a78bfa;
    --green:#22d3a0; --red:#f4645f; --gold:#f5a623; --blue:#38bdf8;
    --font:'Sora',sans-serif; --mono:'JetBrains Mono',monospace;
  }
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100dvh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  .app{max-width:430px;margin:0 auto;min-height:100dvh;background:var(--bg)}
  .header{position:sticky;top:0;z-index:100;background:rgba(9,9,15,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:14px 20px 12px;display:flex;align-items:center;justify-content:space-between}
  .header-logo{font-size:15px;font-weight:700;background:linear-gradient(135deg,var(--accent2),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.3px}
  .header-right{display:flex;gap:8px;align-items:center}
  .icon-btn{width:34px;height:34px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:all 0.2s}
  .icon-btn:active{transform:scale(0.92)}
  .tabs{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:100;background:rgba(9,9,15,0.93);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid var(--border);padding:8px 0 max(8px,env(safe-area-inset-bottom));display:flex}
  .tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 0;cursor:pointer;transition:all 0.2s}
  .tab-label{font-size:10px;font-weight:500;color:var(--muted);transition:color 0.2s;letter-spacing:0.3px}
  .tab.active .tab-label{color:var(--accent2)}
  .tab-icon-wrap{transition:transform 0.2s}
  .tab.active .tab-icon-wrap{transform:translateY(-2px)}
  .tab:active .tab-icon-wrap{transform:scale(0.88)}
  .content{padding:0 0 90px;animation:fadeIn 0.25s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px;margin:0 16px 12px}
  .card-title{font-size:11px;font-weight:600;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:14px}
  .hero{padding:22px 20px 18px;text-align:center}
  .hero-label{font-size:11px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
  .hero-value{font-size:40px;font-weight:700;letter-spacing:-2px;font-family:var(--mono);background:linear-gradient(135deg,#fff 0%,var(--accent2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;margin-bottom:12px}
  .hero-row{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
  .badge{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:var(--mono)}
  .badge.green{background:rgba(34,211,160,0.12);color:var(--green);border:1px solid rgba(34,211,160,0.2)}
  .badge.red{background:rgba(244,100,95,0.12);color:var(--red);border:1px solid rgba(244,100,95,0.2)}
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 16px 12px}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px}
  .stat-label{font-size:10px;color:var(--muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px}
  .stat-value{font-size:20px;font-weight:700;font-family:var(--mono);letter-spacing:-0.5px}
  .stat-sub{font-size:11px;color:var(--muted);margin-top:2px}
  .asset-item{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);transition:opacity 0.15s}
  .asset-item:last-child{border-bottom:none;padding-bottom:0}
  .asset-item:first-child{padding-top:0}
  .asset-icon{width:38px;height:38px;border-radius:11px;background:var(--surface2);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
  .asset-info{flex:1;min-width:0}
  .asset-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .asset-ticker{font-size:11px;color:var(--muted);font-family:var(--mono);margin-top:1px}
  .asset-right{text-align:right;flex-shrink:0}
  .asset-value{font-size:13px;font-weight:600;font-family:var(--mono)}
  .asset-pnl{font-size:11px;font-family:var(--mono);margin-top:2px}
  .text-green{color:var(--green)} .text-red{color:var(--red)} .text-muted{color:var(--muted)} .text-gold{color:var(--gold)}
  .perf-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)}
  .perf-row:last-child{border-bottom:none;padding-bottom:0} .perf-row:first-child{padding-top:0}
  .perf-label{font-size:13px;color:var(--muted)}
  .perf-values{display:flex;gap:12px}
  .perf-val{font-size:13px;font-weight:600;font-family:var(--mono)}
  .legend{display:flex;flex-direction:column;gap:8px;margin-top:12px}
  .legend-item{display:flex;align-items:center;gap:8px}
  .legend-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
  .legend-label{font-size:12px;color:var(--muted);flex:1}
  .legend-pct{font-size:11px;color:var(--muted);font-family:var(--mono);width:36px;text-align:right}
  .feedback-item{display:flex;gap:12px;padding:11px 13px;border-radius:12px;margin-bottom:8px;font-size:13px;line-height:1.5}
  .feedback-item.warn{background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.15)}
  .feedback-item.ok{background:rgba(34,211,160,0.08);border:1px solid rgba(34,211,160,0.15)}
  .feedback-item.info{background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.15)}
  .feedback-icon{font-size:15px;flex-shrink:0;margin-top:1px}
  .news-item{padding:14px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:opacity 0.15s}
  .news-item:last-child{border-bottom:none}
  .news-item:active{opacity:0.7}
  .news-meta{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}
  .news-source{font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:var(--accent2)}
  .news-dot{width:3px;height:3px;border-radius:50%;background:var(--border2)}
  .news-time{font-size:11px;color:var(--muted)}
  .news-title{font-size:14px;font-weight:600;line-height:1.4;margin-bottom:6px}
  .news-summary{font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:8px}
  .news-footer{display:flex;align-items:center;justify-content:space-between}
  .sentiment-badge{font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:3px 8px;border-radius:6px}
  .sentiment-badge.positief{background:rgba(34,211,160,0.12);color:var(--green)}
  .sentiment-badge.negatief{background:rgba(244,100,95,0.12);color:var(--red)}
  .sentiment-badge.neutraal{background:rgba(107,107,138,0.12);color:var(--muted)}
  .news-impact{font-size:11px;color:var(--muted);max-width:58%;text-align:right}
  .risk-bar{height:8px;border-radius:4px;background:var(--surface2);margin:10px 0 6px;overflow:hidden}
  .risk-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--green),var(--gold),var(--red));transition:width 1s ease}
  .risk-labels{display:flex;justify-content:space-between;font-size:10px;color:var(--muted)}
  .section-header{padding:18px 20px 8px;display:flex;align-items:baseline;justify-content:space-between}
  .section-title{font-size:18px;font-weight:700;letter-spacing:-0.5px}
  .section-sub{font-size:12px;color:var(--muted)}
  .geo-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
  .geo-item:last-child{border-bottom:none}
  .geo-flag{font-size:20px;width:34px;text-align:center}
  .geo-info{flex:1}
  .geo-name{font-size:13px;font-weight:600;margin-bottom:4px}
  .geo-pct{font-size:12px;font-family:var(--mono);color:var(--muted);width:36px;text-align:right}
  .filter-scroll{overflow-x:auto;padding:0 16px 12px;display:flex;gap:8px;scrollbar-width:none}
  .filter-scroll::-webkit-scrollbar{display:none}
  .filter-chip{flex-shrink:0;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;background:var(--surface2);border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:all 0.2s;white-space:nowrap}
  .filter-chip.active{background:rgba(124,106,247,0.15);border-color:rgba(124,106,247,0.3);color:var(--accent2)}
  .settings-item{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:opacity 0.15s}
  .settings-item:last-child{border-bottom:none}
  .settings-item:active{opacity:0.7}
  .settings-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
  .settings-label{flex:1;font-size:14px;font-weight:500}
  .settings-arrow{font-size:14px;color:var(--muted)}
  .custom-tooltip{background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:8px 12px;font-family:var(--mono);font-size:12px}
  .search-bar{margin:0 16px 12px;position:relative}
  .search-input{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 16px 10px 38px;font-family:var(--font);font-size:14px;color:var(--text);outline:none;transition:border-color 0.2s}
  .search-input::placeholder{color:var(--muted)}
  .search-input:focus{border-color:var(--border2)}
  .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none}

  /* MODAL */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease}
  .modal{background:var(--surface);border:1px solid var(--border2);border-radius:24px 24px 0 0;padding:20px 20px max(20px,env(safe-area-inset-bottom));width:100%;max-width:430px;max-height:90dvh;overflow-y:auto}
  .modal-handle{width:36px;height:4px;background:var(--border2);border-radius:2px;margin:0 auto 18px}
  .modal-title{font-size:17px;font-weight:700;margin-bottom:18px;letter-spacing:-0.3px}
  .form-group{margin-bottom:14px}
  .form-label{font-size:11px;font-weight:600;color:var(--muted);letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;display:block}
  .form-input{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:11px 14px;font-family:var(--font);font-size:14px;color:var(--text);outline:none;transition:border-color 0.2s}
  .form-input:focus{border-color:var(--accent)}
  .form-input::placeholder{color:var(--muted)}
  .form-select{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:11px 14px;font-family:var(--font);font-size:14px;color:var(--text);outline:none;appearance:none;cursor:pointer}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .btn-primary{width:100%;padding:14px;border-radius:14px;border:none;background:var(--accent);color:#fff;font-family:var(--font);font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s;margin-top:6px}
  .btn-primary:active{transform:scale(0.98);opacity:0.9}
  .btn-danger{width:100%;padding:12px;border-radius:14px;border:1px solid rgba(244,100,95,0.3);background:rgba(244,100,95,0.08);color:var(--red);font-family:var(--font);font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:8px}
  .btn-cancel{width:100%;padding:12px;border-radius:14px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:var(--font);font-size:14px;font-weight:600;cursor:pointer;margin-top:8px}
  .delete-btn{width:28px;height:28px;border-radius:8px;border:none;background:rgba(244,100,95,0.1);color:var(--red);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;flex-shrink:0;transition:all 0.2s}
  .delete-btn:active{background:rgba(244,100,95,0.22);transform:scale(0.9)}

  .map-visual{width:100%;height:130px;background:var(--surface2);border-radius:12px;margin-bottom:14px;position:relative;overflow:hidden}
  .map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(124,106,247,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,106,247,0.05) 1px,transparent 1px);background-size:20px 20px}
  .map-dot{position:absolute;border-radius:50%;background:var(--accent);animation:pulse 2s ease infinite}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:0.8}50%{transform:scale(1.4);opacity:0.35}}
`;

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

function fmt(n) { return Number(n).toLocaleString("nl-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    return <div className="custom-tooltip"><span style={{color:"var(--accent2)"}}>€{fmt(payload[0].value)}</span></div>;
  }
  return null;
}

function DonutChart({ data, colors }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" strokeWidth={0} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="legend" style={{flex:1}}>
        {data.filter(d=>d.value>0).map((d, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{background:colors[i%colors.length]}}/>
            <span className="legend-label">{d.name}</span>
            <span className="legend-pct">{total>0?((d.value/total)*100).toFixed(0):0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADD ASSET MODAL ──────────────────────────────────────────────────────────

function AddAssetModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name:"", ticker:"", type:"Aandeel", sector:"Technologie",
    country:"VS", currency:"EUR", qty:"", avgBuy:"", current:"", flag:"📈"
  });
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

function handleAdd() {
  if (!form.name || !form.ticker || !form.qty || !form.avgBuy || !form.current) return;

  // Maakt automatisch van "Cardano" -> "cardano" en van "Binance Coin" -> "binance-coin"
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
          <div className="form-group">
            <label className="form-label">Naam</label>
            <input className="form-input" placeholder="Apple Inc." value={form.name} onChange={e=>set("name",e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Ticker</label>
            <input className="form-input" placeholder="AAPL" value={form.ticker} onChange={e=>set("ticker",e.target.value.toUpperCase())}/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e=>set("type",e.target.value)}>
              {TYPE_OPTIONS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sector</label>
            <select className="form-select" value={form.sector} onChange={e=>set("sector",e.target.value)}>
              {SECTOR_OPTIONS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Land</label>
            <select className="form-select" value={form.country} onChange={e=>set("country",e.target.value)}>
              {COUNTRY_OPTIONS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Valuta</label>
            <select className="form-select" value={form.currency} onChange={e=>set("currency",e.target.value)}>
              {["EUR","USD","GBP","CHF"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Aantal</label>
          <input className="form-input" type="number" placeholder="10" value={form.qty} onChange={e=>set("qty",e.target.value)}/>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Aankoopprijs (€)</label>
            <input className="form-input" type="number" placeholder="150.00" value={form.avgBuy} onChange={e=>set("avgBuy",e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Huidige koers (€)</label>
            <input className="form-input" type="number" placeholder="190.00" value={form.current} onChange={e=>set("current",e.target.value)}/>
          </div>
        </div>

        <button className="btn-primary" onClick={handleAdd}>✓ Toevoegen aan portfolio</button>
        <button className="btn-cancel" onClick={onClose}>Annuleren</button>
      </div>
    </div>
  );
}

// ─── EDIT / DELETE MODAL ──────────────────────────────────────────────────────

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
    onSave({ ...asset, ...form, qty: parseFloat(form.qty), avgBuy: parseFloat(form.avgBuy), current: parseFloat(form.current), flag: TYPE_FLAGS[form.type] || asset.flag });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div className="modal-title" style={{margin:0}}>{asset.ticker} bewerken</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Naam</label>
            <input className="form-input" value={form.name} onChange={e=>set("name",e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Ticker</label>
            <input className="form-input" value={form.ticker} onChange={e=>set("ticker",e.target.value.toUpperCase())}/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e=>set("type",e.target.value)}>
              {TYPE_OPTIONS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sector</label>
            <select className="form-select" value={form.sector} onChange={e=>set("sector",e.target.value)}>
              {SECTOR_OPTIONS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Aantal</label>
          <input className="form-input" type="number" value={form.qty} onChange={e=>set("qty",e.target.value)}/>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Aankoopprijs (€)</label>
            <input className="form-input" type="number" value={form.avgBuy} onChange={e=>set("avgBuy",e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Huidige koers (€)</label>
            <input className="form-input" type="number" value={form.current} onChange={e=>set("current",e.target.value)}/>
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave}>Opslaan</button>

        {!confirmDelete
          ? <button className="btn-danger" onClick={()=>setConfirmDelete(true)}>🗑 Verwijderen uit portfolio</button>
          : <button className="btn-danger" onClick={()=>{onDelete(asset.id);onClose();}}>⚠️ Bevestig verwijderen</button>
        }
        <button className="btn-cancel" onClick={onClose}>Annuleren</button>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({ assets, onAdd, onEdit }) {
  const [period, setPeriod] = useState("1D");
  const enriched = useMemo(() => enrich(assets), [assets]);

  const totalValue = enriched.reduce((s,a)=>s+a.currentVal,0);
  const totalCost  = enriched.reduce((s,a)=>s+a.buyVal,0);
  const totalPnL   = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL/totalCost)*100 : 0;

  const periodPnl = period === "Alles"
    ? { eur: totalPnL, pct: totalPnLPct }
    : PERIOD_STATIC[period];

  const isPos = periodPnl.eur >= 0;
  const periods = ["1U","1D","1W","1M","1J","Alles"];
  const chartData = CHART_PERIODS[period];

  const sorted = [...enriched].filter(a=>a.type!=="Cash").sort((a,b)=>b.currentVal-a.currentVal);
  const topGainer = [...enriched].sort((a,b)=>b.pnlPct-a.pnlPct)[0];
  const topLoser  = [...enriched].sort((a,b)=>a.pnlPct-b.pnlPct)[0];
  const top3Up    = [...enriched].sort((a,b)=>b.pnlPct-a.pnlPct).slice(0,3);
  const top3Down  = [...enriched].sort((a,b)=>a.pnlPct-b.pnlPct).slice(0,3);

  const byType = ["Aandeel","Crypto","ETF","Cash"].map(t=>({
    name:t, value: enriched.filter(a=>a.type===t).reduce((s,a)=>s+a.currentVal,0)
  }));

  return (
    <div className="content">
      <div className="hero">
        <div className="hero-label">Totale Portefeuillewaarde</div>
        <div className="hero-value">€{fmt(totalValue)}</div>
        <div className="hero-row">
          <span className={"badge "+(isPos?"green":"red")}>
            {isPos?"▲":"▼"} {isPos?"+":""}€{fmt(periodPnl.eur)} ({period})
          </span>
          <span className={"badge "+(isPos?"green":"red")}>
            {isPos?"+":""}{Number(periodPnl.pct).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{paddingBottom:14}}>
        <div style={{display:"flex",gap:3,marginBottom:14}}>
          {periods.map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{
              flex:1,padding:"5px 0",borderRadius:8,fontSize:11,fontWeight:700,
              fontFamily:"var(--mono)",border:"none",cursor:"pointer",transition:"all 0.18s",
              background:period===p?"var(--accent)":"transparent",
              color:period===p?"#fff":"var(--muted)",
            }}>{p}</button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={148}>
          <AreaChart data={chartData} key={period}>
            <defs>
              <linearGradient id="cgrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={isPos?"#7c6af7":"#f4645f"} stopOpacity={0.28}/>
                <stop offset="95%" stopColor={isPos?"#7c6af7":"#f4645f"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="date" tick={{fill:"#6b6b8a",fontSize:9,fontFamily:"Sora"}} axisLine={false} tickLine={false}/>
            <YAxis hide domain={["auto","auto"]}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="value" stroke={isPos?"#7c6af7":"#f4645f"} strokeWidth={2} fill="url(#cgrad)" dot={false} animationDuration={350}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Totaal Rendement</div>
          <div className={"stat-value "+(totalPnL>=0?"text-green":"text-red")}>{totalPnL>=0?"+":""}{totalPnLPct.toFixed(1)}%</div>
          <div className="stat-sub">{totalPnL>=0?"+":""}€{fmt(totalPnL)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Posities</div>
          <div className="stat-value">{enriched.filter(a=>a.type!=="Cash").length}</div>
          <div className="stat-sub">actieve assets</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Aandelen</div>
          <div className="stat-value">{enriched.filter(a=>a.type==="Aandeel").length}</div>
          <div className="stat-sub text-muted">posities</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Crypto</div>
          <div className="stat-value">{enriched.filter(a=>a.type==="Crypto").length}</div>
          <div className="stat-sub text-muted">tokens</div>
        </div>
      </div>

      {/* Winnaars/verliezers */}
      <div className="card">
        <div className="card-title">Dagelijkse Prestaties</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{padding:"11px",borderRadius:12,background:"rgba(34,211,160,0.08)",border:"1px solid rgba(34,211,160,0.15)"}}>
            <div style={{fontSize:10,color:"var(--green)",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>▲ Beste</div>
            <div style={{fontSize:13,fontWeight:700}}>{topGainer?.ticker}</div>
            <div style={{fontSize:12,color:"var(--green)",fontFamily:"var(--mono)",fontWeight:600}}>+{topGainer?.pnlPct.toFixed(1)}%</div>
          </div>
          <div style={{padding:"11px",borderRadius:12,background:"rgba(244,100,95,0.08)",border:"1px solid rgba(244,100,95,0.15)"}}>
            <div style={{fontSize:10,color:"var(--red)",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>▼ Slechtste</div>
            <div style={{fontSize:13,fontWeight:700}}>{topLoser?.ticker}</div>
            <div style={{fontSize:12,color:"var(--red)",fontFamily:"var(--mono)",fontWeight:600}}>{topLoser?.pnlPct.toFixed(1)}%</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:"var(--muted)",marginBottom:6,letterSpacing:0.5}}>TOP 3 STIJGERS</div>
            {top3Up.map((a,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12}}>
                <span style={{color:"var(--muted)"}}>{a.ticker}</span>
                <span className="text-green" style={{fontFamily:"var(--mono)",fontWeight:600}}>+{a.pnlPct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div style={{width:1,background:"var(--border)"}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:"var(--muted)",marginBottom:6,letterSpacing:0.5}}>TOP 3 DALERS</div>
            {top3Down.map((a,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12}}>
                <span style={{color:"var(--muted)"}}>{a.ticker}</span>
                <span className="text-red" style={{fontFamily:"var(--mono)",fontWeight:600}}>{a.pnlPct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verdeling */}
      <div className="card">
        <div className="card-title">Marktverdeling</div>
        <DonutChart data={byType} colors={PIE_COLORS}/>
      </div>

      {/* Top posities */}
      <div className="card">
        <div className="card-title">Top Posities</div>
        {sorted.slice(0,5).map(a=>(
          <div key={a.id} className="asset-item" style={{cursor:"pointer"}} onClick={()=>onEdit(a)}>
            <div className="asset-icon">{a.flag}</div>
            <div className="asset-info">
              <div className="asset-name">{a.name}</div>
              <div className="asset-ticker">{a.ticker} · {a.type}</div>
            </div>
            <div className="asset-right">
              <div className="asset-value">€{fmt(a.currentVal)}</div>
              <div className={"asset-pnl "+(a.pnl>=0?"text-green":"text-red")}>{a.pnl>=0?"+":""}{a.pnlPct.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PORTFOLIO PAGE ───────────────────────────────────────────────────────────

function PortfolioPage({ assets, onEdit, onDelete }) {
  const [subTab, setSubTab] = useState("overzicht");
  const enriched = useMemo(()=>enrich(assets),[assets]);
  const totalValue   = enriched.reduce((s,a)=>s+a.currentVal,0);
  const totalCost    = enriched.reduce((s,a)=>s+a.buyVal,0);
  const totalPnL     = totalValue-totalCost;
  const totalPnLPct  = totalCost>0?(totalPnL/totalCost)*100:0;

  const byType   = ["Aandeel","Crypto","ETF","Cash"].map(t=>({name:t,value:enriched.filter(a=>a.type===t).reduce((s,a)=>s+a.currentVal,0)}));
  const bySector = [...new Set(enriched.map(a=>a.sector))].map(s=>({name:s,value:enriched.filter(a=>a.sector===s).reduce((s,a)=>s+a.currentVal,0)}));
  const geoData  = [...new Set(enriched.filter(a=>a.country!=="—").map(a=>a.country))]
    .map(c=>({ country:c, value: enriched.filter(a=>a.country===c).reduce((s,a)=>s+a.currentVal,0) }))
    .sort((a,b)=>b.value-a.value);
  const countryFlags = {"VS":"🇺🇸","EU":"🇪🇺","NL":"🇳🇱","BE":"🇧🇪","UK":"🇬🇧","DE":"🇩🇪"};

  const periods = [
    {label:"1D",  eur:totalValue*0.0213,    pct:2.13},
    {label:"7D",  eur:totalValue*0.0528,    pct:5.28},
    {label:"30D", eur:totalValue*0.107,     pct:10.7},
    {label:"90D", eur:totalValue*0.208,     pct:20.8},
    {label:"1J",  eur:totalValue*0.359,     pct:35.9},
    {label:"All", eur:totalPnL,             pct:totalPnLPct},
  ];

  const tabs = [{id:"overzicht",l:"Overzicht"},{id:"analyse",l:"Analyse"},{id:"winst",l:"Winst"},{id:"assets",l:"Assets"},{id:"geo",l:"Geo"}];

  return (
    <div className="content">
      <div className="section-header">
        <div>
          <div className="section-title">Portefeuille</div>
          <div className="section-sub">€{fmt(totalValue)}</div>
        </div>
      </div>
      <div className="filter-scroll">
        {tabs.map(t=>(
          <button key={t.id} className={"filter-chip"+(subTab===t.id?" active":"")} onClick={()=>setSubTab(t.id)}>{t.l}</button>
        ))}
      </div>

      {subTab==="overzicht" && (
        <>
          <div className="card">
            <div className="card-title">Performance per Periode</div>
            {periods.map((p,i)=>(
              <div key={i} className="perf-row">
                <span className="perf-label">{p.label}</span>
                <div className="perf-values">
                  <span className={"perf-val "+(p.eur>=0?"text-green":"text-red")}>{p.eur>=0?"+":""}€{fmt(p.eur)}</span>
                  <span className={"perf-val "+(p.pct>=0?"text-green":"text-red")} style={{minWidth:54,textAlign:"right"}}>{p.pct>=0?"+":""}{Number(p.pct).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">Weekoverzicht</div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={[{d:"Ma",v:49200},{d:"Di",v:50100},{d:"Wo",v:49600},{d:"Do",v:51200},{d:"Vr",v:50800},{d:"Za",v:51800}]} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="d" tick={{fill:"#6b6b8a",fontSize:10,fontFamily:"Sora"}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="v" fill="#7c6af7" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {subTab==="analyse" && (
        <>
          <div className="card">
            <div className="card-title">Risicoscore</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
              <span style={{fontSize:30,fontWeight:700,fontFamily:"var(--mono)",color:"var(--gold)"}}>58</span>
              <span style={{fontSize:12,color:"var(--muted)"}}>/ 100 · Gematigd Risico</span>
            </div>
            <div className="risk-bar"><div className="risk-fill" style={{width:"58%"}}/></div>
            <div className="risk-labels"><span>Laag</span><span>Gematigd</span><span>Hoog</span></div>
          </div>
          <div className="card">
            <div className="card-title">Portfolio Feedback</div>
            {enriched.filter(a=>a.type==="Technologie"||a.sector==="Technologie").reduce((s,a)=>s+a.currentVal,0)/totalValue>0.35 && (
              <div className="feedback-item warn"><span className="feedback-icon">⚠️</span><span>Technologie vertegenwoordigt een groot deel van uw portefeuille. Overweeg meer spreiding.</span></div>
            )}
            <div className="feedback-item ok"><span className="feedback-icon">✅</span><span>Goede geografische spreiding over meerdere regio's.</span></div>
            <div className="feedback-item info"><span className="feedback-icon">💡</span><span>Overweeg het toevoegen van obligaties of defensieve aandelen voor betere balans.</span></div>
          </div>
          <div className="card">
            <div className="card-title">Spreiding per Type</div>
            <DonutChart data={byType} colors={PIE_COLORS}/>
          </div>
          <div className="card">
            <div className="card-title">Spreiding per Sector</div>
            <DonutChart data={bySector} colors={["#7c6af7","#38bdf8","#22d3a0","#f5a623","#f4645f","#a78bfa"]}/>
          </div>
        </>
      )}

      {subTab==="winst" && (
        <>
          <div className="stats-grid" style={{margin:"0 16px 12px"}}>
            <div className="stat-card">
              <div className="stat-label">Ongerealiseerd</div>
              <div className={"stat-value "+(totalPnL>=0?"text-green":"text-red")}>{totalPnL>=0?"+":""}€{fmt(totalPnL)}</div>
              <div className={"stat-sub "+(totalPnL>=0?"text-green":"text-red")}>{totalPnL>=0?"+":""}{totalPnLPct.toFixed(1)}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Gerealiseerd</div>
              <div className="stat-value text-green">+€2.340</div>
              <div className="stat-sub text-muted">dit jaar</div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Alle Posities — Winst/Verlies</div>
            {[...enriched].filter(a=>a.type!=="Cash").sort((a,b)=>b.pnl-a.pnl).map(a=>(
              <div key={a.id} className="asset-item" style={{cursor:"pointer"}} onClick={()=>onEdit(a)}>
                <div className="asset-icon">{a.flag}</div>
                <div className="asset-info">
                  <div className="asset-name">{a.name}</div>
                  <div className="asset-ticker">{a.ticker}</div>
                </div>
                <div className="asset-right">
                  <div className={"asset-value "+(a.pnl>=0?"text-green":"text-red")}>{a.pnl>=0?"+":""}€{fmt(a.pnl)}</div>
                  <div className={"asset-pnl "+(a.pnl>=0?"text-green":"text-red")}>{a.pnl>=0?"+":""}{a.pnlPct.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {subTab==="assets" && (
        <div className="card">
          <div className="card-title">Alle Posities — tik om te bewerken</div>
          {enriched.map(a=>(
            <div key={a.id} className="asset-item">
              <div className="asset-icon" style={{cursor:"pointer"}} onClick={()=>onEdit(a)}>{a.flag}</div>
              <div className="asset-info" style={{cursor:"pointer"}} onClick={()=>onEdit(a)}>
                <div className="asset-name">{a.name}</div>
                <div className="asset-ticker">{a.ticker} · {a.qty}× €{a.avgBuy.toLocaleString("nl-BE",{maximumFractionDigits:2})}</div>
              </div>
              <div className="asset-right" style={{cursor:"pointer",marginRight:8}} onClick={()=>onEdit(a)}>
                <div className="asset-value">€{fmt(a.currentVal)}</div>
                <div className={"asset-pnl "+(a.pnl>=0?"text-green":"text-red")}>{a.pnl>=0?"+":""}{a.pnlPct.toFixed(1)}%</div>
              </div>
              <button className="delete-btn" onClick={()=>onDelete(a.id)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {subTab==="geo" && (
        <div className="card">
          <div className="card-title">Geografische Verdeling</div>
          <div className="map-visual">
            <div className="map-grid"/>
            <div className="map-dot" style={{width:18,height:18,left:"22%",top:"40%",animationDelay:"0s"}}/>
            <div className="map-dot" style={{width:10,height:10,left:"52%",top:"35%",animationDelay:"1s"}}/>
            <div className="map-dot" style={{width:8,height:8,left:"54%",top:"30%",animationDelay:"0.5s",opacity:0.6}}/>
            <div style={{position:"absolute",bottom:6,right:10,fontSize:9,color:"var(--muted)"}}>Gesimuleerde heatmap</div>
          </div>
          {geoData.map((g,i)=>(
            <div key={i} className="geo-item">
              <div className="geo-flag">{countryFlags[g.country]||"🌐"}</div>
              <div className="geo-info">
                <div className="geo-name">{g.country}</div>
                <div style={{height:3,background:"var(--surface2)",borderRadius:2,marginTop:4}}>
                  <div style={{height:"100%",width:`${totalValue>0?(g.value/totalValue)*100:0}%`,background:"var(--accent)",borderRadius:2}}/>
                </div>
              </div>
              <div className="geo-pct">{totalValue>0?((g.value/totalValue)*100).toFixed(1):0}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NEWS PAGE ────────────────────────────────────────────────────────────────

function NewsPage() {
  const [filter, setFilter] = useState("Alles");
  const [search, setSearch] = useState("");
  const filters = ["Alles","NVDA","BTC","AAPL","ASML","ETH"];
  const filtered = NEWS.filter(n=>(filter==="Alles"||n.asset===filter)&&(search===""||n.title.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="content">
      <div className="section-header">
        <div>
          <div className="section-title">Nieuws & Inzichten</div>
          <div className="section-sub">Gebaseerd op uw portefeuille</div>
        </div>
      </div>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Zoeken in nieuws…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="filter-scroll">
        {filters.map(f=><button key={f} className={"filter-chip"+(filter===f?" active":"")} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>
      <div className="card">
        {filtered.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:"var(--muted)",fontSize:13}}>Geen resultaten</div>}
        {filtered.map(n=>(
          <div key={n.id} className="news-item">
            <div className="news-meta">
              <span className="news-source">{n.source}</span>
              <div className="news-dot"/><span className="news-time">{n.time}</span>
              <div className="news-dot"/><span style={{fontSize:11,color:"var(--accent2)",fontWeight:600}}>{n.asset}</span>
            </div>
            <div className="news-title">{n.title}</div>
            <div className="news-summary">{n.summary}</div>
            <div className="news-footer">
              <span className={"sentiment-badge "+n.sentiment}>{n.sentiment}</span>
              <span className="news-impact">{n.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

function SettingsPage({ assetCount }) {
  const items = [
    {icon:"🌙",label:"Donkere modus",color:"#7c6af7",sub:"Aan"},
    {icon:"💶",label:"Valuta",color:"#22d3a0",sub:"EUR (€)"},
    {icon:"📤",label:"Portfolio exporteren",color:"#38bdf8",sub:"JSON / CSV"},
    {icon:"📥",label:"Portfolio importeren",color:"#f5a623",sub:""},
    {icon:"🔔",label:"Meldingen",color:"#a78bfa",sub:"Aan"},
    {icon:"☁️",label:"iCloud Backup",color:"#38bdf8",sub:"Automatisch"},
    {icon:"🔒",label:"Beveiliging",color:"#f4645f",sub:"Face ID"},
    {icon:"ℹ️",label:"Over deze app",color:"#6b6b8a",sub:"v1.0.0"},
  ];
  return (
    <div className="content">
      <div className="section-header"><div className="section-title">Instellingen</div></div>
      <div className="card" style={{marginTop:4}}>
        <div style={{display:"flex",alignItems:"center",gap:14,paddingBottom:16,borderBottom:"1px solid var(--border)",marginBottom:16}}>
          <div style={{width:50,height:50,borderRadius:16,background:"linear-gradient(135deg,var(--accent),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👤</div>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>Watch me invest</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{assetCount} posities · Lokale data</div>
          </div>
        </div>
        {items.map((item,i)=>(
          <div key={i} className="settings-item">
            <div className="settings-icon" style={{background:`${item.color}18`}}>{item.icon}</div>
            <span className="settings-label">{item.label}</span>
            {item.sub&&<span style={{fontSize:12,color:"var(--muted)",marginRight:6}}>{item.sub}</span>}
            <span className="settings-arrow">›</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",padding:"18px",fontSize:11,color:"var(--muted)"}}>
        Watch me invest · Persoonlijk gebruik<br/>
        <span style={{color:"var(--accent)",fontWeight:600}}>Alle data lokaal opgeslagen</span>
      </div>
    </div>
  );
}

// ─── NAV ICONS ────────────────────────────────────────────────────────────────

const NAV = {
  home: a=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V9.5Z"
        fill={a?"#a78bfa":"none"} stroke={a?"#a78bfa":"#6b6b8a"} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  portfolio: a=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="13" width="4" height="8" rx="1" fill={a?"#a78bfa":"none"} stroke={a?"#a78bfa":"#6b6b8a"} strokeWidth="1.8"/>
      <rect x="10" y="9" width="4" height="12" rx="1" fill={a?"#a78bfa":"none"} stroke={a?"#a78bfa":"#6b6b8a"} strokeWidth="1.8"/>
      <rect x="17" y="5" width="4" height="16" rx="1" fill={a?"#a78bfa":"none"} stroke={a?"#a78bfa":"#6b6b8a"} strokeWidth="1.8"/>
    </svg>
  ),
  news: a=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" fill={a?"#a78bfa":"none"} stroke={a?"#a78bfa":"#6b6b8a"} strokeWidth="1.8"/>
      <line x1="7" y1="9" x2="17" y2="9" stroke={a?"#fff":"#6b6b8a"} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="7" y1="13" x2="14" y2="13" stroke={a?"#fff":"#6b6b8a"} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="7" y1="17" x2="12" y2="17" stroke={a?"#fff":"#6b6b8a"} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  settings: a=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill={a?"#a78bfa":"none"} stroke={a?"#a78bfa":"#6b6b8a"} strokeWidth="1.8"/>
      <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.9 4.9L6.3 6.3M17.7 17.7L19.1 19.1M4.9 19.1L6.3 17.7M17.7 6.3L19.1 4.9"
        stroke={a?"#a78bfa":"#6b6b8a"} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");
const [assets, setAssets] = useState(() => {
  const saved = localStorage.getItem("portfolio_assets");
  return saved ? JSON.parse(saved) : INITIAL_ASSETS;
});
// 1. Jouw bestaande LocalStorage useEffect (behouden zodat data bewaard blijft!)
  useEffect(() => {
    localStorage.setItem("portfolio_assets", JSON.stringify(assets));
  }, [assets]);

  // 2. De NIEUWE Realtime CoinGecko API Engine
  useEffect(() => {
    async function fetchLivePrices() {
      // Haal alle actieve cryptoId's op uit je huidige portfolio
      const cryptoIds = assets
        .filter(a => a.coingeckoId)
        .map(a => a.coingeckoId)
        .join(",");

      if (!cryptoIds) return;

      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=eur`;
        const response = await fetch(url);
        const data = await response.json();

        // Update de koers in de applicatie zonder de rest van de data te overschrijven
        setAssets(prevAssets =>
          prevAssets.map(asset => {
            if (asset.coingeckoId && data[asset.coingeckoId]) {
              return {
                ...asset,
                current: data[asset.coingeckoId].eur
              };
            }
            return asset;
          })
        );
        console.log("Realtime crypto koersen succesvol bijgewerkt:", data);
      } catch (error) {
        console.error("CoinGecko API fout:", error);
      }
    }

    fetchLivePrices();

    // Ververs elke 60 seconden automatisch op de achtergrond
    const interval = setInterval(fetchLivePrices, 60000);
    return () => clearInterval(interval);
  }, [assets.length]); // Start opnieuw op als er een munt wordt toegevoegd of verwijderd

  // 3. Jouw bestaande State variabelen (State namen aangepast naar jouw variabelen!)
  const [showAdd, setShowAdd] = useState(false);
  const [editAsset, setEditAsset] = useState(null);

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
