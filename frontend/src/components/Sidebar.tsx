import { Flame, Trophy, Target, Book, ChevronRight, BarChart2, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Citation {
    id: number;
    winner: string;
    loser: string;
    score: string;
    date: string;
    tournament: string;
}

interface CitationPopoverProps {
    citation: Citation;
    isVisible: boolean;
    position: { x: number; y: number };
}

const CitationPopover: React.FC<CitationPopoverProps> = ({ citation, isVisible, position }) => {
    if (!isVisible) return null;

    return (
        <div
            className="absolute bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-200"
            style={{ top: position.y, left: position.x }}
        >
            <div className="text-sm">
                <div className="font-bold">{citation.tournament}</div>
                <div>{citation.date}</div>
                <div>
                    {citation.winner} def. {citation.loser}
                </div>
                <div>{citation.score}</div>
            </div>
        </div>
    );
};

export default function Sidebar() {
    return (
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center">
                    <div className="flex items-center gap-2.5">
                        <Flame
                            className="w-[32px] h-[32px]"
                            fill="#FF8A00"
                            stroke="none"
                        />
                        <div>
                            <span className="text-[18px] tracking-[-0.01em]">
                                <span className="text-slate-900 font-semibold">Tennis</span>
                                <span className="text-amber-500 font-bold">Torch</span>
                            </span>
                            <div className="text-[11px] text-slate-400 font-medium tracking-wider mt-0.5">
                                ILLUMINATING THE GAME
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-lg group transition-colors"
                        >
                            <item.icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-amber-500 transition-colors" />
                            {item.name}
                            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400" />
                        </Link>
                    ))}
                </div>
            </nav>

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

const navItems = [
    { name: 'Search', icon: Flame, href: '/' },
    { name: 'Techniques', icon: Target, href: '/techniques' },
    { name: 'Statistics', icon: BarChart2, href: '/stats' },
    { name: 'Library', icon: Book, href: '/library' },
    { name: 'Settings', icon: Settings, href: '/settings' },
]; 