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
  Info,
  Sun
} from "lucide-react";
import { 
  LittleFish, 
  LittleCuttlefish, 
  LittleShrimp, 
  LittleStarfish,
  LittleCrab,
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
  const [oceanMessage, setOceanMessage] = useState<string>("歡迎來度假！點擊陽光沙灘任意處可以製造亮晶晶的汽泡喔 🫧🦀⭐️");
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-spawn ambient bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      spawnAmbientBubble();
    }, spawnRate);

    return () => clearInterval(interval);
  }, [spawnRate]);

  // Welcome alerts / funny oceanic quotes based on interactive pop counts in sunny beach mode
  useEffect(() => {
    if (popCount === 1) {
      setOceanMessage("你製造了第一個沙灘汽泡！啵！🫧");
    } else if (popCount === 5) {
      setOceanMessage("好舒服的海風！小螃蟹在沙灘上橫著跳舞，小花枝也探出頭來了呢 🦀🐙");
    } else if (popCount === 12) {
      setOceanMessage("恭喜！你獲得了「沙灘派對達人」稱號！點擊小海星和螃蟹看看吧 ⭐️🦀");
    } else if (popCount === 25) {
      setOceanMessage("陽光、沙灘、仙人掌！小蝦與小游魚在椰子樹影下瘋狂轉圈 🦐🌴🐟");
    } else if (popCount > 40 && popCount % 20 === 0) {
      setOceanMessage(`太好玩了！你已經在金色沙灘上與海洋小生物互動了 ${popCount} 次！✨`);
    }
  }, [popCount]);

  const spawnAmbientBubble = (xOverride?: number, sizeOverride?: number) => {
    const id = Date.now() + Math.random();
    const x = xOverride !== undefined ? xOverride : Math.random() * 90 + 5;
    const size = sizeOverride !== undefined ? sizeOverride : Math.random() * 25 + 10;
    const speed = Math.random() * 6 + 7; // rise speed (seconds)
    const opacity = Math.random() * 0.45 + 0.4; // Slightly more visible on light beach

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
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-gradient-to-b from-[#bae6fd] via-[#ccfbf1] to-[#fef3c7] select-none transition-all duration-700"
      onClick={handleBackgroundClick}
    >
      {/* 1. Header Navigation Bar / Title - Fresh Glassmorphism for Beach */}
      <header className="relative w-full z-20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-sky-300/30 bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-full border border-sky-300/40 shadow-sm animate-bounce" style={{ animationDuration: "5s" }}>
            <Sun className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-sky-950 flex items-center gap-2">
              訪客調查登記表
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/30 shadow-xs">
                清新沙灘風 🏖️
              </span>
            </h1>
            <p className="text-xs text-sky-900/70 mt-0.5">沐浴陽光美景，為您提供最悠閒流暢的填寫氛圍</p>
          </div>
        </div>

        {/* Action Controls Panel */}
        <div className="flex items-center gap-3 mt-3 sm:mt-0 interactive-panel">
          {/* Popping statistics score */}
          <div className="hidden md:flex items-center gap-2 bg-white/80 border border-sky-200 shadow-sm px-3 py-1.5 rounded-lg text-sky-950 text-xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>沙灘暖陽共鳴: <strong className="text-amber-600 font-mono text-sm">{popCount}</strong></span>
          </div>

          {/* Sparkle bubble trigger */}
          <button
            id="spawn-bubble-btn"
            onClick={() => {
              if (soundEnabled) playBubblePopSound();
              spawnAmbientBubble();
              setPopCount(prev => prev + 1);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-sky-950 bg-white/90 border border-sky-300 hover:bg-sky-50 hover:border-sky-400 active:scale-95 transition-all shadow-[0_2px_8px_rgba(14,165,233,0.1)] cursor-pointer"
            title="手動生成一個沙灘氣泡"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            製造氣泡
          </button>

          {/* Sound switch */}
          <button
            id="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-all cursor-pointer shadow-xs ${
              soundEnabled 
                ? "bg-sky-100 border-sky-300 text-sky-800" 
                : "bg-slate-200/80 border-slate-300 text-slate-500"
            }`}
            title={soundEnabled ? "關閉音效" : "開啟音效"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-700" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Fancy Rolling Ocean Foam styling at top border */}
      <div className="absolute top-16 left-0 right-0 h-5 overflow-hidden pointer-events-none opacity-60 z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-white/80 animate-pulse">
          <path d="M0,15 C150,45 350,5 500,20 C650,35 850,5 1000,25 C1150,45 1250,15 1400,5 L1400,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* 2. Floating Interactive Creatures Layer (Brightened for beach aesthetics) */}
      
      {/* --- LITTLE FISHES (小游魚群) --- */}
      {/* Little Fish 1 */}
      <FloatingCreature startX={8} startY={25} minX={5} maxX={32} minY={18} maxY={45} duration={22}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-sky-900 text-[10px] px-2 py-0.5 rounded border border-sky-200 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            小游魚 (戳我會加速游喔! 🐟)
          </span>
          <LittleFish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Little Fish 2 (Extra decor small fish on right shallow beach) */}
      <FloatingCreature startX={74} startY={72} minX={62} maxX={89} minY={60} maxY={88} duration={28}>
        <div className="group relative opacity-85">
          <LittleFish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Little Fish 3 (High explorer) */}
      <FloatingCreature startX={28} startY={38} minX={15} maxX={45} minY={25} maxY={55} duration={18}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-sky-900 text-[10px] px-2 py-0.5 rounded border border-sky-200 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            閃光小黃魚 🐠
          </span>
          <LittleFish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Little Fish 4 (Right reef explorer) */}
      <FloatingCreature startX={64} startY={28} minX={50} maxX={82} minY={15} maxY={42} duration={24}>
        <div className="group relative">
          <LittleFish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>


      {/* --- LITTLE CUTTLEFISHES (小花枝家族) --- */}
      {/* Little Cuttlefish 1 */}
      <FloatingCreature startX={82} startY={42} minX={68} maxX={93} minY={25} maxY={58} duration={25}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-pink-900 text-[10px] px-2 py-0.5 rounded border border-pink-200 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            小花枝 (點我換心情 🐙)
          </span>
          <LittleCuttlefish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Little Cuttlefish 2 (Bottom cute companion) */}
      <FloatingCreature startX={45} startY={74} minX={30} maxX={65} minY={62} maxY={86} duration={29}>
        <div className="group relative">
          <LittleCuttlefish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>


      {/* --- LITTLE SHRIMPS (珊瑚小蝦) --- */}
      {/* Little Shrimp 1 */}
      <FloatingCreature startX={12} startY={65} minX={4} maxX={28} minY={50} maxY={88} duration={19}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-orange-950 text-[10px] px-2 py-0.5 rounded border border-orange-250 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            珊瑚小蝦 (摸摸我會彈跳喔 🦐)
          </span>
          <LittleShrimp onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Little Shrimp 2 */}
      <FloatingCreature startX={88} startY={62} minX={75} maxX={96} minY={50} maxY={83} duration={21}>
        <div className="group relative">
          <LittleShrimp onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>


      {/* --- NEW STARFISHES (小海星群 - ⭐️) --- */}
      {/* Starfish 1 (Left bottom sandy spot) */}
      <FloatingCreature startX={5} startY={82} minX={2} maxX={20} minY={70} maxY={90} duration={32}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-amber-900 text-[10px] px-2 py-0.5 rounded border border-amber-200 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            亮金星 (戳戳我會旋轉! ⭐️)
          </span>
          <LittleStarfish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Starfish 2 (Right shallow reef spot) */}
      <FloatingCreature startX={92} startY={28} minX={85} maxX={98} minY={18} maxY={40} duration={35}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-amber-900 text-[10px] px-2 py-0.5 rounded border border-amber-200 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            珊瑚星 ⭐️
          </span>
          <LittleStarfish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Starfish 3 (Top left tide pool area) */}
      <FloatingCreature startX={6} startY={12} minX={2} maxX={15} minY={8} maxY={22} duration={28}>
        <div className="group relative">
          <LittleStarfish onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>


      {/* --- NEW CRABS (小螃蟹群 - 🦀) --- */}
      {/* Crab 1 (Bottom left beach scuttler) */}
      <FloatingCreature startX={18} startY={77} minX={8} maxX={35} minY={70} maxY={84} duration={16}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-red-900 text-[10px] px-2 py-0.5 rounded border border-red-200 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            紅鉗蟹 (碰我會剪鉗泡泡 🦀)
          </span>
          <LittleCrab onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Crab 2 (Bottom right beach surf crawlers) */}
      <FloatingCreature startX={85} startY={83} minX={70} maxX={95} minY={78} maxY={90} duration={14}>
        <div className="group relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-white/95 text-red-900 text-[10px] px-2 py-0.5 rounded border border-red-200 shadow-sm whitespace-nowrap transition-all duration-200 pointer-events-none">
            沙灘大鉗 🦀
          </span>
          <LittleCrab onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* Crab 3 (Bottom center crawlers) */}
      <FloatingCreature startX={32} startY={88} minX={20} maxX={55} minY={84} maxY={93} duration={15}>
        <div className="group relative">
          <LittleCrab onSpawnBubble={handleCreatureBubbleBurst} />
        </div>
      </FloatingCreature>

      {/* 3. Interactive Floating Bubble Fields */}
      <BubbleField bubbles={bubbles} onPopBubble={handlePopBubble} soundEnabled={soundEnabled} />

      {/* 4. Central Embedded Iframe Container */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center items-center py-6 px-4 md:px-6">
        
        {/* Ocean Broadcast Message Panel */}
        <motion.div 
          className="w-full max-w-4xl mb-4 bg-white/60 border border-sky-300/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-sky-950 text-xs shadow-[0_2px_12px_rgba(14,165,233,0.06)] backdrop-blur-sm"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: "16s" }} />
            <span className="font-medium text-sky-900">{oceanMessage}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 opacity-75 text-sky-800">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            <span>點擊沙灘任意處可收集貝殼音效喔</span>
          </div>
        </motion.div>

        {/* Main Beach Card Container */}
        <div className="w-full max-w-4xl rounded-2xl border border-white/50 bg-white/65 shadow-[0_12px_36px_rgba(12,74,110,0.08)] backdrop-blur-lg overflow-hidden relative flex flex-col">
          
          {/* Glass light reflection lines */}
          <div className="absolute top-0 left-0 w-2/3 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
          
          {/* Card Top Title Block & Indicators */}
          <div className="px-5 py-4 bg-white/80 border-b border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
              <span className="text-sm font-bold text-sky-900">訪客調查登記表</span>
            </div>

            {/* Quick Header Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setIframeLoading(true);
                  const iframe = document.getElementById("google-form-iframe") as HTMLIFrameElement;
                  if (iframe) iframe.src = FORM_URL;
                }}
                className="p-1.5 text-xs text-sky-800 hover:text-sky-950 hover:bg-sky-50 rounded transition-all cursor-pointer flex items-center gap-1 font-medium"
                title="重新整理表單"
              >
                <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">重新整理</span>
              </button>
              
              <a
                href={DIRECT_FORM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="p-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-all flex items-center gap-1.5 font-semibold"
                title="另開新視窗填報"
              >
                <span className="hidden sm:inline">外部直接填寫</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              </a>
            </div>
          </div>

          {/* Form Frame Container - Perfectly Responsive */}
          <div className="w-full relative bg-amber-50/10 min-h-[580px] md:min-h-[660px] flex flex-col justify-between">
            
            {/* Loading Cover Spinner overlay in sunny style */}
            <AnimatePresence>
              {iframeLoading && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-white to-amber-50/30 z-30 pointer-events-none"
                >
                  {/* Sunny beach water ripple animation */}
                  <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-sky-200 animate-ping"></span>
                    <span className="absolute inline-flex h-12 w-12 rounded-full bg-amber-200/50 animate-pulse"></span>
                    <Sun className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
                  </div>
                  <p className="text-sm text-sky-900 font-bold tracking-wide">正在與蔚藍沙灘連線，載入登記表...</p>
                  <p className="text-xs text-sky-800/60 mt-1 max-w-xs text-center px-4">
                    若載入時間過長，可點擊上方「外部直接填寫」按鈕完成問卷。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Simulated beach light flare backdrop behind the iframe */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.06)_0%,transparent_75%)] z-0 pointer-events-none"></div>

            {/* The Google Form Iframe element */}
            <iframe
              id="google-form-iframe"
              src={FORM_URL}
              className="w-full relative z-10 bg-transparent flex-1"
              style={{
                border: "none",
                minHeight: "580px",
                height: "100%",
                borderRadius: "0 0 12px 12px",
              }}
              onLoad={() => setIframeLoading(false)}
              title="訪客調查登記表 Google 試算表單"
            />
          </div>

          {/* Form Bottom Beach Information Panel */}
          <div className="px-5 py-4 bg-white/80 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-900/70 font-sans gap-3">
            <div className="flex items-center gap-1.5 text-center sm:text-left text-sky-900">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>本表單安全採用 Google Forms 雲端技術，為您保障填寫時隱私與安全。</span>
            </div>
            
            {/* Ambient adjust slider for animation count */}
            <div className="flex items-center gap-2 bg-sky-50 px-3 py-1 rounded-full border border-sky-200/50 scale-95 interactive-panel">
              <span className="font-medium text-sky-800">海風拍打頻率：</span>
              <button 
                onClick={() => {
                  setSpawnRate(5000);
                  setOceanMessage("感受到微風徐徐的平靜波浪 🌬️🐚");
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${spawnRate === 5000 ? "bg-sky-200 text-sky-900" : "text-sky-700/65"}`}
              >
                平靜
              </button>
              <button 
                onClick={() => {
                  setSpawnRate(3000);
                  setOceanMessage("感受到輕快且涼爽的沙灘海流 🌊🏖️");
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${spawnRate === 3000 ? "bg-sky-200 text-sky-900" : "text-sky-700/65"}`}
              >
                標準
              </button>
              <button 
                onClick={() => {
                  setSpawnRate(1200);
                  setOceanMessage("哇！有熱情的浪花正不斷湧上金色沙灘 🌊🏄‍♂️");
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${spawnRate === 1200 ? "bg-sky-200 text-sky-900" : "text-sky-700/65"}`}
              >
                熱情
              </button>
            </div>
          </div>
        </div>

        {/* Small tips at the bottom of form card */}
        <p className="text-[11px] text-sky-900/50 text-center mt-3 tracking-wide font-medium">
          本一頁式問卷完美適應各品牌手機與平板電腦。您可以隨意點打氣泡以彈奏悠緩的海洋音符。
        </p>
      </main>

      {/* 5. Footer Sandy Wave Decor */}
      <footer className="relative w-full z-10 mt-auto overflow-hidden pointer-events-none">
        {/* Soft waves washing sand foam at bottom */}
        <div className="w-full h-16 opacity-50">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-white">
            <path d="M0,80 C150,110 350,120 500,90 C650,60 850,30 1000,80 C1150,130 1250,110 1400,90 L1400,120 L0,120 Z"></path>
          </svg>
        </div>
        
        {/* Sunny yellow beach sand dune */}
        <div className="w-full h-4 opacity-45 -mt-4">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-amber-100">
            <path d="M0,90 C200,120 400,80 600,105 C800,130 1000,90 1200,110 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

        <div className="bg-white/80 w-full py-3.5 text-center text-[11px] text-sky-950/40 font-mono tracking-wider pointer-events-auto border-t border-sky-100/30">
          © 2026 訪客調查登記表 · 陽光沙灘一頁式解壓問卷調查表 🫧☀️
        </div>
      </footer>
    </div>
  );
}
