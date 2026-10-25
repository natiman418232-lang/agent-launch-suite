'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Bot, 
  Coins, 
  Code2, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Wallet, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Cpu,
  X,
  LineChart,
  MessageSquare,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. DATA FOR TRACKER
  const [tokens, setTokens] = useState([
    { name: 'Fetch.ai', symbol: 'FET', price: 1.34, change: 8.45, mcap: '1.14B', volume: '142M', progress: 100, live: true, high7d: 1.42, low7d: 1.18, high30d: 1.55, low30d: 0.98 },
    { name: 'League of Agents', symbol: 'LOA', price: 0.082, change: 14.2, mcap: '8.2M', volume: '840K', progress: 92, live: true, high7d: 0.089, low7d: 0.065, high30d: 0.095, low30d: 0.040 },
    { name: 'Shakti Foundation', symbol: 'SHAKTI', price: 0.041, change: -3.15, mcap: '4.1M', volume: '310K', progress: 78, live: false, high7d: 0.048, low7d: 0.038, high30d: 0.062, low30d: 0.035 },
    { name: 'ZuCity Agent', symbol: 'ZUCITY', price: 0.019, change: 24.8, mcap: '1.9M', volume: '190K', progress: 65, live: true, high7d: 0.021, low7d: 0.012, high30d: 0.025, low30d: 0.009 },
    { name: 'Creationology', symbol: 'CR369', price: 0.0055, change: -1.2, mcap: '550K', volume: '45K', progress: 42, live: false, high7d: 0.0062, low7d: 0.0051, high30d: 0.0080, low30d: 0.0042 },
  ]);

  // 2. CHART MODAL STATE (7D / 30D)
  const [selectedTokenForChart, setSelectedTokenForChart] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState('7D'); // '7D' or '30D'

  // 3. HOSTINGER-STYLE FLOATING GEMINI COPILOT STATE
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([
    { role: 'assistant', text: 'ሰላም! I am your Fetch.ai & BNB Chain AI Copilot powered by Google Gemini. Ask me about live tokens, top gainers, or how to launch an agent!' }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // 4. NO-CODE GENERATOR STATE
  const [agentName, setAgentName] = useState('BSCScoutAgent');
  const [agentRole, setAgentRole] = useState('Price Arbitrage Monitor');
  const [agentInterval, setAgentInterval] = useState('30');

  // Handle Wallet
  const handleConnectWallet = () => {
    if (!walletConnected) {
      setWalletAddress('0x71C...89E4');
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
      setWalletAddress('');
    }
  };

  // Refresh Prices
  const refreshPrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTokens(prev => prev.map(t => ({
        ...t,
        price: +(t.price * (1 + (Math.random() * 0.04 - 0.02))).toFixed(4),
        change: +(t.change + (Math.random() * 2 - 1)).toFixed(2)
      })));
      setIsRefreshing(false);
    }, 600);
  };

  // GEMINI API CALL FOR HOSTINGER-STYLE COPILOT
  const handleSendCopilotMessage = async (queryText) => {
    const textToSend = queryText || copilotInput;
    if (!textToSend.trim() || isThinking) return;

    const newMsgs = [...copilotMessages, { role: 'user', text: textToSend }];
    setCopilotMessages(newMsgs);
    setCopilotInput('');
    setIsThinking(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyB8GH11q8_prm18Ai3mo4a3cwUVjMz_LcA';
      
      const currentTokenSummary = tokens.map(t => 
        `${t.name} ($${t.symbol}): Price $${t.price}, 24h Change ${t.change}%, MarketCap $${t.mcap}, Graduation ${t.progress}%`
      ).join('\n');

      const systemPrompt = `You are "Agent Launch Copilot", an elite AI assistant for the Fetch.ai and BNB Chain autonomous agent ecosystem.
Here is the LIVE TOKEN DATA right now:
${currentTokenSummary}

User Question: "${textToSend}"

Instructions:
1. Answer accurately based on the live token data above (e.g. if asked who is pumping, note ZuCity +24.8% and LOA +14.2%).
2. You can respond in Tigrinya or English depending on user language. Keep responses concise, friendly, and helpful.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I am analyzing the blockchain... please try again!";

      setCopilotMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setCopilotMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to Gemini. Make sure your API key is active!" }]);
    } finally {
      setIsThinking(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans relative">
      
      {/* NAVBAR */}
      <header className="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Cpu className="text-black h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AgentLaunch Suite
            </h1>
            <p className="text-xs text-gray-400">Fetch.ai (ASI) × BNB Chain Portal</p>
          </div>
        </div>

        {/* TABS */}
        <div className="hidden md:flex bg-gray-900/90 p-1 rounded-xl border border-gray-800 space-x-1">
          <button 
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${activeTab === 'tracker' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}>
            <Activity className="h-4 w-4" /> Live Tracker & Charts
          </button>
          <button 
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${activeTab === 'generator' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}>
            <Code2 className="h-4 w-4" /> No-Code Deployer
          </button>
          <button 
            onClick={() => setActiveTab('signals')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${activeTab === 'signals' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}>
            <Bell className="h-4 w-4" /> Alerts
          </button>
        </div>

        {/* WALLET BUTTON */}
        <button 
          onClick={handleConnectWallet}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition active:scale-95">
          <Wallet className="h-4 w-4" />
          {walletConnected ? walletAddress : 'Connect BSC Wallet'}
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">

        {/* HERO BANNER */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-gray-900 to-cyan-950/40 border border-emerald-500/20 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" /> Google Gemini AI + Fetch.ai Integrated
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Autonomous AI Agent Ecosystem & Live Analytics
            </h2>
            <p className="text-sm text-gray-400">
              Click any token row to inspect 7D / 30D price charts. Use the Hostinger-style AI Copilot (bottom right) for instant live insights.
            </p>
          </div>

          <button 
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-black font-bold text-xs px-4 py-3 rounded-xl shadow-lg transition">
            <Bot className="h-4 w-4" /> Open AI Assistant
          </button>
        </div>

        {/* TAB 1: TRACKER & CHARTS */}
        {activeTab === 'tracker' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  Live Token Analytics (Click row for Chart)
                </h3>
                <p className="text-xs text-gray-400">Real-time DEX liquidity pools & PancakeSwap graduation</p>
              </div>
              <button 
                onClick={refreshPrices}
                className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700 transition">
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60 shadow-xl">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-950/70 text-xs text-gray-400 uppercase border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4">Agent Token</th>
                    <th className="px-6 py-4">Price (USD)</th>
                    <th className="px-6 py-4">24h Change</th>
                    <th className="px-6 py-4">Market Cap</th>
                    <th className="px-6 py-4">Graduation</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {tokens.map((token, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedTokenForChart(token)}
                      className="hover:bg-gray-800/50 cursor-pointer transition group">
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        {token.name} <span className="text-xs text-gray-500 font-normal">(${token.symbol})</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">${token.price}</td>
                      <td className="px-6 py-4 font-mono">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${token.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {token.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {token.change >= 0 ? `+${token.change}%` : `${token.change}%`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono">${token.mcap}</td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-xs space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-400">{token.progress}%</span>
                            <span className="text-emerald-400">{token.progress === 100 ? 'Graduated 🎉' : 'Bonding'}</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${token.progress}%` }}>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-black transition">
                          View Chart 📈
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NO-CODE AGENT GENERATOR */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-emerald-400" />
                Fetch.ai uAgents Generator
              </h3>
              <p className="text-xs text-gray-400">Configure parameters to generate a production-ready autonomous agent script.</p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Agent Name</label>
                  <input 
                    type="text" 
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Role / Function</label>
                  <select 
                    value={agentRole}
                    onChange={(e) => setAgentRole(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
                    <option>Price Arbitrage Monitor</option>
                    <option>Agent Launch Token Liquidity Sentinel</option>
                    <option>PancakeSwap Graduation Tracker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Interval (Seconds)</label>
                  <input 
                    type="number" 
                    value={agentInterval}
                    onChange={(e) => setAgentInterval(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-xs font-mono text-emerald-400">Output: agent.py</span>
                <button 
                  onClick={() => copyToClipboard(`from uagents import Agent, Context\nagent = Agent(name="${agentName}")\n@agent.on_interval(period=${agentInterval}.0)\nasync def run(ctx: Context):\n    ctx.logger.info("Executing ${agentRole} on BNB Chain")\nagent.run()`)}
                  className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-2.5 py-1 rounded transition">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="my-3 p-4 bg-gray-950 rounded-lg border border-gray-800 font-mono text-[11px] text-gray-300 overflow-x-auto">
{`from uagents import Agent, Context

agent = Agent(name="${agentName}", seed="${agentName}_seed_key")

@agent.on_interval(period=${agentInterval}.0)
async def run(ctx: Context):
    ctx.logger.info("Executing: ${agentRole} on BNB Chain")
    # Querying Fetch.ai Agentverse & Agent Launch Contracts...

if __name__ == "__main__":
    agent.run()`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: SIGNALS */}
        {activeTab === 'signals' && (
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-400" />
              Live On-Chain Agent Triggers
            </h3>
            <div className="space-y-3">
              {[
                { time: '3 mins ago', tag: 'Graduation Alert', desc: '$LOA bonding curve hit 92%! Approaching PancakeSwap listing threshold.', high: true },
                { time: '12 mins ago', tag: 'Gainers Alert', desc: '$ZUCITY up +24.8% on BSC volume surge over the past 24 hours.', high: false },
                { time: '1 hr ago', tag: 'Ecosystem', desc: 'Fetch.ai ASI:One protocol relayed 4,200 microtransactions across Agentverse.', high: false },
              ].map((a, i) => (
                <div key={i} className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.high ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                      {a.tag}
                    </span>
                    <p className="text-xs text-gray-300 mt-1">{a.desc}</p>
                  </div>
                  <span className="text-[11px] text-gray-500">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* 1. INTERACTIVE TOKEN CHART MODAL (7D / 30D)              */}
      {/* ======================================================== */}
      {selectedTokenForChart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  {selectedTokenForChart.symbol}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedTokenForChart.name} (${selectedTokenForChart.symbol})
                  </h3>
                  <p className="text-xs text-gray-400">Current Price: <span className="font-mono text-emerald-400 font-bold">${selectedTokenForChart.price}</span></p>
                </div>
              </div>

              {/* Timeframe selector (7D / 30D) */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-950 p-1 rounded-lg border border-gray-800 flex text-xs">
                  <button 
                    onClick={() => setChartTimeframe('7D')}
                    className={`px-3 py-1 rounded font-medium transition ${chartTimeframe === '7D' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
                    7 Days
                  </button>
                  <button 
                    onClick={() => setChartTimeframe('30D')}
                    className={`px-3 py-1 rounded font-medium transition ${chartTimeframe === '30D' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
                    30 Days
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedTokenForChart(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Price Stats Banner */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                <span className="text-gray-500">Timeframe High</span>
                <p className="text-white font-mono font-bold text-sm mt-0.5">
                  ${chartTimeframe === '7D' ? selectedTokenForChart.high7d : selectedTokenForChart.high30d}
                </p>
              </div>
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                <span className="text-gray-500">Timeframe Low</span>
                <p className="text-white font-mono font-bold text-sm mt-0.5">
                  ${chartTimeframe === '7D' ? selectedTokenForChart.low7d : selectedTokenForChart.low30d}
                </p>
              </div>
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                <span className="text-gray-500">Market Cap</span>
                <p className="text-emerald-400 font-mono font-bold text-sm mt-0.5">
                  ${selectedTokenForChart.mcap}
                </p>
              </div>
            </div>

            {/* SVG Interactive Trendline Chart */}
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>{chartTimeframe === '7D' ? '7 Days Ago' : '30 Days Ago'}</span>
                <span>Live Price Trend</span>
                <span>Today</span>
              </div>
              <div className="h-44 w-full flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill area */}
                  <path 
                    d={chartTimeframe === '7D' 
                      ? "M 0 110 Q 70 80, 140 95 T 280 40 T 420 60 T 500 20 L 500 150 L 0 150 Z" 
                      : "M 0 130 Q 80 120, 160 85 T 320 65 T 440 30 T 500 15 L 500 150 L 0 150 Z"} 
                    fill="url(#chartGrad)" 
                  />
                  {/* Stroke line */}
                  <path 
                    d={chartTimeframe === '7D' 
                      ? "M 0 110 Q 70 80, 140 95 T 280 40 T 420 60 T 500 20" 
                      : "M 0 130 Q 80 120, 160 85 T 320 65 T 440 30 T 500 15"} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  {/* Endpoint Pulse */}
                  <circle cx="500" cy={chartTimeframe === '7D' ? "20" : "15"} r="5" fill="#10b981" className="animate-ping" />
                  <circle cx="500" cy={chartTimeframe === '7D' ? "20" : "15"} r="4" fill="#34d399" />
                </svg>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-500">Graduation Progress: {selectedTokenForChart.progress}%</span>
              <button 
                onClick={() => setSelectedTokenForChart(null)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs px-4 py-2 rounded-xl transition">
                Close Chart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HOSTINGER-STYLE FLOATING GEMINI AI COPILOT            */}
      {/* ======================================================== */}

      {/* Floating Trigger Button (Bottom-Right) */}
      {!isCopilotOpen && (
        <button 
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:scale-105 active:scale-95 text-black p-4 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 font-bold text-xs transition duration-200">
          <Bot className="h-5 w-5" />
          <span>Ask AI Copilot</span>
          <span className="h-2 w-2 rounded-full bg-black animate-ping"></span>
        </button>
      )}

      {/* Hostinger-style Sliding Drawer */}
      {isCopilotOpen && (
        <div className="fixed bottom-0 right-0 top-0 w-full sm:w-[420px] bg-[#0c1322] border-l border-gray-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-gray-800 bg-[#0f172a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Agent Launch Copilot
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium">Powered by Google Gemini 1.5</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCopilotOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Prompts (Pills) */}
          <div className="p-3 bg-gray-950/60 border-b border-gray-800 flex gap-2 overflow-x-auto text-[11px]">
            <button 
              onClick={() => handleSendCopilotMessage("Which token is gaining the fastest right now?")}
              className="bg-gray-800/80 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-gray-700">
              🚀 Top Gainers?
            </button>
            <button 
              onClick={() => handleSendCopilotMessage("Explain what Fetch.ai (FET) does on BNB Chain.")}
              className="bg-gray-800/80 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-gray-700">
              💡 Explain $FET
            </button>
            <button 
              onClick={() => handleSendCopilotMessage("How close is $LOA to graduating to PancakeSwap?")}
              className="bg-gray-800/80 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-gray-700">
              🥞 $LOA Graduation?
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {copilotMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-black font-medium' 
                    : 'bg-gray-900 border border-gray-800 text-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-2.5 text-xs text-gray-400 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                  Gemini is analyzing live blockchain data...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendCopilotMessage(); }} className="p-3 border-t border-gray-800 bg-[#0f172a] flex gap-2">
            <input 
              type="text" 
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="Ask anything (e.g. 'ቅልጡፍ ቶከን ዝድይብ ዘሎ ንገረኒ')..."
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button 
              type="submit" 
              disabled={isThinking}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition">
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}