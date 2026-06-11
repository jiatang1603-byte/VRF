import { useState, useEffect, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Sparkles, 
  Waves, 
  Compass, 
  RefreshCw, 
  HelpCircle,
  Award,
  Info
} from "lucide-react";
import { 
  LittleFish, 
  LittleCuttlefish, 
  LittleShrimp, 
  FloatingCreature 
} from "./components/SeaCreatures";
import { 
  BubbleField, 
  playBubblePopSound, 
  Bubble 
} from "./components/BubbleField";

// Form source URL
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSftYfrcIMLmrFqSYr44M6smbtf6Fq0zuoaIfuXoPxOtaVtKfQ/viewform?embedded=true";
const DIRECT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSftYfrcIMLmrFqSYr44M6smbtf6Fq0zuoaIfuXoPxOtaVtKfQ/viewform?usp=header";

export default function App() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [popCount, setPopCount] = useState(0);
  const [spawnRate, setSpawnRate] = useState(3000); // ms between auto spawns
  const [oceanMessage, setOceanMessage] = useState<string>("歡迎光臨！點擊頁面任意處可以製造氣泡喔 🫧");
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-spawn ambient bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      spawnAmbientBubble();
    }, spawnRate);

    return () => clearInterval(interval);
  }, [spawnRate]);

  // Welcome alerts / funny oceanic quotes based on interactive pop counts
  useEffect(() => {
    if (popCount === 1) {
      setOceanMessage("你製造了第一個海洋氣泡！啵！🫧");
    } else if (popCount === 5) {
      setOceanMessage("好厲害！深海小生物都在為你跳舞呢 🦑");
    } else if (popCount === 12) {
      setOceanMessage("你解鎖了「氣泡達人」稱號！點擊小魚看看吧 🐟");
    } else if (popCount === 25) {
      setOceanMessage("海洋泡泡派對！小蝦正表演著倒退火箭特技 🦐");
    } else if (popCount > 40 && popCount % 20 === 0) {
      setOceanMessage(`真有耐心！你已經與海洋互動了 ${popCount} 次！🐠`);
    }
  }, [popCount]);

  const spawnAmbientBubble = (xOverride?: number, sizeOverride?: number) => {
    const id = Date.now() + Math.random();
    const x = xOverride !== undefined ? xOverride : Math.random() * 90 + 5;
    const size = sizeOverride !== undefined ? sizeOverride : Math.random() * 25 + 10;
    const speed = Math.random() * 6 + 7; // rise speed (seconds)
    const opacity = Math.random() * 0.4 + 0.35;

    const newBubble: Bubble = {
      id,
      x,
      y: 0,
      size,
      speed,
      opacity,
    };
    setBubbles((prev) => [...prev, newBubble]);
  };

  // Click on background spawns local ascend bubbles
  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    // Avoid triggering bubble spawn when clicking interactive UI items or form
    const target = e.target as HTMLElement;
    if (
      target.closest("button") || 
      target.closest("iframe") || 
      target.closest(".interactive-panel") ||
      target.closest("a")
    ) {
      return;
    }

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickXPct = ((e.clientX - rect.left) / rect.width) * 100;
      
      // Spawn 3 bubbly particles rising from the vicinity
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          spawnAmbientBubble(
            clickXPct + (Math.random() * 6 - 3), // random offsets
            Math.random() * 15 + 10
          );
        }, i * 120);
      }

      if (soundEnabled) {
        playBubblePopSound();
      }
      setPopCount((prev) => prev + 1);
    }
  };

  const handlePopBubble = (id: number) => {
    // Remove popped bubble from state
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setPopCount((prev) => prev + 1);
  };

  // Spawn bubbles centered on a creature's location
  const handleCreatureBubbleBurst = (xOffset: number, yOffset: number, count = 5) => {
    if (soundEnabled) {
      playBubblePopSound();
    }
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        spawnAmbientBubble(
          Math.min(95, Math.max(5, 50 + (Math.random() * 20 - 10))),
          Math.random() * 18 + 12
        );
      }, i * 80);
    }
    setPopCount((prev) => prev + count);
  };

  return (
    <div 
      id="ocean-container"
      ref={canvasRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-gradient-to-b from-[#02182b] via-[#042444] to-[#010c14] select-none"
      onClick={handleBackgroundClick}
    >
      {/* 1. Header Navigation Bar / Title */}
      <header className="relative w-full z-20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-teal-500/10 bg-[#02182b]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-full border border-teal-500/30">
            <Waves className="w-6 h-6 text-teal-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              訪客調查登記表
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Oceanic Style
              </span>
            </h1>
            <p className="text-xs text-teal-200/60 mt-0.5">以深海波光為靈感，為您呈上流暢填寫氛圍</p>
          </div>
        </div>

        {/* Action Controls Panel */}
        <div className="flex items-center gap-3 mt-3 sm:mt-0 interactive-panel">
          {/* Popping statistics score */}
          <div className="hidden md:flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg text-teal-300 text-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span>海洋共鳴度: <strong className="text-amber-300 font-mono text-sm">{popCount}</strong></span>
          </div>

          {/* Sparkle bubble trigger */}
          <button
            id="spawn-bubble-btn"
            onClick={() => {
              if (soundEnabled) playBubblePopSound();
              spawnAmbientBubble();
              setPopCount(prev => prev + 1);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-teal-100 bg-teal-500/20 border border-teal-400/30 hover:bg-teal-500/35 active:scale-95 transition-all shadow-[0_0_12px_rgba(20,184,166,0.2)] cursor-pointer"
            title="手動生成一個氣泡"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            製造氣泡
          </button>

          {/* Sound switch */}
          <button
            id="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              soundEnabled 
                ? "bg-teal-500/20 border-teal-400/40 text-teal-300" 
                : "bg-slate-800/60 border-slate-700 text-slate-400"
            }`}
            title={soundEnabled ? "關閉音效" : "開啟音效"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </header>

      {/* Decorative Wave at the top border */}
      <div className="absolute top-16 left-0 right-0 h-4 overflow-hidden pointer-events-none opacity-40 z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-teal-500/10">
          <path d="M0,0 C150,90 350,110 500,60 C650,10 850,20 1000,70 C1150,120 1250,50 1400,10 L1400,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* 2. Floating Interactive Creatures Layer */}
      {/* Little Fish */}
      <FloatingCreature startX={8} startY={25} minX={5} maxX={32} minY={18} maxY={45} duration={22}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#02182b]/95 text-teal-200 text-[10px] px-2 py-0.5 rounded border border-teal-500/30 whitespace-nowrap transition-all duration-200 pointer-events-none">
            小游魚 (雙擊/點我會衝刺喔!)
          </span>
          <LittleFish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      <FloatingCreature startX={82} startY={42} minX={68} maxX={93} minY={25} maxY={58} duration={25}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#02182b]/95 text-pink-200 text-[10px] px-2 py-0.5 rounded border border-pink-500/30 whitespace-nowrap transition-all duration-200 pointer-events-none">
            小花枝 (點我可以變換心情 🐙)
          </span>
          <LittleCuttlefish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      <FloatingCreature startX={12} startY={65} minX={4} maxX={28} minY={50} maxY={88} duration={19}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#02182b]/95 text-orange-200 text-[10px] px-2 py-0.5 rounded border border-orange-500/30 whitespace-nowrap transition-all duration-200 pointer-events-none">
            橙光小蝦 (摸摸我會表演彈跳逃生 🦐)
          </span>
          <LittleShrimp onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Another extra decorative small fish near form bottom depth */}
      <FloatingCreature startX={74} startY={72} minX={62} maxX={89} minY={60} maxY={88} duration={28}>
        <div className="group relative opacity-75">
          <LittleFish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* 3. Interactive Floating Bubble Fields */}
      <BubbleField bubbles={bubbles} onPopBubble={handlePopBubble} soundEnabled={soundEnabled} />

      {/* 4. Central Embedded Iframe Container */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center items-center py-6 px-4 md:px-6">
        
        {/* Ocean Broadcast Message Panel */}
        <motion.div 
          className="w-full max-w-4xl mb-4 bg-teal-950/40 border border-teal-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-teal-200 text-xs shadow-[0_4px_12px_rgba(20,184,166,0.05)] backdrop-blur-sm"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-300 animate-spin" style={{ animationDuration: "12s" }} />
            <span>{oceanMessage}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 opacity-70">
            <Info className="w-3.5 h-3.5 text-teal-300" />
            <span>點擊海洋底圖可釋放更多汽泡</span>
          </div>
        </motion.div>

        {/* Main Card Container */}
        <div className="w-full max-w-4xl rounded-2xl border border-teal-500/20 bg-gradient-to-b from-[#031d35]/85 to-[#02162a]/95 shadow-[0_12px_40px_rgba(1,10,20,0.6)] backdrop-blur-md overflow-hidden relative flex flex-col">
          
          {/* High specular glass highlights */}
          <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"></div>
          
          {/* Card Top Title Block & Indicators */}
          <div className="px-5 py-4 bg-[#02182b]/95 border-b border-teal-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-teal-100">訪客調查登記表</span>
            </div>

            {/* Quick Helper Option list */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setIframeLoading(true);
                  // Refresh iframe
                  const iframe = document.getElementById("google-form-iframe") as HTMLIFrameElement;
                  if (iframe) iframe.src = FORM_URL;
                }}
                className="p-1.5 text-xs text-teal-300/80 hover:text-teal-200 hover:bg-teal-500/10 rounded transition-all cursor-pointer flex items-center gap-1"
                title="重新整理表單"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">重新整理</span>
              </button>
              
              <a
                href={DIRECT_FORM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="p-1.5 text-xs text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 rounded border border-teal-400/20 transition-all flex items-center gap-1.5"
                title="另開新視窗填報"
              >
                <span className="hidden sm:inline">外部直接填寫</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Form Frame Container - Perfectly Responsive */}
          <div className="w-full relative bg-[#010c14] min-h-[580px] md:min-h-[660px] flex flex-col justify-between">
            
            {/* Loading Cover Spinner overlay */}
            <AnimatePresence>
              {iframeLoading && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#021020] to-[#010912] z-30 pointer-events-none"
                >
                  {/* Oceanic style water ripple loaders */}
                  <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400/20 animate-ping"></span>
                    <span className="absolute inline-flex h-12 w-12 rounded-full bg-teal-500/30 animate-pulse"></span>
                    <Waves className="w-7 h-7 text-teal-300 animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                  <p className="text-sm text-teal-100 font-medium tracking-wide">正在潛入深海，載入訪客登記表...</p>
                  <p className="text-xs text-teal-300/50 mt-1 max-w-xs text-center px-4">
                    若系統讀取時間過長，請點擊上方「外部直接填寫」按鈕完成登記。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Simulated ocean particles behind the iframe */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.06)_0%,transparent_70%)] z-0 pointer-events-none"></div>

            {/* The Google Form Iframe element */}
            <iframe
              id="google-form-iframe"
              src={FORM_URL}
              className="w-full relative z-10 bg-transparent flex-1"
              style={{
                border: "none",
                minHeight: "580px",
                height: "100%",
              }}
              onLoad={() => setIframeLoading(false)}
              title="訪客調查登記表 Google 試算表單"
            />
          </div>

          {/* Form Bottom Ocean Information Panel */}
          <div className="px-5 py-4 bg-[#021020] border-t border-teal-500/15 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-300/60 font-sans gap-3">
            <div className="flex items-center gap-1.5 text-center sm:text-left">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>本表單採用 Google Forms 技術驅動，並為您保障填寫時隱私。</span>
            </div>
            
            {/* Ambient adjust slider for animation count */}
            <div className="flex items-center gap-2 bg-[#031d35] px-3 py-1 rounded-full border border-teal-500/10 scale-95 interactive-panel">
              <span>海流速度：</span>
              <button 
                onClick={() => {
                  setSpawnRate(5000);
                  setOceanMessage("切換為：平靜和風海流 🌬️");
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${spawnRate === 5000 ? "bg-teal-500/30 text-teal-100" : "text-teal-400/60"}`}
              >
                慢
              </button>
              <button 
                onClick={() => {
                  setSpawnRate(3000);
                  setOceanMessage("切換為：常態洋流氣泡 🌊");
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${spawnRate === 3000 ? "bg-teal-500/30 text-teal-100" : "text-teal-400/60"}`}
              >
                中
              </button>
              <button 
                onClick={() => {
                  setSpawnRate(1200);
                  setOceanMessage("切換為：熱帶珊瑚礁激流 🌋🫧");
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${spawnRate === 1200 ? "bg-teal-500/30 text-teal-100" : "text-teal-400/60"}`}
              >
                快
              </button>
            </div>
          </div>
        </div>

        {/* Small tips at the bottom of form card */}
        <p className="text-[11px] text-teal-400/40 text-center mt-3 tracking-wide">
          系統支援所有行動裝置及平板。您可以戳破螢幕上任何氣泡以進行聲波共鳴舒壓。
        </p>
      </main>

      {/* 5. Footer Decor Wave */}
      <footer className="relative w-full z-10 mt-auto overflow-hidden pointer-events-none">
        {/* Ambient bottom wave overlaying deep sand */}
        <div className="w-full h-16 opacity-30">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-teal-400/10">
            <path d="M0,60 C150,110 350,110 500,70 C650,30 850,10 1000,60 C1150,110 1250,90 1400,60 L1400,120 L0,120 Z"></path>
          </svg>
        </div>
        <div className="bg-[#010911] w-full py-2.5 text-center text-[10px] text-teal-500/30 font-mono tracking-wider pointer-events-auto border-t border-teal-950">
          © 2026 訪客調查登記表 · 海洋氛圍一頁式問卷服務 · 點擊氣泡可解壓 🫧
        </div>
      </footer>
    </div>
  );
}
