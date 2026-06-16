import React, { useState } from "react";
import { 
  Sparkles, 
  Youtube, 
  Layers, 
  Copy, 
  Check, 
  RotateCcw, 
  FileText, 
  Flame, 
  HelpCircle, 
  Music, 
  Compass, 
  TrendingUp, 
  Palette, 
  Terminal, 
  User, 
  ExternalLink,
  ChevronRight,
  Zap,
  Tag,
  History,
  Plus,
  Trash2,
  Clock,
  X
} from "lucide-react";
import { GeneratorInput, GeneratorOutput, SavedRelease } from "./types";
import HeadphoneHeartLogo from "./components/HeadphoneHeartLogo";

// PRESETS to make testing are immediate and interactive
const PRESETS = [
  {
    id: "hindi-contemporary-soul",
    name: "Hindi Contemporary Soul (Example)",
    songName: "Tum Mere Paas",
    musicStyle: "Hindi Contemporary Soul, Semi-Classical Emotional, Female Alto Vocal, Passionate and Turbulent, 72 BPM, Sarangi and Piano Intro, Atmospheric Synth Pads, Tabla Rhythm, Powerful Soaring Chorus, Vulnerable and Breathy Verses, Cinematic Production",
    lyrics: "Doorie sahi jaaye na ab tere baaton ki, beetey na ab raina ye yaadon ki."
  },
  {
    id: "hindi-rap",
    name: "Hindi Rap Anthem (Gritty)",
    songName: "Zindagi Na Milegi Dobara",
    musicStyle: "Hindi Underground Hip-Hop, Gritty and Raw, Aggressive 92 BPM, Vocal chants, Sirens, Vinyl noise scratch, Heavy street drum, Cyberpunk electronic overlay",
    lyrics: "Kalam uthaya toh panno pe aag likhi. Shehar ki sadko ne meri ye dastaan likhi. 2026 hai par darr wahi purana hai."
  },
  {
    id: "lofi-trap",
    name: "Lo-Fi Cyberpunk Vibe (Chill)",
    songName: "Virtual Raindrops",
    musicStyle: "Chill Trap, Lo-Fi Cyberpunk, Atmospheric and Nostalgic, Synthesizer lead, Soft rain sound overlay, 80 BPM, Warm tape Saturation, Moody, Distant vocals",
    lyrics: "Midnight streams running down the holographic display. We are just signals fading in the static noise."
  }
];

export default function App() {
  const [songName, setSongName] = useState("");
  const [musicStyle, setMusicStyle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([
    { platform: "Spotify", url: "" },
    { platform: "Apple Music", url: "" },
    { platform: "Instagram", url: "" },
    { platform: "YouTube", url: "" }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Terminal stimulation output lines for immersive loading
  const [loadingStep, setLoadingStep] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState("");

  // History & Sidebar specific states
  const [history, setHistory] = useState<SavedRelease[]>(() => {
    try {
      const saved = localStorage.getItem("maytera_soul_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Local history initialization error:", e);
      return [];
    }
  });
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [historySearchTerm, setHistorySearchTerm] = useState<string>("");

  // Create clean brand-new project (reset inputs and active selection state)
  const createNewProject = () => {
    setSongName("");
    setMusicStyle("");
    setLyrics("");
    setLinks([
      { platform: "Spotify", url: "" },
      { platform: "Apple Music", url: "" },
      { platform: "Instagram", url: "" },
      { platform: "YouTube", url: "" }
    ]);
    setResult(null);
    setError(null);
    setSelectedHistoryId("");
    setIsFallback(false);
    setFallbackReason("");
  };

  // Load an existing history record
  const loadHistoryItem = (item: SavedRelease) => {
    setSelectedHistoryId(item.id);
    setSongName(item.songName);
    setMusicStyle(item.musicStyle || "");
    setLyrics(item.lyrics || "");
    if (item.links && item.links.length > 0) {
      setLinks(item.links);
    } else {
      setLinks([
        { platform: "Spotify", url: "" },
        { platform: "Apple Music", url: "" },
        { platform: "Instagram", url: "" },
        { platform: "YouTube", url: "" }
      ]);
    }
    setResult(item.result);
    setIsMock(item.isMock || false);
    setIsFallback(item.isFallback || false);
    setFallbackReason(item.fallbackReason || "");
    setError(null);
  };

  // Delete individual history record
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("maytera_soul_history", JSON.stringify(updated));
    if (selectedHistoryId === id) {
      setSelectedHistoryId("");
      setResult(null);
    }
  };

  // Clear entire history list
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to completely erase your Maytera Soul release history?")) {
      setHistory([]);
      localStorage.removeItem("maytera_soul_history");
      setSelectedHistoryId("");
      setResult(null);
    }
  };

  // Quick preset loader function
  const loadPreset = (preset: typeof PRESETS[0]) => {
    setSongName(preset.songName);
    setMusicStyle(preset.musicStyle);
    setLyrics(preset.lyrics);
    setLinks([
      { platform: "Spotify", url: "" },
      { platform: "Apple Music", url: "" },
      { platform: "Instagram", url: "" },
      { platform: "YouTube", url: "" }
    ]);
    // Focus or auto clear previous result optionally
    setError(null);
  };

  // Immersive interactive simulation of AI pipeline loading state
  const triggerLoadingSequence = () => {
    setLoadingStep(0);
    const intervals = [500, 1100, 1800, 2400];
    intervals.forEach((time, index) => {
      setTimeout(() => {
        setLoadingStep(index + 1);
      }, time);
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songName.trim()) {
      setError("Please fill in the Song Name/Temporary Title");
      return;
    }

    if (!musicStyle.trim()) {
      setError("Please enter the Music Style & Vibe of your release");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    triggerLoadingSequence();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songName,
          musicStyle,
          lyrics,
          links: links.filter(l => l.url.trim() !== ""),
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP error! Status value: " + response.status);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.result);
      setIsMock(data.isMock || false);
      setIsFallback(data.fallback || false);
      setFallbackReason(data.fallbackReason || "");

      const newSavedId = Date.now().toString();
      const newSaved: SavedRelease = {
        id: newSavedId,
        songName,
        musicStyle,
        lyrics,
        links: links.filter(l => l.url.trim() !== ""),
        result: data.result,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " " + new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
        isMock: data.isMock || false,
        isFallback: data.fallback || false,
        fallbackReason: data.fallbackReason || ""
      };

      setHistory(prev => {
        const next = [newSaved, ...prev];
        localStorage.setItem("maytera_soul_history", JSON.stringify(next));
        return next;
      });
      setSelectedHistoryId(newSavedId);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to reach generator node. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Sleek helper to copy text to user clipboard gracefully
  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(identifier);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  const resetForm = () => {
    setSongName("");
    setMusicStyle("");
    setLyrics("");
    setLinks([
      { platform: "Spotify", url: "" },
      { platform: "Apple Music", url: "" },
      { platform: "Instagram", url: "" },
      { platform: "YouTube", url: "" }
    ]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#05070C] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
      
      {/* 1. FUTURISTIC TOP FLOATING NAV/STATUS HEADER */}
      <header className="border-b border-slate-900 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#F355DA] p-[1.5px] transition-transform duration-300 hover:scale-105 active:scale-95">
              <div className="w-full h-full bg-[#05070C] rounded-[11px] flex items-center justify-center overflow-hidden">
                <HeadphoneHeartLogo size={42} className="transform hover:scale-110 transition-transform duration-300" />
              </div>
              {/* Outer Neon Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#F355DA] rounded-xl blur-md opacity-50 -z-10 group-hover:opacity-85 transition-opacity duration-300"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] to-[#F355DA] text-lg sm:text-2xl font-black">
                  MAYTERA SOUL
                </span>
                <span className="font-sans font-semibold text-cyan-400 text-[10px] px-1.5 py-0.5 rounded-md bg-[#0F172A] border border-cyan-500/25 tracking-widest uppercase animate-pulse">
                  SEO AI
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-mono tracking-widest uppercase">
                YOUTUBE MUSIC ALCHEMIST v2.5
              </p>
            </div>
          </div>

          {/* Header Action Buttons and Stats */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 bg-[#05070C] px-3 py-1.5 rounded-full border border-slate-900/60 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse"></span>
              <span>MODEL: GEMINI 3.5 FLASH</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={createNewProject}
                className="bg-[#05070C] border border-slate-850 hover:border-cyan-500/40 hover:bg-slate-900 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-400 font-bold transition-all flex items-center gap-1.5 select-none active:scale-[0.97]"
                title="Start a blank project release"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Project</span>
              </button>

              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 select-none active:scale-[0.97] border ${
                  isSidebarOpen 
                    ? "bg-[#0F172A] text-[#00F2FE] border-[#00F2FE]/40 shadow-[0_0_8px_rgba(0,242,254,0.15)]" 
                    : "bg-[#05070C] text-slate-400 border-slate-850 hover:text-slate-200 hover:border-slate-700"
                }`}
                title="Toggle generation history sidebar"
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
                {history.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-sans ${isSidebarOpen ? "bg-cyan-950/55 text-[#00F2FE]" : "bg-slate-900 text-slate-500"}`}>
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Dynamic Warning Notification if AI key is missing or quota is exceeded */}
        {isFallback && !isGenerating && (
          <div className="p-4 rounded-xl border border-dashed border-rose-500/30 bg-rose-950/10 text-rose-300 text-sm flex gap-3 items-start animate-fadeIn">
            <Terminal className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-bold font-display text-rose-400 uppercase tracking-wide text-xs flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                Gemini Cloud Quota Exceeded (Deep Fallback Active)
              </p>
              <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                Your GenAI request ran into peak resource limitations or exceeded your Gemini daily quota restrictions (429 Rate Limit Exceeded). Maytera Soul's <strong className="text-[#00F2FE]">High-Fidelity Offline Alchemist Synthesis</strong> stepped in instantly to craft detailed metadata assets and prompts locally!
              </p>
              {fallbackReason && (
                <div className="mt-2 text-[11px] font-mono bg-[#05070C]/90 p-2 rounded-lg border border-rose-950/40 text-rose-400 overflow-x-auto whitespace-pre-wrap select-text leading-normal">
                  <span className="text-slate-500">// Diagnostic Feed:</span> {fallbackReason}
                </div>
              )}
              <p className="text-[10px] text-slate-500 mt-1.5 italic">
                Pro Tip: Design and export your media files safely; our offline engine guarantees zero-latency, continuous uptime.
              </p>
            </div>
          </div>
        )}

        {isMock && !isFallback && !isGenerating && (
          <div className="p-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-950/10 text-amber-300 text-sm flex gap-3 items-start animate-fadeIn">
            <Terminal className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold font-display text-amber-400 uppercase tracking-wide text-xs">Offline Simulator Mode Active</p>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                Developer Warning: No <code className="bg-slate-950/80 p-0.5 rounded px-1 text-pink-400 font-mono">GEMINI_API_KEY</code> has been discovered in the platform environment secrets dashboard. The application is intelligently crafting optimized, high-fidelity metadata assets on the fly. Configure the key inside your secure settings to enable genuine AI generations!
              </p>
            </div>
          </div>
        )}

        {/* 2. PROMOTIONAL INSIGHT HERO CARD (Sleek introduction) */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-900 bg-gradient-to-b from-[#0B0F19] to-[#060910] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#F355DA]/10 border border-[#F355DA]/20 px-3 py-1 rounded-full text-xs text-[#F355DA] font-mono tracking-wide">
              <Zap className="w-3.5 h-3.5" /> THE METADATA GAMECHANGER OVERVIEW
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Command YouTube with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#F355DA]">Dynamic AI Energy</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Craft clickable titles, descriptive deep narrative backstories, automated timestamp landmarks, optimized hashtags, and world-class AI Art prompt instructions for your music videos in seconds.
            </p>
          </div>

          {/* Quick preset selector tool */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 flex-shrink-0 w-full lg:w-96">
            <p className="text-xs font-mono text-[#00F2FE] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Quick Demo Presets:
            </p>
            <div className="flex flex-col gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-[#0B0F19] hover:border-slate-700 transition-all text-xs flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="font-medium text-slate-200 group-hover:text-white truncate block">
                      {preset.name}
                    </span>
                    <span className="text-slate-500 block truncate text-[10px]">
                      Title: "{preset.songName}" • {preset.musicStyle.split(",")[0]}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#00F2FE] flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. CORE MULTI-COLUMN CONVERSION DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* HISTORY SIDEBAR */}
          {isSidebarOpen && (
            <aside id="history-sidebar" className="lg:col-span-3 bg-[#0B0F19] rounded-xl border border-slate-900 p-4 shadow-xl space-y-4 self-start animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <h3 className="font-display font-bold text-xs tracking-widest text-[#00F2FE] uppercase flex items-center gap-1.5 font-mono">
                  <History className="w-3.5 h-3.5 text-[#00F2FE]" />
                  RELEASE HISTORY
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-[9px] font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-900/40 transition-colors cursor-pointer"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* SEARCH INPUT */}
              {history.length > 0 ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={historySearchTerm}
                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                    className="w-full bg-[#05070C] text-slate-300 placeholder:text-slate-600 px-3 py-1.5 rounded-lg border border-slate-805 text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  {historySearchTerm && (
                    <button
                      onClick={() => setHistorySearchTerm("")}
                      className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : null}

              {/* HISTORY LIST */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 select-none custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-center py-6 px-1 space-y-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#05070C] border border-slate-900 flex items-center justify-center mx-auto">
                      <History className="w-4 h-4 text-slate-600" />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal font-sans">
                      No matching generations found. Launch your first project using the form!
                    </p>
                  </div>
                ) : (
                  (() => {
                    const filtered = history.filter(item =>
                      item.songName.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
                      (item.musicStyle && item.musicStyle.toLowerCase().includes(historySearchTerm.toLowerCase()))
                    );
                    
                    if (filtered.length === 0) {
                      return (
                        <p className="text-center text-[10px] text-slate-600 py-3 font-mono">// No records found</p>
                      );
                    }

                    return filtered.map((item) => {
                      const isSelected = selectedHistoryId === item.id;
                      const primaryLabel = item.musicStyle ? item.musicStyle.split(",")[0].trim() : "Style description";
                      const secondaryLabel = item.musicStyle && item.musicStyle.split(",")[1] ? item.musicStyle.split(",")[1].trim() : null;
                      return (
                        <div
                          key={item.id}
                          onClick={() => loadHistoryItem(item)}
                          className={`group w-full text-left p-2.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-start gap-2 relative ${
                            isSelected
                              ? "bg-[#0F172A] border-[#00F2FE]/40 text-slate-100 shadow-[0_0_8px_rgba(0,242,254,0.15)]"
                              : "bg-[#05070C]/80 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800 hover:bg-[#070B14]"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-xs text-slate-200 block truncate group-hover:text-white mb-0.5">
                              {item.songName}
                            </span>
                            <div className="flex flex-wrap gap-1 mb-1 items-center">
                              <span className="text-[9px] font-mono font-medium px-1 bg-slate-900 rounded border border-slate-850 truncate max-w-[125px] text-slate-400" title={item.musicStyle}>
                                {primaryLabel}
                              </span>
                              {secondaryLabel && (
                                <span className="text-[9px] font-mono text-cyan-400 px-1 bg-cyan-950/20 rounded border border-cyan-900/10 shrink-0">
                                  {secondaryLabel}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 block">
                              <Clock className="w-2.5 h-2.5 text-slate-600" />
                              {item.timestamp}
                            </span>
                          </div>

                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition-colors self-center shrink-0 cursor-pointer"
                            title="Delete this record"
                            id={`delete-${item.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    });
                  })()
                )}
              </div>

              {/* NEW PROJECT SHORTCUT */}
              <button
                onClick={createNewProject}
                className="w-full py-2 bg-gradient-to-r from-cyan-500/10 to-pink-500/5 hover:from-cyan-500/15 hover:to-pink-500/10 border border-cyan-500/20 rounded-lg text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] hover:text-cyan-300 transition-all uppercase flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW PROJECT</span>
              </button>
            </aside>
          )}
          
          {/* COLUMN 1: INTERACTIVE CONTROL INTERFACE FORM */}
          <section id="form-container" className={`lg:col-span-${isSidebarOpen ? "4" : "5"} bg-[#0B0F19] rounded-2xl border border-slate-900/80 p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm self-start`}>
            
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#F355DA]" />
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2 text-sm sm:text-base">
                <Layers className="w-4.5 h-4.5 text-[#00F2FE]" />
                STEP 1: METADATA DETAILS
              </h2>
              <button 
                onClick={resetForm}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900/50 transition-colors text-xs flex items-center gap-1 font-mono"
                title="Reset Form"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                CLEAR
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              
              {/* FIELD 1: Song name / temporary title */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-mono tracking-wider uppercase block">
                  Song Name / Temporary Title <span className="text-[#00F2FE] font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Music className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken Glass Beats"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    className="w-full bg-[#05070C] text-slate-100 placeholder:text-slate-600 pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] transition-all font-sans text-sm focus:outline-none"
                    id="input-song-name"
                  />
                </div>
              </div>

              {/* FIELD 2: Unified Music Style & Vibe Description Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-mono tracking-wider uppercase block">
                    Music Vibe / Style Description <span className="text-[#00F2FE] font-bold">*</span>
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono">Detailed Prompt Input</span>
                </div>
                <div className="relative">
                  <span className="absolute top-3.5 left-3.5 pointer-events-none text-slate-500">
                    <Sparkles className="w-4 h-4 text-[#00F2FE]" />
                  </span>
                  <textarea
                    rows={5}
                    required
                    placeholder="e.g., Hindi Contemporary Soul, Semi-Classical Emotional, Female Alto Vocal, Passionate and Turbulent, 72 BPM, Sarangi and Piano Intro, Atmospheric Synth Pads, Tabla Rhythm, Powerful Soaring Chorus, Vulnerable and Breathy Verses, Cinematic Production"
                    value={musicStyle}
                    onChange={(e) => setMusicStyle(e.target.value)}
                    className="w-full bg-[#05070C] text-slate-100 placeholder:text-slate-600 pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] transition-all font-sans text-xs focus:outline-none resize-none leading-relaxed"
                    id="input-music-style"
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Provide descriptive attributes like language, sub-genres, instruments, vocal types, tempo (BPM), and custom arrangement highlights.
                </p>
              </div>

              {/* FIELD 4: Lyrics Snippet or Song Story context */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-mono tracking-wider uppercase block">
                    Lyrics Snippet / Song Story <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Max 400 chars</span>
                </div>
                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={400}
                    placeholder="Paste a stanza of lyrics or describe what this song represents, to help the AI craft extremely contextual story hooks..."
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    className="w-full bg-[#05070C] text-slate-300 placeholder:text-slate-700 p-3.5 rounded-xl border border-slate-800 focus:border-[#F355DA] focus:ring-1 focus:ring-[#F355DA] transition-all font-sans text-xs focus:outline-none resize-none leading-relaxed"
                    id="input-lyrics"
                  />
                  {lyrics && (
                    <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono">
                      {lyrics.length}/400
                    </div>
                  )}
                </div>
              </div>

              {/* FIELD 5: Optional Streaming & Social Links */}
              <div className="space-y-3 bg-[#070B14] p-4 rounded-xl border border-slate-900 border-dashed">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-slate-300 font-mono tracking-wider uppercase block font-bold">
                    Streaming & Social Links <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono">Real-time Hook</span>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Only the platforms you fill below will be dynamically compiled in your social description box.
                </p>

                <div className="space-y-2 pt-1">
                  {links.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-20 text-[10px] font-mono text-slate-400 select-none truncate shrink-0">
                        {link.platform}
                      </span>
                      <input
                        type="url"
                        placeholder={`e.g. https://${link.platform.toLowerCase().replace(/ /g, "")}.com/...`}
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...links];
                          updated[idx].url = e.target.value;
                          setLinks(updated);
                        }}
                        className="flex-1 bg-[#05070C] text-slate-200 placeholder:text-slate-850 px-3 py-1.5 rounded-lg border border-slate-850 focus:border-[#00F2FE]/60 focus:outline-none text-[11px] transition-all"
                      />
                      {idx >= 4 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = links.filter((_, i) => i !== idx);
                            setLinks(updated);
                          }}
                          className="bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 p-1 rounded transition-all shrink-0 cursor-pointer"
                          title="Remove custom platform"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const platform = window.prompt("Enter Platform Name (e.g. SoundCloud, TikTok, Facebook):");
                    if (platform && platform.trim()) {
                      setLinks([...links, { platform: platform.trim(), url: "" }]);
                    }
                  }}
                  className="mt-1 text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  + ADD CUSTOM PLATFORM
                </button>
              </div>

              {/* ACTION: GENERATE BUTTON */}
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full py-3.5 px-4 rounded-xl font-display font-extrabold uppercase tracking-widest text-[#05070C] text-xs transition-all relative overflow-hidden group ${
                  isGenerating 
                    ? "bg-slate-800 text-slate-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#F355DA] hover:opacity-95 shadow-lg active:scale-[0.99] cursor-pointer"
                }`}
                id="btn-generate"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin"></span>
                    Synthesizing Meta Matrix...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Flame className="w-4.5 h-4.5" />
                    GENERATE MAGIC SEO
                  </span>
                )}
              </button>

            </form>

            {/* Error view */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-950/20 border border-rose-900/60 text-xs text-rose-300 font-sans flex items-start gap-2 animate-fadeIn" id="error-alert">
                <span className="bg-rose-500 text-[#05070C] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                <p className="flex-1">{error}</p>
              </div>
            )}

            {/* Simulated Immersive AI Log Output when loading */}
            {isGenerating && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-slate-900 font-mono text-[11px] text-slate-400 space-y-1.5 overflow-hidden animate-pulse">
                <p className="text-[#00F2FE] flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-ping"></span>
                  CONNECTING TO MAYTERA CORE...
                </p>
                <div className="space-y-1 text-slate-500">
                  <p className={loadingStep >= 1 ? "text-cyan-400" : ""}>
                    [OK] Initializing Music Vibe Vectors ... {loadingStep >= 1 ? "STABLE" : "PENDING"}
                  </p>
                  <p className={loadingStep >= 2 ? "text-cyan-400" : ""}>
                    [OK] Generating clickbait/SEO Titles ... {loadingStep >= 2 ? "COMPLETED" : "PENDING"}
                  </p>
                  <p className={loadingStep >= 3 ? "text-purple-400" : ""}>
                    [OK] Compiling streaming & social links ... {loadingStep >= 3 ? "COMPLETED" : "PENDING"}
                  </p>
                  <p className={loadingStep >= 4 ? "text-[#F355DA]" : ""}>
                    [OK] Formatting Midjourney visual prompt ... {loadingStep >= 4 ? "COMPLETED" : "PENDING"}
                  </p>
                </div>
              </div>
            )}

          </section>

          {/* COLUMN 2: SPLIT SCREEN STEP 2 & 3 GENERATOR OUTPUT */}
          <section className={`lg:col-span-${isSidebarOpen ? "5" : "7"} space-y-8 flex-1`}>
            
            {result ? (
              <div className="space-y-8 animate-fadeIn" id="results-wrapper">

                {/* HEADER SECTION: Success status banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">Generation Successful</p>
                      <p className="text-xs text-slate-400">Your content matrices have been fully aligned for high CTR action.</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetForm}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-lg text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset & Plan New Release
                  </button>
                </div>

                {/* A. YOUTUBE TITLES CONFIGURATOR CARD */}
                <div className="bg-[#0B0F19] rounded-2xl border border-slate-900 p-5 sm:p-6 space-y-5" id="output-segment-titles">
                  
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-display font-black text-xs sm:text-sm tracking-widest text-[#00F2FE] flex items-center gap-2 uppercase">
                      <Youtube className="w-5 h-5 text-[#00F2FE]" />
                      A. YouTube CTR Titles (3 Variations)
                    </h3>
                    <span className="text-[10px] font-mono bg-slate-900 px-2 py-1 rounded text-slate-500 border border-slate-800">
                      COPY THE HIGHEST CONVERSION
                    </span>
                  </div>

                  {/* Option 1: Clickbait / High CTR */}
                  <div className="space-y-1.5 bg-slate-950/80 p-4 rounded-xl border border-slate-900 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-2.5 py-0.5 rounded-full border border-cyan-900/40">
                        VARIATION 1: CLICKBAIT / HIGH CTR
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.titles.clickbait, "title1")}
                        className="text-slate-400 hover:text-white hover:bg-slate-900 p-1.5 rounded transition-all flex items-center gap-1 text-[11px] font-mono"
                      >
                        {copiedSection === "title1" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-sans font-semibold text-slate-100 select-all pr-12 pt-1 pt-2 leading-relaxed">
                      {result.titles.clickbait}
                    </p>
                  </div>

                  {/* Option 2: SEO Optimized */}
                  <div className="space-y-1.5 bg-slate-950/80 p-4 rounded-xl border border-slate-900 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-950/30 px-2.5 py-0.5 rounded-full border border-purple-900/40">
                        VARIATION 2: SEO & SEARCH KEYWORDS
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.titles.seo, "title2")}
                        className="text-slate-400 hover:text-white hover:bg-slate-900 p-1.5 rounded transition-all flex items-center gap-1 text-[11px] font-mono"
                      >
                        {copiedSection === "title2" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-sans font-semibold text-slate-100 select-all pr-12 pt-2 leading-relaxed">
                      {result.titles.seo}
                    </p>
                  </div>

                  {/* Option 3: Aesthetic/Minimalist */}
                  <div className="space-y-1.5 bg-slate-950/80 p-4 rounded-xl border border-slate-900 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#F355DA] bg-rose-950/30 px-2.5 py-0.5 rounded-full border border-rose-900/40">
                        VARIATION 3: AESTHETIC / DESCRIPTIVE MINIMAL
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.titles.aesthetic, "title3")}
                        className="text-slate-400 hover:text-white hover:bg-slate-900 p-1.5 rounded transition-all flex items-center gap-1 text-[11px] font-mono"
                      >
                        {copiedSection === "title3" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-sans font-semibold text-slate-200 select-all pr-12 pt-1.5 tracking-wider">
                      {result.titles.aesthetic}
                    </p>
                  </div>

                  {/* Live Card Mockup Visual Representation */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                    <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00F2FE]" />
                      LIVE FEED PREVIEW SIMULATOR
                    </p>
                    <div className="bg-[#0D1322] rounded-lg overflow-hidden border border-slate-800 max-w-sm mx-auto">
                      {/* Fake Thumbnail Video Banner space */}
                      <div className="aspect-video bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                        
                        {/* Neon accent grid styling inside simulator */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                          backgroundImage: `linear-gradient(rgba(0, 242, 254, 0.25) 1px, transparent 1px), linear-gradient(95deg, rgba(0, 242, 254, 0.15) 1px, transparent 1px)`,
                          backgroundSize: '15px 15px'
                        }}></div>
                        
                        {/* Fake Red Laser bar */}
                        <div className="absolute top-2 left-2 bg-[#F355DA] text-[9px] font-mono px-1.5 rounded uppercase tracking-wider font-extrabold shadow-sm">
                          {(musicStyle ? musicStyle.split(",")[0] : "SOUL").toUpperCase()}
                        </div>
                        
                        <div className="p-3 bg-slate-950/85 backdrop-blur-sm rounded-lg border border-slate-800 max-w-[90%] pointer-events-none">
                          <p className="text-[11px] font-mono text-[#00F2FE] uppercase tracking-widest truncate">{songName || "Untitled Song"}</p>
                          <p className="text-[9px] text-[#F355DA] font-sans italic truncate mt-0.5">Style: {musicStyle || "Contemporary Soul"}</p>
                        </div>
                        
                        {/* Video length tag */}
                        <div className="absolute bottom-2 right-2 bg-black/90 text-[10px] font-mono px-1.5 py-0.5 rounded text-white tracking-widest">
                          03:14
                        </div>
                      </div>
                      
                      {/* Fake Info details */}
                      <div className="p-3 bg-slate-950/90 text-left space-y-2">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#F355DA] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-100 truncate">
                              {result.titles.clickbait}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">Maytera Records • 47K views • 2 hours ago</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* B. THE SMART DESCRIPTION BOX */}
                <div className="bg-[#0B0F19] rounded-2xl border border-slate-900 p-5 sm:p-6 space-y-5" id="output-segment-description">
                  
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-display font-black text-xs sm:text-sm tracking-widest text-[#4FACFE] flex items-center gap-2 uppercase">
                      <FileText className="w-5 h-5 text-[#4FACFE]" />
                      B. The Smart Description Box
                    </h3>
                    
                    <button
                      onClick={() => {
                        const activeLinks = links.filter(l => l.url.trim() !== "");
                        const linksBlock = activeLinks.length > 0
                          ? `\n\n🎧 STREAMING & SOCIALS:\n${activeLinks.map(l => `🔗 ${l.platform}: ${l.url}`).join("\n")}`
                          : "";
                        const fullDesc = `${result.description.narrative}${linksBlock}\n\n${result.description.hashtags.join(" ")}`;
                        copyToClipboard(fullDesc, "description");
                      }}
                      className="text-slate-400 hover:text-white hover:bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-1 text-[11px] font-mono"
                    >
                      {copiedSection === "description" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Entire Box!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Description Block</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4 bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 leading-relaxed select-all">
                    
                    {/* Narrative story hook */}
                    <div className="space-y-1">
                      <span className="text-[#4FACFE] font-bold block text-[10px] tracking-wider uppercase">// AI-WRITTEN ATMOSPHERIC NARRATIVE HOOK</span>
                      <p className="text-slate-200 bg-slate-900/60 p-3 rounded-lg font-sans border border-slate-900">
                        {result.description.narrative}
                      </p>
                    </div>

                    {/* Dynamic streaming and social links based on entered URLs */}
                    <div className="space-y-1">
                      <span className="text-slate-500 font-bold block text-[10px] tracking-wider uppercase">// STREAMING & SOCIAL LINKS</span>
                      {links.filter(l => l.url.trim() !== "").length > 0 ? (
                        <div className="text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-900 text-xs font-mono space-y-1">
                          {links.filter(l => l.url.trim() !== "").map((l, index) => (
                            <p key={index} className="flex items-center gap-1.5">
                              <span className="text-cyan-400">🔗</span>
                              <span className="font-semibold text-slate-300">{l.platform}:</span>
                              <span className="text-cyan-300 font-sans break-all select-all">{l.url}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-600 italic px-1 font-sans">
                          No links provided in Step 1. They will be excluded from the generated description block.
                        </p>
                      )}
                    </div>

                    {/* Automated Trending Hashtags based on theme genre */}
                    <div className="space-y-1">
                      <span className="text-purple-400 font-bold block text-[10px] tracking-wider uppercase">// 5 TRENDING GENRE & MOOD HASHTAGS</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {result.description.hashtags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-purple-300 font-mono text-[11px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* C. AI THUMBNAIL PROMPT GENERATOR */}
                <div className="bg-[#0B0F19] rounded-2xl border border-[#F355DA]/30 p-5 sm:p-6 space-y-5" id="output-segment-thumbnail">
                  
                  <div className="flex items-center justify-between border-b border-rose-950/50 pb-3">
                    <h3 className="font-display font-black text-xs sm:text-sm tracking-widest text-[#F355DA] flex items-center gap-2 uppercase">
                      <Palette className="w-5 h-5 text-[#F355DA]" />
                      C. AI Thumbnail Art Prompt
                    </h3>
                    <button
                      onClick={() => copyToClipboard(result.thumbnail.prompt, "prompt")}
                      className="text-[#F355DA] hover:text-white bg-[#F355DA]/10 hover:bg-[#F355DA]/25 py-2 px-3 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-mono border border-[#F355DA]/20"
                    >
                      {copiedSection === "prompt" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Prompt!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Art Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Visual Prompt Section */}
                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-400 font-mono tracking-wider block uppercase">
                        Descriptive Prompt (Midjourney / Bing Image Creator)
                      </span>
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 text-slate-100 font-sans text-xs sm:text-sm leading-relaxed relative select-all select-none">
                        <p className="select-all block leading-relaxed pr-6">{result.thumbnail.prompt}</p>
                      </div>
                    </div>

                    {/* Sub-Layout specifications: fonts and placement */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                        <span className="text-[10px] text-pink-400 font-mono tracking-wider block uppercase font-bold">
                          Recommended Headings Fonts:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.thumbnail.recommendedFonts.map((font) => (
                            <span 
                              key={font} 
                              className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-300 text-xs font-mono"
                            >
                              {font}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                        <span className="text-[10px] text-[#00F2FE] font-mono tracking-wider block uppercase font-bold">
                          Composition & Layout Instructions:
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          {result.thumbnail.layoutTips}
                        </p>
                      </div>

                    </div>

                    {/* Mock Art Canvas Rendering Visual card */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">
                        AI Midjourney Art Preview Simulator
                      </span>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 flex flex-col items-end justify-between p-4 bg-slate-900">
                        {/* Simulation styling */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{
                          backgroundImage: `url("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800")`
                        }} />
                        
                        {/* Visual gradients simulating a neon vibe */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-[#0B0F19]/90 to-purple-950/20 mix-blend-color-burn"></div>

                        {/* Text placeholder preview area (left aligned negative space) */}
                        <div className="z-10 text-left max-w-[60%] self-start flex flex-col justify-center h-full space-y-1">
                          <h4 className="font-display font-extrabold uppercase text-xl leading-none text-[#00F2FE] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            {songName.toUpperCase() || "SONG TITLE"}
                          </h4>
                          <p className="text-[9px] font-mono text-slate-300 uppercase tracking-widest drop-shadow">
                            OFFICIAL AUDIO OUT NOW
                          </p>
                        </div>

                        {/* Midjourney info stats tag */}
                        <div className="absolute bottom-3 right-3 bg-slate-950/90 text-slate-500 text-[9px] font-mono px-2 py-0.5 rounded border border-slate-800 z-10 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Midjourney v6
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* D. ACTIONABLE YOUTUBE SEO CHECKLIST */}
                {result.seoChecklist && (
                  <div className="bg-[#0B0F19] rounded-2xl border border-emerald-500/30 p-5 sm:p-6 space-y-5 self-stretch" id="output-segment-seo-checklist">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-950/50 pb-3.5 gap-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-display font-black text-xs sm:text-sm tracking-widest text-emerald-400 uppercase">
                          D. YouTube Genre-Specific SEO Checklist
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-950/20 px-2 py-1 rounded text-emerald-400 border border-emerald-900/40 select-all self-start">
                        GENRE: {result.seoChecklist.genre.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-5">
                      
                      {/* Sub-section: Suggested tags */}
                      <div className="space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs text-slate-350 font-mono tracking-wider block uppercase font-bold">
                            // SUGGESTED METADATA TAGS (CLICK TAG TO COPY INDIVIDUALLY)
                          </span>
                          <button
                            onClick={() => copyToClipboard(result.seoChecklist?.suggestedTags.join(", ") || "", "allTags")}
                            className="text-emerald-400 hover:text-white hover:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-900/35 transition-all text-[11px] font-mono flex items-center gap-1 cursor-pointer self-start"
                          >
                            {copiedSection === "allTags" ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied All Tags!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy All Tags</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2.5 bg-slate-950 p-4 rounded-xl border border-slate-900">
                          {result.seoChecklist.suggestedTags.map((tag, idx) => (
                            <button
                              key={idx}
                              onClick={() => copyToClipboard(tag, `tag-${idx}`)}
                              className={`px-2.5 py-1.5 bg-slate-900/80 hover:bg-[#0c1613] rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 group select-all cursor-pointer ${
                                copiedSection === `tag-${idx}`
                                  ? "border-emerald-500/45 text-emerald-400 font-bold"
                                  : "border-slate-850 hover:border-emerald-900/50 text-slate-300"
                              }`}
                              title="Click to copy tag to clipboard"
                            >
                              <span>{tag}</span>
                              {copiedSection === `tag-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 opacity-40 group-hover:opacity-100 shrink-0 transition-opacity" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sub-section: Editorial pacing advice & Tips */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Pacing advice */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-3 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-emerald-400 font-mono tracking-wider block uppercase font-bold mb-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              VIDEO PACING & EDITORIAL ADVICE:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                              {result.seoChecklist.pacingAdvice}
                            </p>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-3 border-t border-slate-900 pt-2.5">
                            // High retention guidelines for {result.seoChecklist.genre} videos
                          </div>
                        </div>

                        {/* Actionable items with checklist */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-3">
                          <span className="text-[10px] text-cyan-400 font-mono tracking-wider block uppercase font-bold mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            STRATEGIC YOUTUBE ROADMAP:
                          </span>
                          <ul className="space-y-3">
                            {result.seoChecklist.actionableTips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 group">
                                <span className="w-5 h-5 rounded bg-cyan-950/40 border border-cyan-900/30 flex items-center justify-center text-cyan-400 text-[10px] font-mono font-black shrink-0 mt-0.5 group-hover:border-cyan-400/30 transition-colors">
                                  0{idx + 1}
                                </span>
                                <span className="font-sans leading-relaxed text-slate-200 group-hover:text-white transition-colors">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>
            ) : (
              
              /* ABSENT RESULT INITIAL EMPTY DASHBOARD STATE */
              <div className="bg-[#0B0F19] rounded-2xl border border-slate-900 p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
                
                {/* Cyber line pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                  backgroundImage: `radial-gradient(#00F2FE 1.5px, transparent 1.5px)`,
                  backgroundSize: "24px 24px"
                }}></div>

                <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 text-slate-600 relative group-hover:border-slate-700">
                  <Sparkles className="w-8 h-8 text-slate-700 animate-pulse" />
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="font-display font-bold text-slate-200 uppercase tracking-wider text-sm sm:text-base">
                    Awaiting Audio Data Matrix
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                    Fill out the metadata parameters on the left controls panel or load a demo blueprint preset, then click <strong className="text-[#00F2FE]">"GENERATE MAGIC"</strong> to compile optimized social assets.
                  </p>
                </div>

                {/* Cyberpunk branding decor tags */}
                <div className="pt-2 flex flex-wrap gap-2 justify-center max-w-sm pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                    #SEO-OPTIMIZATION
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                    #MIDJOURNEY-ART
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                    #HIGH-CTR
                  </span>
                </div>

              </div>
            )}

          </section>

        </div>

        {/* 4. CONTEXT / FAQs SECTIONS BELOW FOR RICH INTEGRATION USER GUIDES */}
        <section className="bg-slate-950/60 rounded-xl border border-slate-900 p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <HelpCircle className="w-5 h-5 text-[#00F2FE]" />
            <h4 className="font-display font-bold uppercase tracking-widest text-slate-200 text-xs sm:text-sm">
              Pro Tips & Strategy Cookbook for Music Releases
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="space-y-2">
              <span className="text-[#00F2FE] font-mono text-[11px] uppercase tracking-wider block font-bold">1. Title Strategy</span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Compare CTR versus search traffic. In the first 7 days, use our <strong className="text-slate-200">Clickbait Option</strong> to secure feed views from regular subscribers. If traffic slows post-week, change titles to our <strong className="text-teal-400">SEO Optimized Option</strong> to capture search loops over many years.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[#4FACFE] font-mono text-[11px] uppercase tracking-wider block font-bold">2. Smart Timestamps</span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Timestamps help YouTube list your music video under the official "Key Moments" carousel within Google Web Search results, often boosting outside click through traffic by up to 23%! Keep the template structure exactly as formatted.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[#F355DA] font-mono text-[11px] uppercase tracking-wider block font-bold">3. Visual Contrast Rules</span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Always prioritize text visibility in thumbnails on dark feeds. Our customized Midjourney promts specify neon teal and electric blue highlights. Set your text content in thick bold sans font paired with black backing layers.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 5. MINIMAL CYBER FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/70 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600">
          <p>© 2026 MAYTERA SEO AI INC. SHAPING MODERN SOUNDSCAPES SECURELY.</p>
          <div className="flex gap-4">
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 hover:text-[#00F2FE]">TERMS OF SYNTHESIS</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 hover:text-[#F355DA]">DECENTRALIZED ENGINES</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
