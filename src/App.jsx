import React, { useState, useEffect, useRef } from 'react';
import LiquidBackground from './components/LiquidBackground';
import GlassCard from './components/GlassCard';
import AlarmClock from './components/AlarmClock';
import SetupFlow from './components/SetupFlow';
import VerificationFlow from './components/VerificationFlow';
import { motion, AnimatePresence } from 'framer-motion';

// Simple alarm sound (beep)
const ALARM_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function App() {
  const [alarmTime, setAlarmTime] = useState(null); // Format: "HH:mm"
  const [referencePhotos, setReferencePhotos] = useState([]);
  const [appState, setAppState] = useState('IDLE'); // IDLE, SETUP, ALARM_SET, RINGING, VERIFYING

  const audioRef = useRef(new Audio(ALARM_SOUND_URL));

  // Alarm Checker
  useEffect(() => {
    // Configure audio loop
    audioRef.current.loop = true;

    const timer = setInterval(() => {
      if (appState === 'ALARM_SET' && alarmTime) {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // Simple check: if current time matches alarm time
        // Note: In a real app, you'd track if it already rang today to avoid re-triggering same minute.
        // For demo, we just trigger.
        if (currentTime === alarmTime) {
          triggerAlarm();
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [appState, alarmTime]);

  const triggerAlarm = () => {
    setAppState('RINGING');
    audioRef.current.play().catch(e => console.error("Audio play failed", e));
  };

  const stopAlarm = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setAppState('IDLE');
    setAlarmTime(null);
  };

  const handleSetupComplete = (photos) => {
    setReferencePhotos(photos);
    setAppState('IDLE'); // Go back to IDLE but now we "have" photos (in memory)
    // In real app, save to localStorage
  };

  const handleSetAlarm = (e) => {
    setAlarmTime(e.target.value);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center text-white overflow-hidden font-sans">
      <LiquidBackground />

      <main className="z-10 w-full max-w-md p-4 flex flex-col gap-6">

        {/* Header / Brand */}
        <motion.div layout className="flex justify-center">
          <GlassCard className="py-2 px-6 rounded-full border-white/5">
            <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-70">
              Liquid AI
            </span>
          </GlassCard>
        </motion.div>

        {/* Clock Display */}
        <GlassCard className={`flex flex-col items-center transition-all duration-500 ${appState === 'RINGING' ? 'border-red-500/50 shadow-red-500/20 shadow-2xl scale-105' : ''}`}>
          <AlarmClock />
          {alarmTime && appState === 'ALARM_SET' && (
            <div className="mt-2 text-cyan-300 text-sm font-medium">
              Alarm set for {alarmTime}
            </div>
          )}
        </GlassCard>

        {/* Dynamic Content Area */}
        <AnimatePresence mode='wait'>
          {appState === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassCard className="flex flex-col gap-4">
                {referencePhotos.length === 0 ? (
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Calibration Required</h3>
                    <p className="text-sm opacity-60 mb-4">Set up your room profile to enable AI verification.</p>
                    <button
                      onClick={() => setAppState('SETUP')}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                      Start Calibration
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <label className="text-sm opacity-70 ml-1">Set Wake Up Time</label>
                    <input
                      type="time"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-2xl text-center focus:outline-none focus:border-cyan-500/50 transition-colors"
                      onChange={handleSetAlarm}
                      value={alarmTime || ""}
                    />
                    <button
                      disabled={!alarmTime}
                      onClick={() => setAppState('ALARM_SET')}
                      className="w-full py-4 bg-white text-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Activate Alarm
                    </button>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {appState === 'SETUP' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <GlassCard>
                <SetupFlow
                  onComplete={handleSetupComplete}
                  onCancel={() => setAppState('IDLE')}
                />
              </GlassCard>
            </motion.div>
          )}

          {appState === 'ALARM_SET' && (
            <motion.div
              key="alarm-set"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 flex items-center justify-center mb-4 animate-pulse">
                  <div className="w-12 h-12 bg-cyan-500 rounded-full blur-md opacity-50" />
                </div>
                <h3 className="text-xl font-light">Monitoring Sleep</h3>
                <p className="text-sm opacity-50 mt-2">AI is watching over you...</p>
                <button
                  onClick={() => {
                    setAlarmTime(null);
                    setAppState('IDLE');
                  }}
                  className="mt-8 text-sm text-white/40 hover:text-white transition-colors"
                >
                  Cancel Alarm
                </button>
              </GlassCard>
            </motion.div>
          )}

          {(appState === 'RINGING' || appState === 'VERIFYING') && (
            <motion.div
              key="ringing"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full"
            >
              <GlassCard className="border-red-500/30 bg-red-500/5">
                {appState === 'RINGING' ? (
                  <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-white mb-2 animate-bounce">WAKE UP</h1>
                    <p className="text-red-200 mb-6">Verification Required to Stop</p>
                    <button
                      onClick={() => setAppState('VERIFYING')}
                      className="w-full py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/40 hover:bg-red-600 transition-colors"
                    >
                      I am Awake (Verify)
                    </button>
                  </div>
                ) : (
                  <VerificationFlow
                    onVerified={stopAlarm}
                    onFail={() => alert("Verification Failed! Try again.")}
                  />
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
