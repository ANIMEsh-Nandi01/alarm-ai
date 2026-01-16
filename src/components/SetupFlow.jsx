import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import { motion } from 'framer-motion';

export default function SetupFlow({ onComplete, onCancel }) {
    const [step, setStep] = useState(0); // 0, 1, 2 for the 3 photos
    const [photos, setPhotos] = useState([]);

    const handleCapture = (photo) => {
        const newPhotos = [...photos, photo];
        if (newPhotos.length === 3) {
            setPhotos(newPhotos);
            onComplete(newPhotos);
        } else {
            setPhotos(newPhotos);
            setStep(step + 1);
        }
    };

    const angles = [
        "Angle 1: Straight at your bed",
        "Angle 2: From the door",
        "Angle 3: From your desktop/side table"
    ];

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200">
                    Calibration ({step + 1}/3)
                </h2>
                <button onClick={onCancel} className="text-xs text-white/50 hover:text-white">Cancel</button>
            </div>

            <p className="text-sm text-center text-white/80 mb-6">
                {angles[step]}
            </p>

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
            >
                <CameraCapture
                    onCapture={handleCapture}
                    label={step === 2 ? "Finish Setup" : "Next Angle"}
                />
            </motion.div>

            <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-cyan-500' : 'bg-white/10'}`}
                    />
                ))}
            </div>
        </div>
    );
}
