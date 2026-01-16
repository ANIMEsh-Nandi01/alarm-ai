import React, { useState, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import { motion } from 'framer-motion';
import { verifyEnvironment } from '../services/aiService';

export default function VerificationFlow({ referencePhotos, onVerified, onFail }) {
    const [step, setStep] = useState(0); // 0 (Photo 1), 1 (Photo 2), 2 (Analyzing)
    const [capturedImages, setCapturedImages] = useState([]);
    const [statusMsg, setStatusMsg] = useState("Matching with calibration data...");
    const [apiKey, setApiKey] = useState("");
    const [needsKey, setNeedsKey] = useState(false);

    const handleCapture = (photo) => {
        const newImages = [...capturedImages, photo];
        setCapturedImages(newImages);

        if (newImages.length === 2) {
            setStep(2); // Move to analyzing
        } else {
            setStep(1);
        }
    };

    // Real AI Analysis
    useEffect(() => {
        async function analyze() {
            if (!import.meta.env.VITE_GEMINI_API_KEY && !apiKey) {
                setNeedsKey(true);
                return;
            }

            setStatusMsg("Consulting AI...");
            const result = await verifyEnvironment(referencePhotos, capturedImages, apiKey);

            if (result.match) {
                setStatusMsg("Environment Verified!");
                setTimeout(() => {
                    onVerified();
                }, 1000);
            } else {
                setStatusMsg("Verification Failed: " + (result.reason || "Room mismatch"));
                setTimeout(() => {
                    onFail();
                    // Reset to try again
                    setStep(0);
                    setCapturedImages([]);
                }, 3000);
            }
        }

        if (step === 2) {
            analyze();
        }
    }, [step, referencePhotos, capturedImages, apiKey, onVerified, onFail]);

    if (step === 2) {
        return (
            <div className="flex flex-col items-center justify-center py-10 w-full">
                {needsKey ? (
                    <div className="flex flex-col items-center w-full">
                        <p className="text-red-300 mb-2 text-center text-sm">Missing API Key</p>
                        <input
                            type="password"
                            placeholder="Enter Gemini API Key"
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-sm text-center mb-2"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <button
                            onClick={() => setNeedsKey(false)}
                            className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-bold"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
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
                        <h2 className="text-xl font-bold animate-pulse text-center">AI Analysis</h2>
                        <p className="text-white/60 mt-2 text-center text-sm px-4">{statusMsg}</p>
                    </>
                )}
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
