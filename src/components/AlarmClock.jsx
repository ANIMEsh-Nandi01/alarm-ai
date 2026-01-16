import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function AlarmClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 drop-shadow-lg">
                {format(time, 'HH:mm')}
            </div>
            <div className="text-xl md:text-2xl font-light text-white/60 tracking-widest mt-2">
                {format(time, 'ss')} <span className="text-sm">sec</span>
            </div>
            <div className="text-sm font-medium text-white/40 uppercase tracking-[0.2em] mt-6">
                {format(time, 'EEEE, MMMM do')}
            </div>
        </div>
    );
}
