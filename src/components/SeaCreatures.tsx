import { useState, useRef, ReactNode } from "react";
import { motion, useAnimationControls } from "motion/react";

// Bubbles spawned by creatures
export interface BubbleData {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface CreatureProps {
  onSpawnBubble: (x: number, y: number, count?: number) => void;
  containerWidth: number;
  containerHeight: number;
}

// 1. Little Fish (小魚)
export function LittleFish({ onSpawnBubble }: Omit<CreatureProps, "containerWidth" | "containerHeight">) {
  const [isWiggling, setIsWiggling] = useState(false);
  const controls = useAnimationControls();

  const handleInteraction = () => {
    if (isWiggling) return;
    setIsWiggling(true);
    // Bubble burst effect!
    onSpawnBubble(50, 50, 6);
    
    // Quick burst of speed and spin
    controls.start({
      x: [0, -30, 80, 0],
      y: [0, -15, -5, 0],
      rotate: [0, -10, 360, 0],
      transition: { duration: 1.2, ease: "easeInOut" }
    }).then(() => setIsWiggling(false));
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
      animate={controls}
      style={{ width: "90px", height: "60px" }}
    >
      <svg
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(20,184,166,0.3)]"
      >
        {/* Main Fish Body */}
        <path
          d="M20 40C20 22 55 12 85 28C95 33 105 40 110 40C105 40 95 47 85 52C55 68 20 58 20 40Z"
          fill="url(#fishGradient)"
          stroke="#2dd4bf"
          strokeWidth="2.5"
        />

        {/* Wiggling Tail */}
        <motion.path
          d="M20 40 L5 25 L8 40 L5 55 Z"
          fill="url(#tailGradient)"
          stroke="#0d9488"
          strokeWidth="1.5"
          animate={isWiggling ? {
            rotateY: [0, 45, -45, 45, -45, 0],
            skewY: [0, 20, -20, 20, -20, 0],
          } : {
            rotateY: [0, 15, -15, 0],
          }}
          transition={{
            duration: isWiggling ? 1.0 : 2.5,
            repeat: isWiggling ? 0 : Infinity,
            ease: "easeInOut",
          }}
          style={{ originX: "20px", originY: "40px" }}
        />

        {/* Dorsal Fin */}
        <path
          d="M50 21C55 10 70 12 75 24"
          fill="#14b8a6"
          opacity="0.85"
          stroke="#2dd4bf"
          strokeWidth="1.5"
        />
        
        {/* Ventral Fin */}
        <path
          d="M55 57C60 66 70 65 72 54"
          fill="#0f766e"
          opacity="0.8"
        />

        {/* Big Curious Eye */}
        <circle cx="85" cy="34" r="7" fill="white" />
        <motion.circle 
          cx="86" 
          cy="34" 
          r="4" 
          fill="#0f172a"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
        />
        <circle cx="84" cy="32" r="1.5" fill="white" />

        {/* Cheek pink glow */}
        <circle cx="82" cy="45" r="4" fill="#ff007f" opacity="0.4" />

        {/* Cute Smiling Mouth */}
        <path
          d="M95 42C93 45 88 44 87 42"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Scales Pattern lines */}
        <path d="M50 35 C48 40 48 42 50 47 M58 32 C56 37 56 42 58 48 M66 33 C64 38 64 41 66 46" stroke="#2dd4bf" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />

        {/* Gradients */}
        <defs>
          <linearGradient id="fishGradient" x1="20" y1="40" x2="110" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="60%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
          <linearGradient id="tailGradient" x1="5" y1="40" x2="20" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// 2. Little Cuttlefish / Squid (小花枝)
export function LittleCuttlefish({ onSpawnBubble }: Omit<CreatureProps, "containerWidth" | "containerHeight">) {
  const [mood, setMood] = useState<"happy" | "shy" | "dizzy">("happy");
  const controls = useAnimationControls();

  const handleInteraction = () => {
    const moods: ("happy" | "shy" | "dizzy")[] = ["happy", "shy", "dizzy"];
    const nextMood = moods[(moods.indexOf(mood) + 1) % moods.length];
    setMood(nextMood);
    
    // Bubble burst offset!
    onSpawnBubble(40, 20, 5);

    // Cute squishy vertical leap and rotation
    controls.start({
      y: [-20, 15, -10, 0],
      scaleX: [1, 1.25, 0.85, 1],
      scaleY: [1, 0.8, 1.25, 1],
      rotate: [0, nextMood === "dizzy" ? 360 : 10, 0],
      transition: { duration: 1.0, ease: "easeOut" }
    });
  };

  const getBodyColor = () => {
    switch (mood) {
      case "shy": return "url(#cuttleShyGradient)";
      case "dizzy": return "url(#cuttleDizzyGradient)";
      default: return "url(#cuttleHappyGradient)";
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
      animate={controls}
      style={{ width: "75px", height: "85px" }}
    >
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(232,121,249,0.4)]"
      >
        {/* Tentacles/Arms at bottom */}
        <g stroke="#f472b6" strokeWidth="3" strokeLinecap="round">
          {/* Wave animations for individual tentacles */}
          <motion.path
            d="M 30 75 Q 25 95 32 110"
            animate={{ d: ["M 30 75 Q 20 95 35 110", "M 30 75 Q 30 95 25 110", "M 30 75 Q 20 95 35 110"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 40 78 Q 40 100 42 114"
            animate={{ d: ["M 40 78 Q 35 100 48 114", "M 40 78 Q 45 100 38 114", "M 40 78 Q 35 100 48 114"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.path
            d="M 50 78 Q 50 102 48 115"
            animate={{ d: ["M 50 78 Q 55 102 44 115", "M 50 78 Q 45 102 54 115", "M 50 78 Q 55 102 44 115"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.path
            d="M 60 78 Q 63 100 58 114"
            animate={{ d: ["M 60 78 Q 68 100 54 114", "M 60 78 Q 58 100 64 114", "M 60 78 Q 68 100 54 114"] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.path
            d="M 70 75 Q 75 95 68 110"
            animate={{ d: ["M 70 75 Q 80 95 65 110", "M 70 75 Q 70 95 75 110", "M 70 75 Q 80 95 65 110"] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </g>

        {/* Cuttlefish Head (Dome shape, very plump and cute) */}
        <path
          d="M20 55C15 25 35 10 50 10C65 10 85 25 80 55C78 72 68 80 50 80C32 80 22 72 20 55Z"
          fill={getBodyColor()}
          stroke="#f0abfc"
          strokeWidth="2.5"
        />

        {/* Cute side fins */}
        <path d="M18 45C10 43 12 55 20 52" fill="#e879f9" opacity="0.8" />
        <path d="M82 45C90 43 88 55 80 52" fill="#e879f9" opacity="0.8" />

        {/* Sparkling Big Eyes */}
        <g id="eyes">
          {mood === "dizzy" ? (
            // Dizzy spiral eyes
            <>
              <circle cx="36" cy="48" r="8" fill="white" stroke="#e879f9" strokeWidth="1" />
              <path d="M32 48 Q36 44 40 48 T36 52 Z" fill="#701a75" />
              <circle cx="64" cy="48" r="8" fill="white" stroke="#e879f9" strokeWidth="1" />
              <path d="M60 48 Q64 44 68 48 T64 52 Z" fill="#701a75" />
            </>
          ) : mood === "shy" ? (
            // Shy closed eyes / blushing
            <>
              <path d="M30 48 Q36 52 42 48" stroke="#701a75" strokeWidth="3" strokeLinecap="round" />
              <path d="M58 48 Q64 52 70 48" stroke="#701a75" strokeWidth="3" strokeLinecap="round" />
              {/* Blushing cheeks */}
              <circle cx="28" cy="56" r="6" fill="#f43f5e" opacity="0.5" />
              <circle cx="72" cy="56" r="6" fill="#f43f5e" opacity="0.5" />
            </>
          ) : (
            // Big Happy sparkle eyes
            <>
              <circle cx="36" cy="48" r="9" fill="white" />
              <circle cx="36" cy="48" r="6" fill="#3b0764" />
              <circle cx="38" cy="45" r="2.5" fill="white" />
              <circle cx="34" cy="50" r="1" fill="white" />

              <circle cx="64" cy="48" r="9" fill="white" />
              <circle cx="64" cy="48" r="6" fill="#3b0764" />
              <circle cx="66" cy="45" r="2.5" fill="white" />
              <circle cx="62" cy="50" r="1" fill="white" />
              
              {/* Soft rosy cheeks */}
              <circle cx="28" cy="56" r="4" fill="#f472b6" opacity="0.4" />
              <circle cx="72" cy="56" r="4" fill="#f472b6" opacity="0.4" />
            </>
          )}
        </g>

        {/* Small Mouth */}
        <path
          d={mood === "happy" ? "M47 56 Q50 60 53 56" : "M48 58 L52 58"}
          stroke="#3b0764"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tiny soft glowing spots on forehead */}
        <circle cx="42" cy="22" r="2" fill="white" opacity="0.5" />
        <circle cx="50" cy="18" r="3" fill="white" opacity="0.5" />
        <circle cx="58" cy="22" r="2" fill="white" opacity="0.5" />

        {/* Gradients definitions */}
        <defs>
          <linearGradient id="cuttleHappyGradient" x1="50" y1="10" x2="50" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="50%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <linearGradient id="cuttleShyGradient" x1="50" y1="10" x2="50" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="60%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="cuttleDizzyGradient" x1="50" y1="10" x2="50" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// 3. Little Shrimp (小蝦)
export function LittleShrimp({ onSpawnBubble }: Omit<CreatureProps, "containerWidth" | "containerHeight">) {
  const [isDashing, setIsDashing] = useState(false);
  const controls = useAnimationControls();

  const handleInteraction = () => {
    if (isDashing) return;
    setIsDashing(true);
    // Escape action bubbles!
    onSpawnBubble(10, 30, 8);

    // Escape launch dash backward (classic shrimp flight response)
    controls.start({
      x: [-120, -150, 20, 0],
      y: [30, -10, -5, 0],
      rotate: [-20, -35, 10, 0],
      scaleX: [1, 0.8, 1.1, 1],
      transition: { 
        duration: 1.4, 
        times: [0, 0.25, 0.75, 1],
        ease: "easeInOut" 
      }
    }).then(() => setIsDashing(false));
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
      animate={controls}
      style={{ width: "80px", height: "60px" }}
    >
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(251,146,60,0.4)]"
      >
        {/* Antennas / Whiskers (Long waving lines in front of head) */}
        <g stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round">
          <motion.path
            d="M 64 36 C 84 28 92 15 98 10"
            animate={{ d: ["M 64 36 C 84 28 92 15 98 10", "M 64 36 C 80 32 94 22 96 15", "M 64 36 C 84 28 92 15 98 10"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 64 39 C 85 45 94 48 99 54"
            animate={{ d: ["M 64 39 C 85 45 94 48 99 54", "M 64 39 C 82 43 96 52 98 48", "M 64 39 C 85 45 94 48 99 54"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </g>

        {/* Little Swimming Legs (Paddling at the bottom) */}
        <g stroke="#f97316" strokeWidth="2" strokeLinecap="round">
          <motion.path
            d="M28 50 L24 58"
            animate={{ rotate: [0, 25, -20, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
            style={{ originX: "28px", originY: "50px" }}
          />
          <motion.path
            d="M36 51 L32 59"
            animate={{ rotate: [0, -20, 30, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear", delay: 0.15 }}
            style={{ originX: "36px", originY: "51px" }}
          />
          <motion.path
            d="M44 50 L40 58"
            animate={{ rotate: [0, 20, -25, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear", delay: 0.3 }}
            style={{ originX: "44px", originY: "50px" }}
          />
          <motion.path
            d="M52 48 L49 55"
            animate={{ rotate: [0, -15, 25, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear", delay: 0.45 }}
            style={{ originX: "52px", originY: "48px" }}
          />
        </g>

        {/* Shrimp Body Sections (Segmented curves in warm gradient) */}
        {/* Tail fin */}
        <path
          d="M10 40 L2 32 L4 44 L2 52 Z"
          fill="#f97316"
          stroke="#ffedd5"
          strokeWidth="1"
        />

        {/* Segmented Abdomen (Curves left to right) */}
        {/* Seg 1 (near tail) */}
        <path d="M11 41 Q18 36 24 45" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
        {/* Seg 2 */}
        <path d="M21 44 Q28 32 35 46" stroke="#fb923c" strokeWidth="9" strokeLinecap="round" />
        {/* Seg 3 */}
        <path d="M31 46 Q39 31 47 45" stroke="#fb923c" strokeWidth="10" strokeLinecap="round" />
        {/* Seg 4 */}
        <path d="M42 44 Q51 32 58 41" stroke="#f97316" strokeWidth="11" strokeLinecap="round" />

        {/* Head/Cephalothorax (Large rounded segment on the right) */}
        <path
          d="M 52 38 C 52 25 72 24 74 38 C 74 46 68 50 56 46 Z"
          fill="url(#shrimpGradient)"
          stroke="#ea580c"
          strokeWidth="1.5"
        />

        {/* Sharp Rostrum (Spike on tip of head) */}
        <path d="M72 31 L78 28 L73 34 Z" fill="#ea580c" />

        {/* Tiny Bead Black Eye */}
        <circle cx="65" cy="32" r="3.5" fill="white" />
        <circle cx="66" cy="32" r="2" fill="#0f172a" />
        <circle cx="65" cy="31" r="0.8" fill="white" />

        {/* Cute blushing cheek */}
        <circle cx="67" cy="39" r="3" fill="#ff2e2e" opacity="0.3" />

        {/* Gradients */}
        <defs>
          <linearGradient id="shrimpGradient" x1="52" y1="36" x2="74" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// 4. Little Starfish (小海星) - Responsive star vector that spins and smiles!
export function LittleStarfish({ onSpawnBubble }: Omit<CreatureProps, "containerWidth" | "containerHeight">) {
  const [isWobbling, setIsWobbling] = useState(false);
  const controls = useAnimationControls();

  const handleInteraction = () => {
    if (isWobbling) return;
    setIsWobbling(true);
    onSpawnBubble(50, 50, 5);

    controls.start({
      rotate: [0, -30, 390, 360],
      scale: [1, 1.2, 0.9, 1],
      transition: { duration: 1.2, ease: "easeInOut" }
    }).then(() => {
      setIsWobbling(false);
      // Reset rotation back to standard coordinate safely
      controls.set({ rotate: 0 });
    });
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
      animate={controls}
      style={{ width: "70px", height: "70px" }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(234,179,8,0.4)]"
      >
        {/* Starfish shape */}
        <path
          d="M 50 10 
             C 53 28, 62 38, 80 40 
             C 62 42, 60 55, 68 85 
             C 53 72, 47 72, 32 85 
             C 40 55, 38 42, 20 40 
             C 38 38, 47 28, 50 10 Z"
          fill="url(#starGradient)"
          stroke="#eab308"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Small soft skin spots */}
        <circle cx="50" cy="25" r="2.5" fill="#ca8a04" opacity="0.6" />
        <circle cx="68" cy="45" r="2" fill="#ca8a04" opacity="0.6" />
        <circle cx="60" cy="65" r="2.5" fill="#ca8a04" opacity="0.6" />
        <circle cx="40" cy="65" r="2" fill="#ca8a04" opacity="0.6" />
        <circle cx="32" cy="45" r="2.5" fill="#ca8a04" opacity="0.6" />

        {/* Happy sparkling eyes */}
        <circle cx="43" cy="44" r="5" fill="white" />
        <circle cx="43" cy="44" r="3" fill="#854d0e" />
        <circle cx="44.5" cy="42.5" r="1" fill="white" />

        <circle cx="57" cy="44" r="5" fill="white" />
        <circle cx="57" cy="44" r="3" fill="#854d0e" />
        <circle cx="58.5" cy="42.5" r="1" fill="white" />

        {/* Rosy cheeks */}
        <circle cx="37" cy="49" r="3" fill="#f43f5e" opacity="0.5" />
        <circle cx="63" cy="49" r="3" fill="#f43f5e" opacity="0.5" />

        {/* Big cute mouth */}
        <path
          d="M 46 51 Q 50 56 54 51"
          stroke="#451a03"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        <defs>
          <linearGradient id="starGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// 5. Little Crab (小螃蟹) - Walks sideways, opens/closes claws, very playful!
export function LittleCrab({ onSpawnBubble }: Omit<CreatureProps, "containerWidth" | "containerHeight">) {
  const [isPinching, setIsPinching] = useState(false);
  const controls = useAnimationControls();

  const handleInteraction = () => {
    if (isPinching) return;
    setIsPinching(true);
    onSpawnBubble(50, 30, 4);

    // Sideways quick crawl dance and snap
    controls.start({
      x: [0, -30, 30, -15, 0],
      rotate: [0, -5, 5, -3, 0],
      transition: { duration: 1.0, ease: "easeInOut" }
    }).then(() => setIsPinching(false));
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
      animate={controls}
      style={{ width: "80px", height: "65px" }}
    >
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(239,68,68,0.4)]"
      >
        {/* Little Legs at the bottom left/right */}
        <g stroke="#dc2626" strokeWidth="3" strokeLinecap="round">
          {/* Left legs */}
          <motion.path
            d="M 25 45 Q 12 50 10 60"
            animate={isPinching ? { d: ["M 25 45 Q 12 45 10 52", "M 25 45 Q 12 55 10 65", "M 25 45 Q 12 50 10 60"] } : {}}
            transition={{ duration: 0.3, repeat: isPinching ? 3 : 0 }}
          />
          <motion.path
            d="M 30 47 Q 18 55 15 68"
            animate={isPinching ? { d: ["M 30 47 Q 18 50 15 60", "M 30 47 Q 18 60 15 72", "M 30 47 Q 18 55 15 68"] } : {}}
            transition={{ duration: 0.3, delay: 0.05, repeat: isPinching ? 3 : 0 }}
          />
          <motion.path
            d="M 35 48 M 35 48 Q 24 60 22 72"
            animate={isPinching ? { d: ["M 35 48 Q 24 55 22 65", "M 35 48 Q 24 65 22 76", "M 35 48 Q 24 60 22 72"] } : {}}
            transition={{ duration: 0.3, delay: 0.1, repeat: isPinching ? 3 : 0 }}
          />

          {/* Right legs */}
          <motion.path
            d="M 75 45 Q 88 50 90 60"
            animate={isPinching ? { d: ["M 75 45 Q 88 45 90 52", "M 75 45 Q 88 55 90 65", "M 75 45 Q 88 50 90 60"] } : {}}
            transition={{ duration: 0.3, repeat: isPinching ? 3 : 0 }}
          />
          <motion.path
            d="M 70 47 Q 82 55 85 68"
            animate={isPinching ? { d: ["M 70 47 Q 82 50 85 60", "M 70 47 Q 82 60 85 72", "M 70 47 Q 82 55 85 68"] } : {}}
            transition={{ duration: 0.3, delay: 0.05, repeat: isPinching ? 3 : 0 }}
          />
          <motion.path
            d="M 65 48 M 65 48 Q 76 60 78 72"
            animate={isPinching ? { d: ["M 65 48 Q 76 55 78 65", "M 65 48 Q 76 65 78 76", "M 65 48 Q 76 60 78 72"] } : {}}
            transition={{ duration: 0.3, delay: 0.1, repeat: isPinching ? 3 : 0 }}
          />
        </g>

        {/* Left Arm / Pincher Claw */}
        <g id="left-claw">
          <path d="M30 40 Q 15 32 18 20" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
          <motion.path
            d="M 18 20 C 13 14, 8 22, 14 26 Z"
            fill="url(#crabRedGradient)"
            stroke="#991b1b"
            strokeWidth="1.5"
            animate={isPinching ? { rotate: [0, -15, 10, 0] } : {}}
            transition={{ duration: 0.4, repeat: isPinching ? 2 : 0 }}
            style={{ originX: "18px", originY: "20px" }}
          />
          <motion.path
            d="M 18 20 C 18 10, 26 15, 22 23"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={isPinching ? { rotate: [0, 15, -10, 0] } : {}}
            transition={{ duration: 0.4, repeat: isPinching ? 2 : 0 }}
            style={{ originX: "18px", originY: "20px" }}
          />
        </g>

        {/* Right Arm / Pincher Claw */}
        <g id="right-claw">
          <path d="M70 40 Q 85 32 82 20" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
          <motion.path
            d="M 82 20 C 87 14, 92 22, 86 26 Z"
            fill="url(#crabRedGradient)"
            stroke="#991b1b"
            strokeWidth="1.5"
            animate={isPinching ? { rotate: [0, 15, -10, 0] } : {}}
            transition={{ duration: 0.4, repeat: isPinching ? 2 : 0 }}
            style={{ originX: "82px", originY: "20px" }}
          />
          <motion.path
            d="M 82 20 C 82 10, 74 15, 78 23"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={isPinching ? { rotate: [0, -15, 10, 0] } : {}}
            transition={{ duration: 0.4, repeat: isPinching ? 2 : 0 }}
            style={{ originX: "82px", originY: "20px" }}
          />
        </g>

        {/* Main round plump crab body */}
        <ellipse cx="50" cy="46" rx="24" ry="17" fill="url(#crabRedGradient)" stroke="#b91c1c" strokeWidth="2.5" />

        {/* Cute Eyestalks extending upwards */}
        <g stroke="#b91c1c" strokeWidth="3">
          <path d="M 40 32 L 38 20" />
          <path d="M 60 32 L 62 20" />
        </g>
        {/* Eyeballs */}
        <circle cx="38" cy="18" r="5" fill="white" stroke="#7f1d1d" strokeWidth="1" />
        <circle cx="38.5" cy="18" r="2.5" fill="#0f172a" />
        <circle cx="37.5" cy="17" r="1" fill="white" />

        <circle cx="62" cy="18" r="5" fill="white" stroke="#7f1d1d" strokeWidth="1" />
        <circle cx="62.5" cy="18" r="2.5" fill="#0f172a" />
        <circle cx="61.5" cy="17" r="1" fill="white" />

        {/* Happy red cheeks */}
        <circle cx="35" cy="44" r="3" fill="#fca5a5" opacity="0.6" />
        <circle cx="65" cy="44" r="3" fill="#fca5a5" opacity="0.6" />

        {/* Smiling Mouth */}
        <path
          d="M 46 48 Q 50 53 54 48"
          stroke="#7f1d1d"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        <defs>
          <linearGradient id="crabRedGradient" x1="26" y1="46" x2="74" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// 6. Floating Creature Wrapper (Renders floats around in custom random bounding boxes)
export function FloatingCreature({
  children,
  startX,
  startY,
  minX = 10,
  maxX = 90,
  minY = 10,
  maxY = 90,
  duration = 18,
}: {
  children: ReactNode;
  startX: number;
  startY: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-auto z-10"
      initial={{ x: `${startX}vw`, y: `${startY}vh` }}
      animate={{
        x: [
          `${startX}vw`,
          `${Math.max(minX, startX - 25)}vw`,
          `${Math.min(maxX, startX + 25)}vw`,
          `${Math.max(minX, startX - 10)}vw`,
          `${Math.min(maxX, startX + 15)}vw`,
          `${startX}vw`
        ],
        y: [
          `${startY}vh`,
          `${Math.max(minY, startY - 20)}vh`,
          `${Math.min(maxY, startY + 25)}vh`,
          `${Math.max(minY, startY - 15)}vh`,
          `${Math.min(maxY, startY + 15)}vh`,
          `${startY}vh`
        ]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
