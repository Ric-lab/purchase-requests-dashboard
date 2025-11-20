"use client";

import { cn } from "@/lib/utils";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel?: string;
    backButtonHref?: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
}: CardWrapperProps) => {
    return (
        <div className="w-[400px] shadow-2xl rounded-3xl bg-white/60 backdrop-blur-xl border border-white/20 p-8 flex flex-col gap-6 relative overflow-hidden">
            {/* Subtle glare effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-y-4">
                <h1 className="text-3xl font-semibold text-neutral-800 drop-shadow-sm tracking-tight">
                    Auth
                </h1>
                <p className="text-neutral-500 text-sm">
                    {headerLabel}
                </p>
            </div>
            <div className="relative z-10">
                {children}
            </div>
            {backButtonLabel && backButtonHref && (
                <div className="relative z-10 flex items-center justify-center w-full">
                    <a href={backButtonHref} className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
                        {backButtonLabel}
                    </a>
                </div>
            )}
        </div>
    );
};
