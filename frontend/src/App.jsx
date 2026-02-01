import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Check } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

/* --- GLASS & ANIMATION THEME --- */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --accent: #CCFF00; /* Acid Lime */
    --accent-glow: rgba(204, 255, 0, 0.4);
    --glass-bg: rgba(12, 12, 12, 0.7);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-blur: blur(12px);
  }

  * { box-sizing: border-box; }

  /* --- AMBIENT BACKGROUND (VIDEO FALLBACK) --- */
  body {
    margin: 0;
    padding: 0;
    background-color: #000;
    font-family: 'Outfit', sans-serif;
    color: #fff;
    height: 100vh;
    overflow: hidden;
  }

  /* --- BACKGROUND VIDEO CONTAINER --- */
  .bg-video-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }

  .bg-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4; /* Subtle visibility */
    filter: contrast(1.2) brightness(0.8);
  }

  /* CSS-Generated "Video" (Deep Moving Mesh) */
  /* This runs if the video tag is empty or fails to load */
  .bg-css-fallback {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at 50% 50%, #111, #000);
    overflow: hidden;
  }
  
  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: floatOrb 20s infinite ease-in-out alternate;
  }

  @keyframes floatOrb {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(100px, 50px) scale(1.2); }
  }

  /* --- ANIMATIONS --- */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes growIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes pulseSlow {
    0% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0.2); }
    70% { box-shadow: 0 0 0 10px rgba(204, 255, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0); }
  }

  .animate-entry { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-grow { animation: growIn 0.5s ease-out forwards; }

  .app-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 15px;
    padding: 15px;
    height: 100vh;
    position: relative;
    z-index: 1; /* Above video */
  }

  /* --- SIDEBAR --- */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    overflow: hidden;
  }

  .block {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    padding: 24px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, border-color 0.3s ease;
  }

  .block:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .logo-block { 
    height: 100px; justify-content: center; align-items: center; flex-shrink: 0; 
    background: rgba(204, 255, 0, 0.02); 
  }
  .logo-text { font-size: 32px; font-weight: 700; letter-spacing: -1px; color: #fff; }
  /* REMOVED ANIMATION FROM DOT */
  .logo-dot { color: var(--accent); display: inline-block; } 

  .upload-block { gap: 15px; flex-shrink: 0; }
  .status-text { 
    text-align: center; color: #888; font-size: 11px; margin-bottom: 5px; 
    font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 1px;
  }

  .checklist-block { flex-grow: 1; justify-content: flex-start; padding-top: 30px; }
  
  .checklist-item { 
    display: flex; align-items: center; justify-content: space-between; 
    margin-bottom: 18px; width: 100%; cursor: default;
    opacity: 0;
    animation: slideInLeft 0.5s ease forwards;
  }
  
  .checklist-label { 
    font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;
    transition: color 0.3s, transform 0.3s;
  }
  .checklist-item:hover .checklist-label { color: #fff; transform: translateX(5px); }

  .checklist-line { flex-grow: 1; border-bottom: 1px dashed rgba(255,255,255,0.1); margin: 0 12px; transform: translateY(4px); }
  
  .checklist-box { 
    width: 22px; height: 22px; 
    border: 1px solid rgba(255,255,255,0.2); 
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: rgba(0,0,0,0.3);
  }
  
  .checklist-box.checked {
    border-color: var(--accent);
    background-color: var(--accent);
    box-shadow: 0 0 15px var(--accent-glow);
    transform: scale(1.1);
  }

  /* --- BUTTONS --- */
  .btn-main {
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
    color: #ccc;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    padding: 14px 0;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }
  
  .btn-main::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: 0.5s;
  }
  .btn-main:hover::before { left: 100%; }
  .btn-main:hover { background-color: rgba(255, 255, 255, 0.1); color: #fff; border-color: rgba(255, 255, 255, 0.3); transform: translateY(-2px); }
  .btn-main:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  
  .btn-main.active { 
    background-color: var(--accent); 
    color: #000; 
    border-color: var(--accent);
    font-weight: 700; 
    box-shadow: 0 0 25px var(--accent-glow);
    animation: pulseSlow 2s infinite;
  }
  .btn-main.active:hover { transform: translateY(-2px) scale(1.02); }

  /* --- MAIN AREA --- */
  .main-area { display: flex; flex-direction: column; gap: 15px; height: 100%; overflow: hidden; }

  /* FIXED CUTOFF: Added padding to container so children can spring/hover without clipping */
  .tabs-row { 
    display: grid; 
    grid-template-columns: repeat(5, 1fr); 
    gap: 12px; 
    height: 60px; /* Increased slightly */
    flex-shrink: 0;
    padding: 5px; /* Critical fix for cutoff */
  }
  
  .tab { 
    background: var(--glass-bg); 
    backdrop-filter: blur(8px);
    border: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: center; 
    font-size: 12px; font-weight: 500; color: #666; 
    cursor: pointer; transition: all 0.3s; 
    text-transform: uppercase; letter-spacing: 1px;
    border-radius: 8px;
    height: 100%;
  }
  .tab:hover { background: rgba(255,255,255,0.08); color: #fff; transform: translateY(-3px); }
  .tab.active { 
    background: rgba(204, 255, 0, 0.1); 
    color: var(--accent); 
    border-color: var(--accent); 
    font-weight: 700;
    box-shadow: 0 0 15px rgba(204, 255, 0, 0.1);
  }

  .header-block { 
    height: 70px; flex-shrink: 0; flex-direction: row; align-items: center; justify-content: space-between; padding: 0 30px; 
    animation: slideInLeft 0.5s ease-out;
  }
  .header-title { font-size: 20px; font-weight: 600; color: #fff; letter-spacing: -0.5px; }

  /* --- SPLIT LAYOUT --- */
  .split-layout {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 15px;
    overflow: hidden;
    min-height: 0;
  }

  .analysis-block {
    overflow-y: auto;
    border-radius: 12px;
    font-size: 15px;
    scrollbar-width: thin;
    scrollbar-color: #333 transparent;
  }

  .risk-block {
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative; 
    /* Dotted background specific to this block */
    background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .chart-title {
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 13px; font-weight: 700; color: #888;
    text-transform: uppercase; letter-spacing: 2px;
    margin: 0;
  }
  
  .risk-chart-wrapper {
    width: 100%;
    height: 240px;
    display: flex;
    justify-content: center;
    margin-top: 20px; 
    animation: growIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .score-container-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    animation: fadeInUp 1s ease 0.2s backwards;
  }

  .score-value-bottom { 
    font-size: 48px; 
    font-family: 'JetBrains Mono', monospace; 
    font-weight: 700; 
    color: #fff; 
    line-height: 1; 
    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  .score-label-bottom { font-size: 11px; color: #aaa; text-transform: uppercase; margin-top: 10px; letter-spacing: 3px; }

  .status-footer {
    margin-top: auto; 
    width: 100%;
    border-top: 1px solid rgba(255,255,255,0.1); 
    padding-top: 20px; 
    display: flex; 
    justify-content: space-between; 
    font-size: 11px; 
    color: #666; 
    text-transform: uppercase;
    position: absolute;
    bottom: 30px;
    left: 0;
    padding-left: 40px;
    padding-right: 40px;
    font-family: 'JetBrains Mono', monospace;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
`;

// --- HELPER COMPONENTS ---

const BackgroundVideo = () => (
  <div className="bg-video-container">
    <div className="bg-css-fallback">
      {/* Animated Gradient Orbs - Looks like a video but lighter */}
      <div className="bg-orb" style={{ top: '20%', left: '30%', width: '400px', height: '400px', background: 'rgba(204, 255, 0, 0.05)', animationDelay: '0s' }} />
      <div className="bg-orb" style={{ top: '60%', left: '70%', width: '300px', height: '300px', background: 'rgba(255, 255, 255, 0.03)', animationDelay: '-5s' }} />
      <div className="bg-orb" style={{ top: '10%', left: '80%', width: '200px', height: '200px', background: 'rgba(204, 255, 0, 0.03)', animationDelay: '-10s' }} />
    </div>
    
    {/* Optional: Real Video Overlay if you have a file */}
    {/* <video className="bg-video" autoPlay loop muted playsInline>
      <source src="your-video-url.mp4" type="video/mp4" />
    </video> */}
  </div>
)

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    components={{
      strong: ({ node, ...props }) => <span style={{ color: '#fff', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.2)' }} {...props} />,
      h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: 0, color: '#fff', fontFamily: 'Outfit' }} {...props} />,
      h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1rem', color: '#CCFF00', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'JetBrains Mono', textShadow: '0 0 10px rgba(204,255,0,0.2)' }} {...props} />,
      ul: ({ node, ...props }) => <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem' }} {...props} />,
      li: ({ node, ...props }) => <li style={{ marginBottom: '0.8rem', lineHeight: '1.6', color: '#ddd', fontSize: '15px' }} {...props} />,
      p: ({ node, ...props }) => <p style={{ marginBottom: '1rem', lineHeight: '1.7', color: '#bbb', fontSize: '15px' }} {...props} />
    }}
  >
    {content || ""}
  </ReactMarkdown>
)

const RiskDonut = ({ score }) => {
  const data = [
    { name: 'Risk', value: score },
    { name: 'Safety', value: 100 - score },
  ];

  let riskColor = '#CCFF00'; 
  if (score > 30) riskColor = '#FFD600'; 
  if (score > 70) riskColor = '#FF3D00'; 

  const COLORS = [riskColor, 'rgba(255,255,255,0.05)'];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="risk-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={105}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              cornerRadius={5} 
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={index === 0 ? { filter: `drop-shadow(0px 0px 10px ${riskColor})` } : {}}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="score-container-bottom">
        <span className="score-value-bottom" style={{ color: riskColor, textShadow: `0 0 25px ${riskColor}60` }}>
          {score}/100
        </span>
        <span className="score-label-bottom">Risk Score</span>
      </div>
    </div>
  );
};

const VerdictBox = ({ verdict, confidence, analysis }) => {
  let accent = '#CCFF00';
  if (verdict?.includes('GUILTY') || verdict?.includes('HIGH')) accent = '#FF3D00';

  return (
    <div className="animate-entry" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        border: `1px solid ${accent}40`, 
        padding: '40px', 
        background: `linear-gradient(180deg, ${accent}10 0%, rgba(0,0,0,0) 100%)`, 
        textAlign: 'center', 
        marginBottom: '30px',
        borderRadius: '12px',
        boxShadow: `0 0 50px -10px ${accent}20`,
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ fontSize: '4rem', margin: 0, fontWeight: '700', color: '#fff', lineHeight: 1, fontFamily: 'Outfit', textShadow: `0 0 20px ${accent}40` }}>{verdict}</h2>
        <div style={{ marginTop: '15px', fontSize: '1rem', color: accent, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }}>
          Confidence: <span style={{ color: '#fff' }}>{confidence}%</span>
        </div>
      </div>
      <div style={{ lineHeight: '1.7', color: '#ccc', fontSize: '16px', flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
        <MarkdownRenderer content={analysis} />
      </div>
    </div>
  )
}

function App() {
  const [file, setFile] = useState(null)
  const [view, setView] = useState('dashboard')
  const [activeTab, setActiveTab] = useState('accountant')

  const [results, setResults] = useState({
    accountant: null, legal: null, skeptic: null, bloodhound: null, justice: null
  })

  const [loading, setLoading] = useState({
    accountant: false, legal: false, skeptic: false, bloodhound: false, justice: false
  })

  const AGENTS = [
    { id: 'accountant', name: 'accountant', title: 'The Forensic Accountant' },
    { id: 'legal', name: 'legal advisor', title: 'The Legal Hunter' },
    { id: 'skeptic', name: 'skeptic', title: 'The Competitive Skeptic' },
    { id: 'bloodhound', name: 'bloodhound', title: 'The Bloodhound' },
    { id: 'justice', name: 'chief justice', title: 'The Chief Justice' }
  ]

  const runFullInvestigation = async () => {
    if (!file) return alert("Please upload a file first.")
    if (view !== 'dashboard') setView('dashboard')

    setResults({ accountant: null, legal: null, skeptic: null, bloodhound: null, justice: null })
    const primaryAgents = ['accountant', 'legal', 'skeptic', 'bloodhound']
    let currentResults = {}

    for (const agentId of primaryAgents) {
      setActiveTab(agentId)
      setLoading(prev => ({ ...prev, [agentId]: true }))

      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch(`http://127.0.0.1:8000/analyze/${agentId}`, { method: 'POST', body: formData })
        const data = await res.json()

        let payload = data
        if (typeof data.analysis === 'string') payload = { analysis: data.analysis, risk_score: data.risk_score || 0 }
        else if (typeof data === 'string') payload = { analysis: data, risk_score: 0 }

        setResults(prev => ({ ...prev, [agentId]: payload }))
        currentResults[agentId] = payload

      } catch (err) {
        currentResults[agentId] = { analysis: "Analysis Failed.", risk_score: 0 }
      }
      setLoading(prev => ({ ...prev, [agentId]: false }))
      await new Promise(r => setTimeout(r, 1000));
    }

    setActiveTab('justice')
    setLoading(prev => ({ ...prev, justice: true }))

    try {
      const safePayload = {
        accountant_analysis: currentResults.accountant?.analysis || "No Data",
        legal_analysis: currentResults.legal?.analysis || "No Data",
        skeptic_analysis: currentResults.skeptic?.analysis || "No Data",
        bloodhound_analysis: currentResults.bloodhound?.analysis || "No Data"
      }

      const res = await fetch(`http://127.0.0.1:8000/analyze/justice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safePayload)
      })
      const data = await res.json()

      let justicePayload = data
      if (typeof data === 'string') {
        try { justicePayload = JSON.parse(data) }
        catch (e) { justicePayload = { verdict: "ERROR", confidence_score: 0, analysis: data } }
      }
      setResults(prev => ({ ...prev, justice: justicePayload }))

    } catch (err) {
      setResults(prev => ({ ...prev, justice: { verdict: "ERROR", confidence_score: 0, analysis: "Connection Failed." } }))
    }
    setLoading(prev => ({ ...prev, justice: false }))
  }

  const handleRunAgent = async (agentId) => {
    if (!file && agentId !== 'justice') return alert("Please upload a file first.")

    setLoading(prev => ({ ...prev, [agentId]: true }))
    try {
      let endpoint = `/analyze/${agentId}`
      let body
      let headers = {}

      if (agentId === 'justice') {
        headers = { 'Content-Type': 'application/json' }
        body = JSON.stringify({
          accountant_analysis: results.accountant?.analysis || "No Data",
          legal_analysis: results.legal?.analysis || "No Data",
          skeptic_analysis: results.skeptic?.analysis || "No Data",
          bloodhound_analysis: results.bloodhound?.analysis || "No Data"
        })
      } else {
        const formData = new FormData()
        formData.append('file', file)
        body = formData
      }

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, { method: 'POST', body: body, headers: headers })
      const data = await res.json()

      let payload = data
      if (typeof data.analysis === 'string' && agentId !== 'justice') payload = { analysis: data.analysis, risk_score: data.risk_score || 0 }
      else if (typeof data === 'string') payload = { analysis: data, risk_score: 0 }

      setResults(prev => ({ ...prev, [agentId]: payload }))

    } catch (err) { alert(err.message) }
    setLoading(prev => ({ ...prev, [agentId]: false }))
  }

  return (
    <>
      <style>{styles}</style>
      <BackgroundVideo />
      
      <div className="app-container">
        <aside className="sidebar">
          <div className="block logo-block animate-entry">
            <span className="logo-text">Veritas<span className="logo-dot">AI</span></span>
          </div>
          
          <div className="block upload-block animate-entry" style={{ animationDelay: '0.1s' }}>
            <div className="status-text">{file ? file.name : "NO FILES UPLOADED"}</div>
            <label className="btn-main">
              upload
              <input type="file" accept=".pdf" hidden onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <button
              className={`btn-main ${file ? 'active' : ''}`}
              style={{ marginTop: '10px' }}
              onClick={runFullInvestigation}
              disabled={!file || Object.values(loading).some(l => l)}
            >
              {Object.values(loading).some(l => l) ? 'scanning...' : 'deep scan'}
            </button>
          </div>

          <div className="block checklist-block">
            {AGENTS.map((agent, index) => (
              <div key={agent.id} className="checklist-item" style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}>
                <span className="checklist-label">{agent.name}</span>
                <span className="checklist-line"></span>
                <div className={`checklist-box ${results[agent.id] ? 'checked' : ''}`}>
                  {results[agent.id] ? <Check size={16} color="#000" strokeWidth={3} /> : null}
                </div>
              </div>
            ))}
          </div>

          <button className="btn-main animate-entry" style={{ animationDelay: '0.8s' }} onClick={() => setView('dashboard')}>settings</button>
          <button className={`btn-main animate-entry ${view === 'about' ? 'active' : ''}`} style={{ animationDelay: '0.9s' }} onClick={() => setView('about')}>about us</button>
        </aside>

        <main className="main-area">
          {view === 'dashboard' ? (
            <>
              <div className="tabs-row animate-entry" style={{ animationDelay: '0.1s' }}>
                {AGENTS.map(agent => (
                  <div key={agent.id} className={`tab ${activeTab === agent.id ? 'active' : ''}`} onClick={() => setActiveTab(agent.id)}>
                    {agent.name}
                  </div>
                ))}
              </div>
              <div className="block header-block">
                <span className="header-title">{AGENTS.find(a => a.id === activeTab).title}</span>
                <button className="btn-main" style={{ width: '150px' }} onClick={() => handleRunAgent(activeTab)} disabled={loading[activeTab]}>
                  {loading[activeTab] ? '...' : 're-analyze'}
                </button>
              </div>

              {results[activeTab] ? (
                activeTab === 'justice' ? (
                  <div className="block animate-entry" style={{ flexGrow: 1, padding: '40px' }}>
                    <VerdictBox verdict={results.justice?.verdict || "ERROR"} confidence={results.justice?.confidence_score || 0} analysis={results.justice?.analysis || "No analysis available."} />
                  </div>
                ) : (
                  <div className="split-layout">
                    {/* Unique keys force animation re-trigger on tab switch */}
                    <div className="block analysis-block animate-entry" key={`text-${activeTab}`}>
                      <MarkdownRenderer content={results[activeTab].analysis} />
                    </div>
                    <div className="block risk-block animate-entry" key={`risk-${activeTab}`} style={{ animationDelay: '0.1s' }}>
                      <div className="chart-title">Risk Analysis</div>
                      <RiskDonut score={results[activeTab].risk_score || 0} />
                      <div className="status-footer">
                        <span>Status</span>
                        <span style={{ color: '#fff' }}>Complete</span>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="block animate-entry" style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: '#555', fontSize: '18px', fontWeight: '500', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Awaiting Analysis Generation...
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="tabs-row"><div className="tab active" style={{ cursor: 'default' }}>About Us</div></div>
              <div className="block header-block"><span className="header-title">About Us</span></div>
              <div className="block animate-entry" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: '#888' }}>chukandar</h1>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

export default App