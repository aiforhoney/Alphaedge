import { useState, useEffect, useRef } from "react";

// ── Fonts & Global Styles ──────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #070a0f;
      --bg2: #0d1117;
      --bg3: #131920;
      --surface: #141c24;
      --surface2: #1a2433;
      --border: #1e2d3d;
      --border2: #243447;
      --text: #e2eaf4;
      --text2: #8ba3bf;
      --text3: #526a84;
      --accent: #00d4ff;
      --accent2: #0099bb;
      --gold: #f0b429;
      --gold2: #c88e1a;
      --green: #00e599;
      --green2: #00b374;
      --red: #ff4d6a;
      --red2: #cc3a53;
      --purple: #a855f7;
      --orange: #fb923c;
      --font-head: 'Syne', sans-serif;
      --font-body: 'JetBrains Mono', monospace;
      --font-serif: 'Instrument Serif', serif;
    }

    body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes blink { 0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0} }

    .animate-up { animation: slideUp .5s ease forwards; }
    .animate-fade { animation: fadeIn .4s ease forwards; }

    .shimmer {
      background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .ticker-badge {
      font-family: var(--font-body);
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .08em;
      padding: 2px 6px;
      border-radius: 3px;
      background: rgba(0,212,255,.12);
      color: var(--accent);
      border: 1px solid rgba(0,212,255,.2);
    }

    .score-ring {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      transition: border-color .2s, transform .2s;
    }
    .card:hover { border-color: var(--border2); }

    .btn-primary {
      background: var(--accent);
      color: var(--bg);
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background .2s, transform .1s;
    }
    .btn-primary:hover { background: #00bbdd; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    .btn-ghost {
      background: transparent;
      color: var(--text2);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 7px 14px;
      font-family: var(--font-body);
      font-size: 12px;
      cursor: pointer;
      transition: all .2s;
    }
    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
    .btn-ghost.active { border-color: var(--accent); color: var(--accent); background: rgba(0,212,255,.08); }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      color: var(--text2);
      transition: all .2s;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .nav-item:hover { color: var(--text); background: rgba(255,255,255,.04); }
    .nav-item.active { color: var(--accent); background: rgba(0,212,255,.08); border-color: rgba(0,212,255,.15); }

    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .05em;
    }
    .tag-green { background: rgba(0,229,153,.12); color: var(--green); border: 1px solid rgba(0,229,153,.2); }
    .tag-red { background: rgba(255,77,106,.12); color: var(--red); border: 1px solid rgba(255,77,106,.2); }
    .tag-gold { background: rgba(240,180,41,.12); color: var(--gold); border: 1px solid rgba(240,180,41,.2); }
    .tag-purple { background: rgba(168,85,247,.12); color: var(--purple); border: 1px solid rgba(168,85,247,.2); }
    .tag-blue { background: rgba(0,212,255,.12); color: var(--accent); border: 1px solid rgba(0,212,255,.2); }

    .stat-block { display: flex; flex-direction: column; gap: 2px; }
    .stat-label { font-size: 10px; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; }
    .stat-value { font-size: 15px; font-weight: 500; color: var(--text); }
    .stat-change { font-size: 11px; }
    .up { color: var(--green); }
    .down { color: var(--red); }
    .neutral { color: var(--text2); }

    textarea, input, select {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text);
      font-family: var(--font-body);
      font-size: 12px;
      padding: 8px 12px;
      outline: none;
      width: 100%;
      transition: border-color .2s;
    }
    textarea:focus, input:focus, select:focus { border-color: var(--accent); }
    select option { background: var(--bg2); }

    .prose { font-family: var(--font-body); font-size: 12.5px; line-height: 1.8; color: var(--text2); }
    .prose strong { color: var(--text); font-weight: 500; }
    .prose em { color: var(--gold); font-style: normal; }

    .dot-live {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--green);
      animation: pulse 2s infinite;
      display: inline-block;
    }

    .horizontal-scroll { overflow-x: auto; }
    .horizontal-scroll::-webkit-scrollbar { height: 3px; }

    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; padding: 10px 12px; color: var(--text3); font-weight: 400; letter-spacing: .06em; font-size: 10px; text-transform: uppercase; border-bottom: 1px solid var(--border); white-space: nowrap; }
    td { padding: 10px 12px; border-bottom: 1px solid rgba(30,45,61,.5); vertical-align: middle; white-space: nowrap; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255,255,255,.02); }

    .loading-spinner {
      width: 16px; height: 16px;
      border: 2px solid var(--border2);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin .7s linear infinite;
      display: inline-block;
    }

    .ai-response {
      animation: slideUp .4s ease;
    }

    .ai-response p { margin-bottom: 12px; }
    .ai-response ul, .ai-response ol { margin: 8px 0 12px 16px; }
    .ai-response li { margin-bottom: 6px; }
    .ai-response h3 { color: var(--accent); font-family: var(--font-head); font-size: 14px; margin: 16px 0 8px; }
    .ai-response h4 { color: var(--gold); font-size: 12px; margin: 12px 0 6px; font-weight: 500; }
    .ai-response strong { color: var(--text); font-weight: 600; }
    .ai-response em { color: var(--green); font-style: italic; }
    .ai-response code { background: var(--bg2); padding: 1px 5px; border-radius: 3px; font-size: 11px; color: var(--accent); }

    .horizon-tab { padding: 6px 14px; border-radius: 20px; font-size: 11px; cursor: pointer; transition: all .2s; border: 1px solid var(--border); color: var(--text2); background: transparent; }
    .horizon-tab.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }

    .sector-chip { padding: 5px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; transition: all .2s; border: 1px solid var(--border); color: var(--text2); background: transparent; white-space: nowrap; }
    .sector-chip.active { border-color: var(--gold); color: var(--gold); background: rgba(240,180,41,.08); }

    .score-bar-bg { background: var(--bg2); height: 4px; border-radius: 2px; overflow: hidden; }
    .score-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }
  `}</style>
);

// ── Mock Data ────────────────────────────────────────────────────────────────
const MARKET_INDICES = [
  { name: "NIFTY 50", value: "24,362.80", change: "+187.40", pct: "+0.78%", up: true },
  { name: "SENSEX", value: "80,218.37", change: "+641.12", pct: "+0.81%", up: true },
  { name: "NIFTY BANK", value: "52,140.60", change: "-124.30", pct: "-0.24%", up: false },
  { name: "NIFTY MID 150", value: "18,840.25", change: "+312.70", pct: "+1.69%", up: true },
  { name: "NIFTY IT", value: "39,520.10", change: "+890.40", pct: "+2.31%", up: true },
];

const TOP_STOCKS = [
  { ticker: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "NBFC", price: "7,218", change: "+3.2%", up: true, horizon: "1Y", score: 88, tag: "Growth" },
  { ticker: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking", price: "1,642", change: "+1.1%", up: true, horizon: "10Y", score: 91, tag: "Compounder" },
  { ticker: "INFY", name: "Infosys Ltd", sector: "IT", price: "1,847", change: "+2.8%", up: true, horizon: "1Y", score: 84, tag: "Momentum" },
  { ticker: "TITAN", name: "Titan Company", sector: "Consumer", price: "3,290", change: "-0.4%", up: false, horizon: "10Y", score: 87, tag: "Quality" },
  { ticker: "DEEPAKNTR", name: "Deepak Nitrite", sector: "Chemicals", price: "2,614", change: "+5.7%", up: true, horizon: "3M", score: 79, tag: "Hidden Gem" },
  { ticker: "CDSL", name: "CDSL", sector: "Financials", price: "1,188", change: "+1.9%", up: true, horizon: "1Y", score: 82, tag: "Growth" },
];

const SECTORS = ["All", "Banking", "IT", "FMCG", "Pharma", "Auto", "Chemicals", "Infra", "NBFC", "Consumer", "Energy"];

const HORIZONS = ["1 Month", "3 Months", "1 Year", "10 Years"];

const SAMPLE_STOCKS = [
  { ticker: "RELIANCE", name: "Reliance Industries", sector: "Conglomerate", price: "2,946", mktCap: "19.9L Cr", pe: 28.4, roe: "9.8%", debt: "Low", rating: "BUY", score: 83, change: "+0.6%", up: true },
  { ticker: "TCS", name: "Tata Consultancy Svc", sector: "IT", price: "4,121", mktCap: "15.0L Cr", pe: 31.2, roe: "53.4%", debt: "Nil", rating: "HOLD", score: 78, change: "+1.3%", up: true },
  { ticker: "WIPRO", name: "Wipro Ltd", sector: "IT", price: "462", mktCap: "2.4L Cr", pe: 21.8, roe: "15.6%", debt: "Low", rating: "BUY", score: 72, change: "+2.1%", up: true },
  { ticker: "SBILIFE", name: "SBI Life Insurance", sector: "Insurance", price: "1,572", mktCap: "1.6L Cr", pe: 64.1, roe: "12.4%", debt: "Nil", rating: "HOLD", score: 69, change: "-0.3%", up: false },
  { ticker: "PAGEIND", name: "Page Industries", sector: "Consumer", price: "44,320", mktCap: "0.49L Cr", pe: 58.7, roe: "78.3%", debt: "Nil", rating: "BUY", score: 85, change: "+0.8%", up: true },
  { ticker: "DMART", name: "Avenue Supermarts", sector: "Retail", price: "4,780", mktCap: "3.1L Cr", pe: 86.4, roe: "18.9%", debt: "Very Low", rating: "HOLD", score: 76, change: "-1.2%", up: false },
];

const FUND_MANAGER_HOLDINGS = [
  { manager: "Radhakishan Damani", portfolio: ["HDFC Bank", "VST Industries", "India Cements", "Avenue Supermarts", "Sundaram Finance"], style: "Value" },
  { manager: "Rakesh Jhunjhunwala (RARE)", portfolio: ["Titan Company", "Star Health", "Nazara Tech", "Canara Bank", "Indian Hotels"], style: "Growth" },
  { manager: "Dolly Khanna", portfolio: ["Rain Industries", "Deepak Fertilisers", "NOCIL", "Nilkamal", "Crest Ventures"], style: "Contrarian" },
  { manager: "Porinju Veliyath", portfolio: ["Geojit Fin Svcs", "Kerala Ayurveda", "Oriental Carbon", "Kellton Tech", "Opto Circuits"], style: "Small Cap" },
];

const NEWS_ITEMS = [
  { time: "09:42", headline: "RBI holds repo rate at 6.5%, signals accommodative stance", sentiment: "positive", sector: "Banking" },
  { time: "10:15", headline: "IT exports hit record $254B in FY24; sector outlook upgraded", sentiment: "positive", sector: "IT" },
  { time: "11:02", headline: "FII net buyers ₹3,420 Cr; 7th consecutive day of inflows", sentiment: "positive", sector: "Macro" },
  { time: "11:47", headline: "Bajaj Finance Q4 AUM growth 35% YoY beats estimates", sentiment: "positive", sector: "NBFC" },
  { time: "12:30", headline: "Crude oil rises 1.8% on OPEC supply cut extension", sentiment: "negative", sector: "Energy" },
  { time: "13:05", headline: "Pharma sector faces US FDA import alert headwinds", sentiment: "negative", sector: "Pharma" },
  { time: "14:20", headline: "PLI scheme driving auto ancillary exports — ACMA report", sentiment: "positive", sector: "Auto" },
  { time: "15:10", headline: "Nifty IT breaks above 200-DMA on strong global tech rally", sentiment: "positive", sector: "IT" },
];

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    briefcase: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    forecast: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    news: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    arrow_up: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrow_right: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };
  return icons[name] || null;
};

// ── Score Ring Component ─────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 56 }) => {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "var(--green)" : score >= 60 ? "var(--gold)" : "var(--red)";
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <span style={{ fontSize: size * 0.22, fontWeight: 700, color, fontFamily: "var(--font-head)" }}>{score}</span>
    </div>
  );
};

// ── Sector Heatmap ───────────────────────────────────────────────────────────
const HEATMAP_DATA = [
  { name: "IT", change: 2.31, size: 3 },
  { name: "Banking", change: -0.24, size: 4 },
  { name: "FMCG", change: 0.87, size: 3 },
  { name: "Auto", change: 1.42, size: 2 },
  { name: "Pharma", change: -0.61, size: 2 },
  { name: "Metals", change: 0.34, size: 2 },
  { name: "Energy", change: -1.12, size: 3 },
  { name: "Chemicals", change: 2.78, size: 2 },
  { name: "Infra", change: 1.89, size: 2 },
  { name: "NBFC", change: 1.54, size: 2 },
  { name: "Telecom", change: 0.23, size: 2 },
  { name: "Realty", change: 3.12, size: 2 },
];

const SectorHeatmap = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
    {HEATMAP_DATA.map(s => {
      const bg = s.change > 2 ? "rgba(0,229,153,.25)" : s.change > 0.5 ? "rgba(0,229,153,.13)" : s.change > 0 ? "rgba(0,229,153,.06)" : s.change > -1 ? "rgba(255,77,106,.08)" : "rgba(255,77,106,.2)";
      const col = s.change >= 0 ? "var(--green)" : "var(--red)";
      return (
        <div key={s.name} style={{ background: bg, border: `1px solid ${s.change >= 0 ? "rgba(0,229,153,.15)" : "rgba(255,77,106,.15)"}`, borderRadius: 6, padding: "8px 10px", cursor: "pointer", transition: "all .2s" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-head)" }}>{s.name}</div>
          <div style={{ fontSize: 11, color: col, marginTop: 2 }}>{s.change > 0 ? "+" : ""}{s.change}%</div>
        </div>
      );
    })}
  </div>
);

// ── Mini Spark Line ──────────────────────────────────────────────────────────
const SparkLine = ({ data, color = "var(--green)", width = 80, height = 30 }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const genSpark = (up) => {
  const arr = [100];
  for (let i = 1; i < 12; i++) arr.push(arr[i-1] + (Math.random() * 10 - (up ? 3 : 7)));
  return arr;
};

// ── AI Agent Panel ───────────────────────────────────────────────────────────
const AIAgentPanel = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI Investment Research Agent — a synthesis of Buffett-style fundamental analysis, Graham's margin of safety principles, Lynch's growth investing, and quantitative modeling.\n\nAsk me to analyze any stock, find investment opportunities, compare sectors, explain valuations, or build a portfolio thesis. I analyze Indian and global markets with institutional-grade rigor.\n\n**Try asking:**\n- Analyze Bajaj Finance for long-term investment\n- What are the best hidden gems in mid-cap chemicals?\n- Compare HDFC Bank vs ICICI Bank fundamentally\n- Build a 10-year compounding portfolio" }
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const systemPrompt = `You are an elite AI Investment Research Agent for Indian and global stock markets. You embody:

- Warren Buffett: focus on business quality, moat, management, long-term compounding
- Benjamin Graham: margin of safety, intrinsic value, financial strength, earnings stability  
- Peter Lynch: growth at reasonable price, understanding the business, sector trends
- Quantitative Analyst: data-driven scoring, statistical analysis, risk-adjusted returns
- Institutional Fund Manager: portfolio construction, risk management, sector allocation

When analyzing stocks/markets:
1. Always provide FUNDAMENTAL analysis (ROE, ROCE, PE, debt, cash flows, promoter holding)
2. Provide VALUATION assessment (intrinsic value, margin of safety, relative valuation)
3. Assess BUSINESS QUALITY (moat, management, scalability, sector tailwinds)
4. Give RISK FACTORS clearly
5. Suggest INVESTMENT HORIZON suitability (1M / 3M / 1Y / 10Y)
6. Assign a CONFIDENCE SCORE (0-100)
7. Give BUY / HOLD / AVOID recommendation with clear reasoning

Format responses with clear sections using headers. Use ₹ for Indian prices. Be specific with numbers.

Always end with: ⚠️ *This is AI-assisted research, not financial advice. Investments are subject to market risk.*`;

  const sendMessage = async () => {
    if (!query.trim() || loading) return;
    const userMsg = { role: "user", content: query };
    setMessages(m => [...m, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Unable to generate response.";
      setMessages(m => [...m, { role: "assistant", content: text }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const formatMsg = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h3>$1</h3>")
      .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[h|u|l])(.+)/, "<p>$1</p>");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "var(--bg2)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="ai" size={16} color="white" />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13 }}>AI Research Agent</div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Buffett · Graham · Lynch · Quant</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="dot-live" />
          <span style={{ fontSize: 10, color: "var(--green)" }}>LIVE</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} className="ai-response" style={{
            display: "flex", gap: 12,
            flexDirection: m.role === "user" ? "row-reverse" : "row"
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: m.role === "user" ? "var(--accent)" : "linear-gradient(135deg, var(--accent), var(--purple))",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700
            }}>
              {m.role === "user" ? "U" : "AI"}
            </div>
            <div style={{
              maxWidth: "85%",
              background: m.role === "user" ? "rgba(0,212,255,.1)" : "var(--surface)",
              border: `1px solid ${m.role === "user" ? "rgba(0,212,255,.2)" : "var(--border)"}`,
              borderRadius: 10, padding: "12px 14px",
              fontSize: 12.5, lineHeight: 1.75, color: "var(--text2)",
              fontFamily: "var(--font-body)"
            }}
              className="prose"
              dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }}
            />
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, var(--accent), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700 }}>AI</div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div className="loading-spinner" />
              <span style={{ fontSize: 12, color: "var(--text3)" }}>Analyzing markets...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--bg2)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {["Analyze HDFCBANK", "Best 10Y compounders", "Hidden gems mid-cap"].map(q => (
            <button key={q} onClick={() => setQuery(q)} style={{ padding: "4px 10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, fontSize: 10, color: "var(--text3)", cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}
              onMouseEnter={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text3)"; }}>
              {q}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about any stock, sector, or investment theme..." rows={2}
            style={{ resize: "none", flex: 1, fontSize: 12 }} />
          <button className="btn-primary" onClick={sendMessage} disabled={loading || !query.trim()}
            style={{ padding: "0 16px", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="send" size={14} color="var(--bg)" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Stock Discovery Table ────────────────────────────────────────────────────
const StockDiscovery = () => {
  const [sector, setSector] = useState("All");
  const [horizon, setHorizon] = useState("1 Year");
  const filtered = sector === "All" ? SAMPLE_STOCKS : SAMPLE_STOCKS.filter(s => s.sector === sector);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input placeholder="Search stocks, sectors, themes..." style={{ height: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {HORIZONS.map(h => (
            <button key={h} className={`horizon-tab ${horizon === h ? "active" : ""}`} onClick={() => setHorizon(h)}>{h}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SECTORS.map(s => (
          <button key={s} className={`sector-chip ${sector === s ? "active" : ""}`} onClick={() => setSector(s)}>{s}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[{ label: "AI Score > 80", val: "2 stocks", icon: "star", color: "var(--gold)" },
          { label: "Undervalued", val: "3 stocks", icon: "shield", color: "var(--green)" },
          { label: "Momentum", val: "4 stocks", icon: "zap", color: "var(--accent)" }].map(m => (
          <div key={m.label} className="card" style={{ padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ color: m.color }}><Icon name={m.icon} size={18} color={m.color} /></div>
            <div><div style={{ fontSize: 10, color: "var(--text3)" }}>{m.label}</div><div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.val}</div></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="horizontal-scroll">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Stock</th><th>Sector</th><th>Price</th><th>Change</th>
                <th>Mkt Cap</th><th>P/E</th><th>ROE</th><th>Debt</th>
                <th>AI Score</th><th>Trend</th><th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.ticker} style={{ cursor: "pointer" }}>
                  <td style={{ color: "var(--text3)", fontSize: 11 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <span className="ticker-badge">{s.ticker}</span>
                      <span style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text2)", fontSize: 11 }}>{s.sector}</td>
                  <td style={{ fontWeight: 500 }}>₹{s.price}</td>
                  <td className={s.up ? "up" : "down"} style={{ fontSize: 12, fontWeight: 500 }}>{s.change}</td>
                  <td style={{ color: "var(--text2)", fontSize: 11 }}>{s.mktCap}</td>
                  <td style={{ color: "var(--text)" }}>{s.pe}</td>
                  <td className="up">{s.roe}</td>
                  <td><span className={`tag ${s.debt === "Nil" || s.debt === "Very Low" ? "tag-green" : "tag-gold"}`}>{s.debt}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="score-bar-bg" style={{ width: 50 }}>
                        <div className="score-bar-fill" style={{ width: `${s.score}%`, background: s.score >= 80 ? "var(--green)" : "var(--gold)" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.score >= 80 ? "var(--green)" : "var(--gold)" }}>{s.score}</span>
                    </div>
                  </td>
                  <td><SparkLine data={genSpark(s.up)} color={s.up ? "var(--green)" : "var(--red)"} /></td>
                  <td><span className={`tag ${s.rating === "BUY" ? "tag-green" : s.rating === "HOLD" ? "tag-gold" : "tag-red"}`}>{s.rating}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Stock Analysis Page ──────────────────────────────────────────────────────
const StockAnalysis = () => {
  const stock = {
    ticker: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "NBFC",
    price: "7,218", change: "+3.2%", up: true,
    fundamental: 88, technical: 76, valuation: 72, sentiment: 82, confidence: 84,
    intrinsic: "8,450", upside: "+17.1%",
    scores: { growth: 91, quality: 89, moat: 85, mgmt: 88, valuation: 72 }
  };

  const scoreItems = [
    { label: "Fundamental", score: stock.fundamental, color: "var(--green)" },
    { label: "Technical", score: stock.technical, color: "var(--accent)" },
    { label: "Valuation", score: stock.valuation, color: "var(--gold)" },
    { label: "Sentiment", score: stock.sentiment, color: "var(--purple)" },
  ];

  const swot = {
    S: ["India's #1 consumer lending NBFC", "Best-in-class underwriting models", "47M+ customer franchise", "Strong tech infrastructure"],
    W: ["Elevated credit costs in rural segment", "Valuation premium (PE 30x) limits upside", "Concentrated in India only"],
    O: ["India credit penetration at just 18%", "Premiumization of consumer spending", "Digital lending expansion", "Cross-sell potential in wealth mgmt"],
    T: ["Regulatory tightening on NBFC sector", "Rising competition from banks", "Macro slowdown could spike NPAs", "Interest rate cycle risk"]
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span className="ticker-badge" style={{ fontSize: 12, padding: "3px 10px" }}>{stock.ticker}</span>
              <span className="tag tag-green">BUY</span>
              <span className="tag tag-blue">NBFC</span>
            </div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{stock.name}</div>
            <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
              <div className="stat-block">
                <span className="stat-label">CMP</span>
                <span className="stat-value" style={{ fontSize: 22, fontWeight: 700 }}>₹{stock.price}</span>
                <span className={`stat-change ${stock.up ? "up" : "down"}`}>{stock.change} today</span>
              </div>
              <div className="stat-block">
                <span className="stat-label">Intrinsic Value</span>
                <span className="stat-value" style={{ color: "var(--green)" }}>₹{stock.intrinsic}</span>
                <span className="stat-change up">{stock.upside} upside</span>
              </div>
              <div className="stat-block">
                <span className="stat-label">Confidence</span>
                <span className="stat-value" style={{ color: "var(--gold)" }}>{stock.confidence}%</span>
                <span className="stat-change neutral">AI Estimate</span>
              </div>
            </div>
          </div>
          <ScoreRing score={stock.confidence} size={80} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {scoreItems.map(s => (
          <div key={s.label} className="card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label} Score</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "var(--font-head)" }}>{s.score}</div>
            <div className="score-bar-bg" style={{ marginTop: 8 }}>
              <div className="score-bar-fill" style={{ width: `${s.score}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: 14, fontSize: 13 }}>Key Metrics</div>
          {[
            { l: "Revenue Growth (3Y)", v: "31.4% CAGR", up: true },
            { l: "Net Profit Growth", v: "40.2% CAGR", up: true },
            { l: "ROE", v: "21.8%", up: true },
            { l: "ROCE", v: "12.4%", up: true },
            { l: "Debt/Equity", v: "3.8x (NBFC norm)", neutral: true },
            { l: "Promoter Holding", v: "55.9%", up: true },
            { l: "FII Holding", v: "18.2%", up: true },
            { l: "P/E (TTM)", v: "30.2x", neutral: true },
          ].map(m => (
            <div key={m.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(30,45,61,.5)" }}>
              <span style={{ fontSize: 11.5, color: "var(--text2)" }}>{m.l}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: m.up ? "var(--green)" : m.neutral ? "var(--text)" : "var(--red)" }}>{m.v}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: 14, fontSize: 13 }}>SWOT Analysis</div>
          {Object.entries(swot).map(([k, items]) => {
            const labels = { S: ["Strengths", "var(--green)"], W: ["Weaknesses", "var(--red)"], O: ["Opportunities", "var(--accent)"], T: ["Threats", "var(--orange)"] };
            return (
              <div key={k} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: labels[k][1], fontWeight: 600, marginBottom: 4, letterSpacing: ".05em" }}>{k} — {labels[k][0]}</div>
                {items.map(item => (
                  <div key={item} style={{ fontSize: 11, color: "var(--text2)", paddingLeft: 10, lineHeight: 1.6 }}>· {item}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: 12, fontSize: 13 }}>Investment Horizon Suitability</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { h: "1 Month", score: 62, note: "High volatility; awaiting Q1 results", color: "var(--gold)" },
            { h: "3 Months", score: 75, note: "Post-results momentum expected", color: "var(--accent)" },
            { h: "1 Year", score: 88, note: "Strong earnings trajectory", color: "var(--green)" },
            { h: "10 Years", score: 91, note: "Category-defining compounder", color: "var(--green)" },
          ].map(h => (
            <div key={h.h} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 6 }}>{h.h}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: h.color, fontFamily: "var(--font-head)" }}>{h.score}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6, lineHeight: 1.5 }}>{h.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Fund Manager Tracker ─────────────────────────────────────────────────────
const FundTracker = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {[
        { label: "Total Smart Money Stocks", val: "847", icon: "star", color: "var(--gold)" },
        { label: "New Additions (30D)", val: "+124", icon: "arrow_up", color: "var(--green)" },
        { label: "Net Institutional Flow", val: "₹8,420 Cr", icon: "target", color: "var(--accent)" },
      ].map(m => (
        <div key={m.label} className="card" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={m.icon} size={18} color={m.color} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: "var(--font-head)" }}>{m.val}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {FUND_MANAGER_HOLDINGS.map(fm => (
        <div key={fm.manager} className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13 }}>{fm.manager}</div>
              <span className={`tag ${fm.style === "Value" ? "tag-gold" : fm.style === "Growth" ? "tag-green" : "tag-blue"}`}>{fm.style} Investor</span>
            </div>
            <Icon name="users" size={18} color="var(--text3)" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {fm.portfolio.map(stock => (
              <div key={stock} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: "var(--bg2)", borderRadius: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text)" }}>{stock}</span>
                <span style={{ fontSize: 10, color: "var(--text3)" }}>Holdings</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="card" style={{ padding: "16px 20px" }}>
      <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: 14, fontSize: 13 }}>FII/DII Activity — Last 10 Sessions</div>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 80 }}>
        {[3420, -1240, 5670, 2100, -890, 4320, 6780, -2340, 3890, 5120].map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: "100%", borderRadius: "3px 3px 0 0",
              height: `${Math.abs(v) / 6780 * 60}px`,
              background: v > 0 ? "var(--green)" : "var(--red)",
              opacity: .8, minHeight: 4
            }} />
            <div style={{ fontSize: 8, color: "var(--text3)", whiteSpace: "nowrap" }}>D{i + 1}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--green)" }} /><span style={{ fontSize: 10, color: "var(--text3)" }}>FII Buying</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--red)" }} /><span style={{ fontSize: 10, color: "var(--text3)" }}>FII Selling</span></div>
      </div>
    </div>
  </div>
);

// ── News & Sentiment ─────────────────────────────────────────────────────────
const NewsScreen = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {[
        { label: "Market Sentiment", val: "BULLISH", color: "var(--green)", score: 72 },
        { label: "Global Sentiment", val: "NEUTRAL", color: "var(--gold)", score: 51 },
        { label: "Social Trend", val: "POSITIVE", color: "var(--accent)", score: 68 },
      ].map(m => (
        <div key={m.label} className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 6 }}>{m.label}</div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, color: m.color }}>{m.val}</div>
          <div className="score-bar-bg" style={{ marginTop: 8 }}>
            <div className="score-bar-fill" style={{ width: `${m.score}%`, background: m.color }} />
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>{m.score}/100</div>
        </div>
      ))}
    </div>

    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <span className="dot-live" />
        <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13 }}>Live Market News</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {NEWS_ITEMS.map((n, i) => (
          <div key={i} style={{ padding: "12px 18px", borderBottom: i < NEWS_ITEMS.length - 1 ? "1px solid rgba(30,45,61,.5)" : "none", display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.02)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 10, color: "var(--text3)", whiteSpace: "nowrap", marginTop: 2, fontFamily: "var(--font-body)" }}>{n.time}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.5 }}>{n.headline}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <span className={`tag ${n.sentiment === "positive" ? "tag-green" : "tag-red"}`}>{n.sentiment}</span>
              <span className="tag tag-blue">{n.sector}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Home Dashboard ───────────────────────────────────────────────────────────
const HomeDashboard = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
      {MARKET_INDICES.map(idx => (
        <div key={idx.name} className="card" style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: "var(--text3)", marginBottom: 4, letterSpacing: ".06em", textTransform: "uppercase" }}>{idx.name}</div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--text)" }}>{idx.value}</div>
          <div style={{ fontSize: 11, marginTop: 2, color: idx.up ? "var(--green)" : "var(--red)" }}>{idx.change} ({idx.pct})</div>
        </div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14 }}>Top AI Picks Today</div>
          <span className="dot-live" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TOP_STOCKS.map(s => (
            <div key={s.ticker} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", background: "var(--bg2)", borderRadius: 7, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
              onMouseLeave={e => { }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "var(--accent)", letterSpacing: ".04em" }}>{s.ticker.slice(0, 4)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 1 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{s.sector} · {s.horizon}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>₹{s.price}</div>
                <div style={{ fontSize: 11, color: s.up ? "var(--green)" : "var(--red)" }}>{s.change}</div>
              </div>
              <ScoreRing score={s.score} size={40} />
              <span className={`tag ${s.tag === "Hidden Gem" ? "tag-purple" : s.tag === "Compounder" ? "tag-gold" : s.tag === "Momentum" ? "tag-blue" : "tag-green"}`}>{s.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Sector Heatmap</div>
        <SectorHeatmap />
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Market Sentiment", val: "BULLISH", icon: "zap", color: "var(--green)", note: "72/100" },
        { label: "FII Activity", val: "+₹3,420 Cr", icon: "arrow_up", color: "var(--green)", note: "7 Day Buying Streak" },
        { label: "New 52W Highs", val: "187 stocks", icon: "target", color: "var(--accent)", note: "vs 42 lows" },
        { label: "AI Opportunities", val: "23 picks", icon: "star", color: "var(--gold)", note: "High confidence" },
      ].map(m => (
        <div key={m.label} className="card" style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".06em" }}>{m.label}</span>
            <Icon name={m.icon} size={14} color={m.color} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: m.color, fontFamily: "var(--font-head)" }}>{m.val}</div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>{m.note}</div>
        </div>
      ))}
    </div>

    <div className="card" style={{ padding: "14px 20px", background: "rgba(255,77,106,.05)", borderColor: "rgba(255,77,106,.15)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Icon name="info" size={16} color="var(--text3)" />
        <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--text2)" }}>Disclaimer:</strong> This platform provides AI-assisted market analysis and is <strong style={{ color: "var(--gold)" }}>not financial advice</strong>. All recommendations are generated by algorithms and are probabilistic in nature. Past performance does not guarantee future results. Investments are subject to market risks. Please consult a SEBI-registered investment advisor before making investment decisions.
        </div>
      </div>
    </div>
  </div>
);

// ── Main App ─────────────────────────────────────────────────────────────────
const SCREENS = [
  { id: "home", label: "Dashboard", icon: "home" },
  { id: "discover", label: "Stock Discovery", icon: "search" },
  { id: "analysis", label: "Stock Analysis", icon: "chart" },
  { id: "agent", label: "AI Agent", icon: "ai" },
  { id: "funds", label: "Fund Tracker", icon: "users" },
  { id: "news", label: "News & Sentiment", icon: "news" },
];

export default function App() {
  const [screen, setScreen] = useState("home");

  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomeDashboard />;
      case "discover": return <StockDiscovery />;
      case "analysis": return <StockAnalysis />;
      case "agent": return <AIAgentPanel />;
      case "funds": return <FundTracker />;
      case "news": return <NewsScreen />;
      default: return <HomeDashboard />;
    }
  };

  const screenTitle = SCREENS.find(s => s.id === screen)?.label;

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="forecast" size={17} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, letterSpacing: "-.02em", color: "var(--text)" }}>AlphaEdge</div>
                <div style={{ fontSize: 9, color: "var(--text3)", letterSpacing: ".08em" }}>AI RESEARCH PLATFORM</div>
              </div>
            </div>
          </div>

          <div style={{ padding: "12px 8px", flex: 1, overflowY: "auto" }}>
            <div style={{ fontSize: 9, color: "var(--text3)", letterSpacing: ".1em", padding: "4px 8px", marginBottom: 4 }}>MAIN MENU</div>
            {SCREENS.map(s => (
              <div key={s.id} className={`nav-item ${screen === s.id ? "active" : ""}`} onClick={() => setScreen(s.id)}>
                <Icon name={s.icon} size={15} color="currentColor" />
                <span>{s.label}</span>
              </div>
            ))}

            <div style={{ fontSize: 9, color: "var(--text3)", letterSpacing: ".1em", padding: "16px 8px 4px", marginBottom: 4 }}>TOOLS</div>
            {[{ id: "portfolio", label: "Portfolio Builder", icon: "briefcase" },
              { id: "alerts", label: "Alerts", icon: "bell" },
              { id: "settings", label: "Settings", icon: "settings" }].map(s => (
              <div key={s.id} className="nav-item" onClick={() => {}}>
                <Icon name={s.icon} size={15} color="currentColor" />
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "rgba(0,212,255,.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span className="dot-live" />
              <span style={{ fontSize: 10, color: "var(--green)" }}>Markets Open</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>NSE · BSE · 09:15 – 15:30 IST</div>
            <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>Last updated: just now</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Topbar */}
          <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16, background: "var(--bg2)", flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16 }}>{screenTitle}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>
                {screen === "agent" ? "Powered by Claude AI · Buffett + Graham + Lynch models" : "NSE · BSE · Indian & Global Markets · Real-time Analysis"}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 9, color: "var(--text3)" }}>NIFTY 50</span>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>24,362</span>
                <span style={{ color: "var(--green)", fontSize: 11 }}>+0.78%</span>
              </div>
              <button className="btn-ghost" style={{ padding: "5px 10px" }}><Icon name="bell" size={14} /></button>
              <button className="btn-primary" onClick={() => setScreen("agent")}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="ai" size={13} color="var(--bg)" />
                  Ask AI
                </span>
              </button>
            </div>
          </div>

          {/* Screen Content */}
          <div style={{ flex: 1, overflowY: screen === "agent" ? "hidden" : "auto", padding: screen === "agent" ? 0 : "20px 24px", display: "flex", flexDirection: "column" }}>
            {screen === "agent"
              ? <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}><AIAgentPanel /></div>
              : renderScreen()
            }
          </div>
        </div>
      </div>
    </>
  );
}
