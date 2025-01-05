import { Flame } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center">
                    <div className="flex items-center space-x-3.5 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <Flame
                                className="w-10 h-10 transform group-hover:scale-110 transition-all duration-300 ease-out relative"
                                fill="url(#logo-gradient)"
                                stroke="none"
                            />
                            <svg className="absolute" width="0" height="0">
                                <defs>
                                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#059669" />
                                        <stop offset="50%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#34d399" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl tracking-tight leading-none">
                                <span className="font-bold text-slate-800 drop-shadow-sm">Tennis</span>
                                <span className="bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-500 bg-clip-text text-transparent font-extrabold">Torch</span>
                            </span>
                            <div className="text-[10px] text-slate-400 font-semibold tracking-[0.25em] mt-2.5 pl-0.5 group-hover:text-emerald-500 transition-colors duration-300">
                                ILLUMINATING THE GAME
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1">
                {/* Grand Slams Section */}
                <div className="p-4">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                        Grand Slams
                    </div>
                    <div className="space-y-2 bg-slate-50/50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                            <span className="text-lg w-7 flex justify-center">🇦🇺</span>
                            <span className="text-slate-600 text-sm">Australian Open</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-lg w-7 flex justify-center">🇫🇷</span>
                            <span className="text-slate-600 text-sm">French Open</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-lg w-7 flex justify-center">🇬🇧</span>
                            <span className="text-slate-600 text-sm">Wimbledon</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-lg w-7 flex justify-center">🇺🇸</span>
                            <span className="text-slate-600 text-sm">US Open</span>
                        </div>
                    </div>
                </div>

                {/* Court Surfaces Section */}
                <div className="p-4">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                        Court Surfaces
                    </div>
                    <div className="space-y-2 bg-slate-50/50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                            <span className="text-slate-600 text-sm">Clay</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="text-slate-600 text-sm">Hard</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="text-slate-600 text-sm">Grass</span>
                        </div>
                    </div>
                </div>

                {/* Rounds Section */}
                <div className="p-4">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                        Rounds
                    </div>
                    <div className="space-y-2 bg-slate-50/50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 rounded">F</div>
                            <span className="text-slate-600 text-sm">Finals</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 rounded">SF</div>
                            <span className="text-slate-600 text-sm">Semi Finals</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 rounded">QF</div>
                            <span className="text-slate-600 text-sm">Quarter Finals</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 rounded">R16</div>
                            <span className="text-slate-600 text-sm">Round of 16</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 rounded">R32</div>
                            <span className="text-slate-600 text-sm">Round of 32</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 rounded">R64</div>
                            <span className="text-slate-600 text-sm">Round of 64</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 rounded">R128</div>
                            <span className="text-slate-600 text-sm">Round of 128</span>
                        </div>
                    </div>
                </div>
            </div>

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