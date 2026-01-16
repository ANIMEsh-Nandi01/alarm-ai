import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function GlassCard({ children, className }) {
    return (
        <div
            className={twMerge(
                "glass-panel rounded-2xl p-6 border border-white/10 shadow-xl",
                className
            )}
        >
            {children}
        </div>
    );
}
