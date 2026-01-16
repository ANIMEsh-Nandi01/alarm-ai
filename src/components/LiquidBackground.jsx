import React from 'react';
import { motion } from 'framer-motion';

export default function LiquidBackground() {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-slate-900">
            {/* Blob 1 */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.2, 0.8, 1],
                    rotate: [0, 120, 240, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.33, 0.66, 1]
                }}
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
            />

            {/* Blob 2 */}
            <motion.div
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, 100, -50, 0],
                    scale: [1, 1.1, 0.9, 1],
                    rotate: [0, -120, -240, -360],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.33, 0.66, 1]
                }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
            />

            {/* Blob 3 */}
            <motion.div
                animate={{
                    x: [0, 50, -100, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 1.3, 0.7, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.33, 0.66, 1]
                }}
                className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
            />

            {/* Overlay for subtle noise/texture if desired in future */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />
        </div>
    );
}
