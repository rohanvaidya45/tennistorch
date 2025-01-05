import { Flame } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center">
                    <div className="flex items-center space-x-3.5 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <Flame
                                className="w-10 h-10 transform group-hover:scale-110 transition-all duration-300 ease-out relative"
                                fill="url(#logo-gradient)"
                                stroke="none"
                            />
                            <svg className="absolute" width="0" height="0">
                                <defs>
                                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FF8A00" />
                                        <stop offset="50%" stopColor="#FFA53D" />
                                        <stop offset="100%" stopColor="#FFB366" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl tracking-tight leading-none">
                                <span className="font-bold text-slate-800 drop-shadow-sm">Tennis</span>
                                <span className="bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-extrabold">Torch</span>
                            </span>
                            <div className="text-[10px] text-slate-400 font-semibold tracking-[0.25em] mt-2.5 pl-0.5 group-hover:text-amber-500 transition-colors duration-300">
                                ILLUMINATING THE GAME
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Stats Section */}
            <div className="p-4 border-t border-slate-200">
                <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                        Knowledge Base
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <div className="text-slate-900 font-medium">191,997</div>
                            <div className="text-slate-500">Tennis Matches</div>
                        </div>
                        <div>
                            <div className="text-slate-900 font-medium">1968-2024</div>
                            <div className="text-slate-500">Years</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 