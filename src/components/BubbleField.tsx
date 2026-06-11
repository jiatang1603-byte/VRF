import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface Bubble {
  id: number;
  x: number; // percentage width
  y: number; // percentage height
  size: number; // diameter in px
  speed: number; // duration of animation
  opacity: number;
}

// Simple synthesizer for organic bubble pop sound effects
export function playBubblePopSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a dual oscillator "plop" style bubble burst sound
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    // Immediate pitch escalation mimicking a bubble burst (low to high snap)
    osc1.frequency.setValueAtTime(150, now);
    osc1.frequency.exponentialRampToValueAtTime(700, now + 0.12);

    osc2.frequency.setValueAtTime(320, now);
    osc2.frequency.exponentialRampToValueAtTime(950, now + 0.1);

    // Fade volume out quickly
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.16);
    osc2.stop(now + 0.16);
  } catch (err) {
    // Graceful mismatch fallback (e.g. browser context restrictions)
    console.debug("Web Audio blocked or not supported on this view browser tab.", err);
  }
}

interface BubbleFieldProps {
  bubbles: Bubble[];
  onPopBubble: (id: number) => void;
  soundEnabled: boolean;
}

export function BubbleField({ bubbles, onPopBubble, soundEnabled }: BubbleFieldProps) {
  const handlePop = (id: number) => {
    if (soundEnabled) {
      playBubblePopSound();
    }
    onPopBubble(id);
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            className="absolute cursor-pointer pointer-events-auto rounded-full group select-none"
            initial={{ y: "100vh", x: `${b.x}vw`, scale: 0.8, opacity: 0 }}
            animate={{
              y: "-12vh",
              x: [
                `${b.x}vw`,
                `${b.x + (b.id % 2 === 0 ? 3 : -3)}vw`,
                `${b.x + (b.id % 2 === 0 ? -2 : 2)}vw`,
                `${b.x}vw`
              ],
              scale: 1,
              opacity: b.opacity,
            }}
            exit={{
              scale: 2.2,
              opacity: 0,
              transition: { duration: 0.12 }
            }}
            transition={{
              y: { duration: b.speed, ease: "linear" },
              x: { duration: b.speed / 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.4 }
            }}
            onAnimationComplete={(definition) => {
              // Automatically remove when bubble reaches top of screen
              if (definition && (definition as any).y === "-12vh") {
                onPopBubble(b.id);
              }
            }}
            onClick={() => handlePop(b.id)}
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: 0,
              bottom: 0,
            }}
          >
            {/* Glossy SVG Bubble Design */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transition-transform group-hover:scale-110 active:scale-95 text-teal-400 opacity-80"
            >
              <defs>
                <radialGradient id="bubbleShine" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="20%" stopColor="#2dd4bf" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.1" />
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.6" />
                </radialGradient>
              </defs>
              {/* Outer boundary ring */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="url(#bubbleShine)"
                stroke="#a7f3d0"
                strokeWidth="1.5"
                strokeOpacity="0.8"
              />
              {/* Upper-left high speculative light highlight */}
              <ellipse
                cx="35"
                cy="32"
                rx="8"
                ry="4"
                transform="rotate(-30 35 32)"
                fill="white"
                opacity="0.8"
              />
              {/* Secondary lower-right subtle highlight ring */}
              <path
                d="M 22 70 A 30 30 0 0 0 74 72"
                fill="none"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
