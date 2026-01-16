import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import GlassCard from './GlassCard';

const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user" // or "environment" for rear camera
};

export default function CameraCapture({ onCapture, label = "Take Photo" }) {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
        }
    }, [webcamRef]);

    const confirm = () => {
        onCapture(imgSrc);
        setImgSrc(null); // Reset for next use if needed, or parent handles unmounting
    };

    const retake = () => {
        setImgSrc(null);
    }

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square bg-black/50 rounded-2xl overflow-hidden border border-white/20 shadow-inner">
                {imgSrc ? (
                    <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex gap-4">
                {!imgSrc ? (
                    <button
                        onClick={capture}
                        className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/20"
                    >
                        {label}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={retake}
                            className="px-6 py-2 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all"
                        >
                            Retake
                        </button>
                        <button
                            onClick={confirm}
                            className="px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/30"
                        >
                            Confirm
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
