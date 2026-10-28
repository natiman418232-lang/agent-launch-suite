"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Bot,
  Sparkles,
  TrendingUp,
  Wallet,
  Send,
  X,
  Activity,
  BarChart3,
  RefreshCw,
  Layers,
  Lock,
  KeyRound,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  Zap,
  Globe,
  LogOut,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Coins,
  ArrowDownRight,
  Shield,
} from "lucide-react";

// Compound V3 Multi-Chain Markets Data
const MARKETS = [
  {
    id: "usdc-eth",
    name: "USDC (Ethereum)",
    chain: "Ethereum",
    symbol: "USDC",
    tvl: "$1.18B",
    supplyApr: "4.85%",
    borrowApr: "6.72%",
    utilization: "79.4%",
    baseMultiplier: 1.0,
  },
  {
    id: "weth-eth",
    name: "WETH (Ethereum)",
    chain: "Ethereum",
    symbol: "WETH",
    tvl: "$492M",
    supplyApr: "2.35%",
    borrowApr: "4.15%",
    utilization: "63.1%",
    baseMultiplier: 0.42,
  },
  {
    id: "usdt-eth",
    name: "USDT (Ethereum)",
    chain: "Ethereum",
    symbol: "USDT",
    tvl: "$310M",
    supplyApr: "5.10%",
    borrowApr: "7.20%",
    utilization: "81.0%",
    baseMultiplier: 0.28,
  },
  {
    id: "usdc-arb",
    name: "USDC (Arbitrum)",
    chain: "Arbitrum",
    symbol: "USDC",
    tvl: "$245M",
    supplyApr: "5.60%",
    borrowApr: "7.95%",
    utilization: "84.2%",
    baseMultiplier: 0.22,
  },
  {
    id: "weth-arb",
    name: "WETH (Arbitrum)",
    chain: "Arbitrum",
    symbol: "WETH",
    tvl: "$88M",
    supplyApr: "2.80%",
    borrowApr: "4.60%",
    utilization: "68.0%",
    baseMultiplier: 0.12,
  },
  {
    id: "usdc-base",
    name: "USDC (Base)",
    chain: "Base",
    symbol: "USDC",
    tvl: "$182M",
    supplyApr: "6.20%",
    borrowApr: "8.40%",
    utilization: "88.5%",
    baseMultiplier: 0.16,
  },
  {
    id: "usdc-poly",
    name: "USDC (Polygon)",
    chain: "Polygon",
    symbol: "USDC",
    tvl: "$95M",
    supplyApr: "4.90%",
    borrowApr: "6.90%",
    utilization: "74.5%",
    baseMultiplier: 0.09,
  },
  {
    id: "usdc-op",
    name: "USDC (Optimism)",
    chain: "Optimism",
    symbol: "USDC",
    tvl: "$76M",
    supplyApr: "5.30%",
    borrowApr: "7.50%",
    utilization: "77.0%",
    baseMultiplier: 0.07,
  },
];

const CHAINS_FILTER = ["All Chains", "Ethereum", "Arbitrum", "Base", "Polygon", "Optimism"];
const TIMEFRAMES = ["24H", "Yesterday", "7D", "30D"];

// Telemetry Mock Data
const TRAFFIC_DATA = [
  { day: "Day 1", visitors: 420, activeUsers: 180 },
  { day: "Day 5", visitors: 680, activeUsers: 310 },
  { day: "Day 10", visitors: 950, activeUsers: 480 },
  { day: "Day 15", visitors: 1420, activeUsers: 720 },
  { day: "Day 20", visitors: 1980, activeUsers: 1040 },
  { day: "Day 25", visitors: 2650, activeUsers: 1490 },
  { day: "Day 30", visitors: 3410, activeUsers: 1890 },
];

export default function CompoundDashboard() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState("dashboard");

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // Market Selection & Chart State
  const [selectedChain, setSelectedChain] = useState("All Chains");
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");

  // Circle Lending Action Modal State
  const [isLendingModalOpen, setIsLendingModalOpen] = useState(false);
  const [lendingActionType, setLendingActionType] = useState("supply");
  const [lendingAmount, setLendingAmount] = useState("1000");
  const [isLendingProcessing, setIsLendingProcessing] = useState(false);
  const [lendingSuccess, setLendingSuccess] = useState(false);

  // AI Drawer State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      text: "Hello! I am your Compound V3 & Circle USDC Copilot powered by Google Gemini. Ask me anything about lending rates, Circle Programmable Wallets, or cross-chain settlement!",
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Filter Markets
  const filteredMarkets =
    selectedChain === "All Chains"
      ? MARKETS
      : MARKETS.filter((m) => m.chain === selectedChain);

  // Dynamic Chart Generation
  const generateChartData = () => {
    const points =
      selectedTimeframe === "24H"
        ? 12
        : selectedTimeframe === "Yesterday"
        ? 8
        : selectedTimeframe === "7D"
        ? 7
        : 15;

    const data = [];
    for (let i = 1; i <= points; i++) {
      const label =
        selectedTimeframe === "24H"
          ? `${i * 2}:00`
          : selectedTimeframe === "Yesterday"
          ? `H-${i * 3}`
          : selectedTimeframe === "7D"
          ? `Day ${i}`
          : `Nov ${i * 2}`;

      const mult = selectedMarket.baseMultiplier;
      const baseVal = 700 * mult;
      const tvl = Math.round(baseVal + Math.sin(i * 0.8) * 60 + i * 8);
      const supplyVol = Math.round(baseVal * 0.4 + Math.cos(i) * 25);
      const borrowVol = Math.round(baseVal * 0.3 + Math.sin(i) * 20);

      data.push({
        time: label,
        tvl: tvl,
        supplyVolume: supplyVol,
        borrowVolume: borrowVol,
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // AI Handler
  const handleSendMessage = async (customMessage) => {
    const query = customMessage || chatInput;
    if (!query.trim() || isAiLoading) return;

    const newMessages = [...chatMessages, { role: "user", text: query }];
    setChatMessages(newMessages);
    if (!customMessage) setChatInput("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();

      if (data.reply) {
        setChatMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", text: "Notice: Unable to process response. " + (data.error || "") },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: "Connection error: " + err.message },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === "admin" && adminPass === "compound2025") {
      setIsAdminLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try: admin / compound2025");
    }
  };

  // Handle Circle Lending Execution Simulation
  const executeLendingAction = () => {
    setIsLendingProcessing(true);
    setTimeout(() => {
      setIsLendingProcessing(false);
      setLendingSuccess(true);
      setTimeout(() => {
        setLendingSuccess(false);
        setIsLendingModalOpen(false);
      }, 2500);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Activity className="h-6 w-6 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Compound V3 <span className="text-emerald-400">Comet</span>
                  </h1>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    CIRCLE DEVELOPER SUITE
                  </span>
                </div>
                <p className="text-xs text-slate-400">Institutional Multi-Chain Lending & AI Copilot</p>
              </div>
            </div>

            {/* TAB SELECTOR: Live Dashboard vs Admin Telemetry */}
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl ml-4">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "dashboard"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📊 Live Markets
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === "admin"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Lock className="w-3 h-3" />
                Admin Telemetry
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Lending Action Buttons */}
            <button
              onClick={() => {
                setLendingActionType("supply");
                setIsLendingModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              <Coins className="w-3.5 h-3.5" />
              Supply USDC
            </button>

            <button
              onClick={() => {
                setLendingActionType("borrow");
                setIsLendingModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              Borrow USDC
            </button>

            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              Open AI Copilot
            </button>

            <button
              onClick={() => {
                setLendingActionType("supply");
                setIsLendingModalOpen(true);
              }}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              Circle Wallet
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: LIVE DASHBOARD */}
      {activeTab === "dashboard" && (
        <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
          {/* Hero Banner for Circle Developer Integration */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800/80 rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <Shield className="w-4 h-4" />
                <span>Integrated with Circle Developer Platform & CCTP</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                One-Click Multi-Chain USDC Lending & Borrowing
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute gasless stablecoin deposits, earn instant yields, or borrow liquidity across 5 networks.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setLendingActionType("supply");
                  setIsLendingModalOpen(true);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
              >
                + Supply to {selectedMarket.symbol}
              </button>
              <button
                onClick={() => {
                  setLendingActionType("borrow");
                  setIsLendingModalOpen(true);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition"
              >
                Borrow Liquidity
              </button>
            </div>
          </div>

          {/* Chain Filters */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Filter by Blockchain:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CHAINS_FILTER.map((chain) => (
                <button
                  key={chain}
                  onClick={() => setSelectedChain(chain)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedChain === chain
                      ? "bg-slate-700 text-emerald-400 border border-emerald-500/50 shadow-sm font-semibold"
                      : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {chain}
                </button>
              ))}
            </div>
          </div>

          {/* Markets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {filteredMarkets.map((market) => {
              const isSelected = selectedMarket.id === market.id;
              return (
                <div
                  key={market.id}
                  onClick={() => setSelectedMarket(market)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {market.chain}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isSelected ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{market.name}</h3>
                  <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-slate-800/80">
                    <span className="text-slate-400">TVL</span>
                    <span className="font-semibold text-emerald-400">{market.tvl}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400">Total Value Locked (TVL)</span>
              <div className="text-2xl font-black text-white mt-2">{selectedMarket.tvl}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +5.4% from selected period
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400">Supply APR (Base Yield)</span>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                {selectedMarket.supplyApr}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Compound Comet Base</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400">Borrow APR (Variable)</span>
              <div className="text-2xl font-black text-teal-300 mt-2">
                {selectedMarket.borrowApr}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Dynamic Algorithm</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400">Utilization Rate</span>
              <div className="text-2xl font-black text-white mt-2">
                {selectedMarket.utilization}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Optimized Liquidity</div>
            </div>
          </div>

          {/* Timeframe Filter Bar */}
          <div className="flex justify-between items-center mb-6 bg-slate-900/40 p-2 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 px-3">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">Live Chart Filters:</span>
            </div>
            <div className="flex gap-1.5">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedTimeframe === tf
                      ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* 2 CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Market Liquidity & TVL Trend
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Historical curve for {selectedMarket.name} ({selectedTimeframe})
              </p>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tvlColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tvl"
                      name="TVL ($M)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#tvlColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                Daily Supply vs. Borrow Volume
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Comparative flow for {selectedMarket.name}
              </p>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="supplyVolume" name="Supply ($M)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="borrowVolume" name="Borrow ($M)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW 2: ADMIN TELEMETRY (Protected with Login) */}
      {activeTab === "admin" && (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
          {!isAdminLoggedIn ? (
            /* Admin Login Card */
            <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl mt-8">
              <div className="text-center mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-3">
                  <Lock className="h-7 w-7 text-slate-950" />
                </div>
                <h2 className="text-2xl font-bold text-white">Telemetry Admin Login</h2>
                <p className="text-xs text-slate-400 mt-1">Ecosystem Telemetry & User KPIs</p>
              </div>

              {loginError && (
                <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Username
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5">
                    <Users className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admin"
                      className="bg-transparent text-xs text-white focus:outline-none flex-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Password
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5">
                    <KeyRound className="w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="••••••••••••"
                      className="bg-transparent text-xs text-white focus:outline-none flex-1"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
                >
                  Sign In to Admin Portal
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <span className="text-[11px] text-slate-500">
                  Demo Credentials: <strong className="text-slate-300">admin</strong> /{" "}
                  <strong className="text-slate-300">compound2025</strong>
                </span>
              </div>
            </div>
          ) : (
            /* Logged in Telemetry Dashboard */
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Platform Telemetry & Growth Metrics
                  </h2>
                  <p className="text-xs text-slate-400">Verifiable DAU and unique user tracking</p>
                </div>
                <button
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs border border-slate-700 transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  Sign Out
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400">Daily Active Users (DAU)</span>
                  <div className="text-3xl font-black text-white mt-2">1,890</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <ArrowUpRight className="w-3 h-3" /> +14.2% today
                  </div>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400">Total Unique Visitors</span>
                  <div className="text-3xl font-black text-white mt-2">48,650</div>
                  <div className="text-[11px] text-slate-400 mt-1">Cumulative platform traffic</div>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400">AI Copilot Queries Handled</span>
                  <div className="text-3xl font-black text-emerald-400 mt-2">14,280</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <Zap className="w-3 h-3" /> 99.4% resolution rate
                  </div>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400">Avg. Session Duration</span>
                  <div className="text-3xl font-black text-white mt-2">4m 38s</div>
                  <div className="text-[11px] text-slate-400 mt-1">Institutional deep research</div>
                </div>
              </div>

              {/* Traffic Chart */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
                <h3 className="text-sm font-bold text-white mb-1">
                  User Adoption & AI Interaction Curve (30-Day Growth)
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Tracking unique visitors vs. active daily users
                </p>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TRAFFIC_DATA}>
                      <defs>
                        <linearGradient id="visColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        name="Total Visitors"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#visColor)"
                      />
                      <Area
                        type="monotone"
                        dataKey="activeUsers"
                        name="Active Users (DAU)"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        fill="#14b8a6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CIRCLE DEVELOPER LENDING & BORROWING MODAL */}
      {isLendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Circle USDC Portal
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                      Gasless
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Target: {selectedMarket.name} ({selectedMarket.chain})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLendingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Tabs: Supply vs Borrow */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 mb-5">
              <button
                onClick={() => setLendingActionType("supply")}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  lendingActionType === "supply"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Supply USDC (Earn)
              </button>
              <button
                onClick={() => setLendingActionType("borrow")}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  lendingActionType === "borrow"
                    ? "bg-teal-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                Borrow USDC
              </button>
            </div>

            {/* Deposit Input */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>Amount to {lendingActionType === "supply" ? "Deposit" : "Borrow"}</span>
                <span>Balance: 12,450.00 USDC</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-emerald-500 rounded-2xl p-3 transition">
                <input
                  type="number"
                  value={lendingAmount}
                  onChange={(e) => setLendingAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-lg font-bold text-white focus:outline-none flex-1"
                />
                <span className="text-xs font-bold text-emerald-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                  USDC
                </span>
              </div>
            </div>

            {/* Live Rate Summary */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 mb-5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Current Protocol APR</span>
                <span className="font-bold text-emerald-400">
                  {lendingActionType === "supply" ? selectedMarket.supplyApr : selectedMarket.borrowApr}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Gas Fee</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> $0.00 (Sponsored by Circle Paymaster)
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Execution Provider</span>
                <span className="text-slate-200 font-medium">Circle Programmable Wallet</span>
              </div>
            </div>

            {/* Success Notification */}
            {lendingSuccess && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Success! Transaction confirmed via Circle CCTP on {selectedMarket.chain}.
                </span>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={executeLendingAction}
              disabled={isLendingProcessing || !lendingAmount || lendingSuccess}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLendingProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  Routing via Circle Developer Platform...
                </>
              ) : lendingSuccess ? (
                "Transaction Complete ✓"
              ) : (
                `Execute ${lendingActionType === "supply" ? "Supply" : "Borrow"} via Circle Wallet`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 transition transform hover:scale-105"
      >
        <Bot className="w-5 h-5 fill-slate-950" />
        <span>Ask AI Copilot</span>
      </button>

      {/* SLIDE-OUT AI COPILOT DRAWER */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-slate-950 border-l border-slate-800 p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isAiOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Circle & Compound Copilot
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </h2>
              <p className="text-[10px] text-slate-400">Powered by Google Gemini</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="py-3 flex flex-wrap gap-1.5 border-b border-slate-800/80">
          {[
            "💡 How does Circle Wallet work?",
            "💰 Best USDC Supply APR?",
            "🚀 What is CCTP?",
          ].map((pill) => (
            <button
              key={pill}
              onClick={() => handleSendMessage(pill)}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full transition"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-slate-950 font-semibold"
                    : "bg-slate-900 border border-slate-800 text-slate-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isAiLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Gemini AI is analyzing...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="pt-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-emerald-500 transition"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about Circle USDC or Compound V3..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
            />
            <button
              type="submit"
              disabled={isAiLoading || !chatInput.trim()}
              className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-40 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}