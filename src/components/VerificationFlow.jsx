import React, { useState, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import { motion } from 'framer-motion';

export default function VerificationFlow({ onVerified, onFail }) {
    const [step, setStep] = useState(0); // 0 (Photo 1), 1 (Photo 2), 2 (Analyzing)
    const [capturedImages, setCapturedImages] = useState([]);

    const handleCapture = (photo) => {
        const newImages = [...capturedImages, photo];
        setCapturedImages(newImages);

        if (newImages.length === 2) {
            setStep(2); // Move to analyzing
        } else {
            setStep(1);
        }
    };

    // Simulate AI Analysis
    useEffect(() => {
        if (step === 2) {
            const timer = setTimeout(() => {
                // Mock success for now. In real app, compare 'capturedImages' with stored references.
                onVerified();
            }, 3000); // 3 seconds of "Scanning"
            return () => clearTimeout(timer);
        }
    }, [step, onVerified]);

    if (step === 2) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <div className="relative w-32 h-32 mb-6">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-cyan-500 rounded-full blur-xl" // Glow
                    />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-cyan-500 border-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                        🧠
                    </div>
                </div>
                <h2 className="text-2xl font-bold animate-pulse">AI Analyzing Environment</h2>
                <p className="text-white/60 mt-2">Matching with calibration data...</p>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-xl font-bold text-red-200 mb-2 uppercase tracking-widest animate-pulse">
                ALARM ACTIVE
            </h2>
            <p className="text-sm text-center text-white/80 mb-6">
                Take 2 distinct photos of your room to prove you are awake.
                <br />
                <span className="text-cyan-300 font-bold">Photo {step + 1}/2</span>
            </p>

            <CameraCapture
                onCapture={handleCapture}
                label="Verify with AI"
            />
        </div>
    );
}
