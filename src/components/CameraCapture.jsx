import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, SwitchCamera } from 'lucide-react';
import GlassCard from './GlassCard';

export default function CameraCapture({ onCapture, label = "Take Photo" }) {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [facingMode, setFacingMode] = useState("user"); // "user" or "environment"

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
        }
    }, [webcamRef]);

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    const confirm = () => {
        onCapture(imgSrc);
        setImgSrc(null);
    };

    const retake = () => {
        setImgSrc(null);
    }

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: facingMode
    };

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square bg-black/50 rounded-2xl overflow-hidden border border-white/20 shadow-inner">
                {imgSrc ? (
                    <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <Webcam
                            key={facingMode}
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="w-full h-full object-cover"
                            forceScreenshotSourceSize={true}
                            mirrored={facingMode === "user"}
                        />
                        <button
                            onClick={toggleCamera}
                            className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all border border-white/10 z-10"
                        >
                            <SwitchCamera size={24} />
                        </button>
                    </>
                )}
            </div>

            <div className="flex gap-4 w-full justify-center">
                {!imgSrc ? (
                    <button
                        onClick={capture}
                        className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/20 flex items-center justify-center gap-2"
                    >
                        <Camera size={20} />
                        {label}
                    </button>
                ) : (
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={retake}
                            className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                        >
                            Retake
                        </button>
                        <button
                            onClick={confirm}
                            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/30"
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
