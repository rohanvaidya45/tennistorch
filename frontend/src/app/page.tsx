'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Target, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import QueryInput from '@/components/QueryInput';
import Sidebar from '@/components/Sidebar';
import { Citation } from '@/components/Citation';
import QueryHistory from '@/components/QueryHistory';
import { getTournamentLevelName, getCountryDisplay, getSurfaceStyles } from './utils';

// Add new type definitions for the backend response
interface Match {
    match_id: string;
    description: string;
    tournament_name: string;
    tournament_level: string;
    tournament_country: string;
    surface: string;
    round: string;
    winner_name: string;
    winner_country: string;
    loser_name: string;
    loser_country: string;
    score: string;
    similarity: number;
}

interface QueryResponse {
    matches: Match[];
    analysis: string;
    response: string;
}

const MAX_HISTORY = 5; // Maximum number of queries to keep in history

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [response, setResponse] = useState<QueryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [activeCitation, setActiveCitation] = useState<number | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [queryHistory, setQueryHistory] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true on mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Initialize query history from localStorage after component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('queryHistory');
            if (saved) {
                setQueryHistory(JSON.parse(saved));
            }
        }
    }, []);

    // Load initial query from URL if present
    useEffect(() => {
        const queryParam = searchParams.get('q');
        if (queryParam && queryParam !== currentQuestion) {
            setCurrentQuestion(queryParam);
            handleQuery(queryParam);
        }
    }, [searchParams]);

    // Save query history to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
        }
    }, [queryHistory]);

    const addToHistory = (question: string) => {
        setQueryHistory(prev => {
            const filtered = prev.filter(q => q !== question); // Remove if exists
            return [question, ...filtered].slice(0, MAX_HISTORY); // Add to front and limit size
        });
    };

    const handleQuery = async (question: string) => {
        // Update URL with the new query
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('q', question);
        router.push(`/?${newSearchParams.toString()}`, { scroll: false });

        // Update the current question and history
        setCurrentQuestion(question);
        addToHistory(question);

        // Clear previous response, error, and citation state
        setResponse(null);
        setError(null);
        setActiveCitation(null); // Reset active citation
        setMatches([]); // Clear matches
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: question }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await res.json();
            setResponse({
                matches: data.matches || [],
                analysis: data.analysis || '',
                response: data.response || '',
            });
            setMatches(data.matches || []);
        } catch (err) {
            setError('Failed to fetch response');
            console.error('Error fetching response:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCitationClick = (citationNumber: number, event: React.MouseEvent) => {
        event.preventDefault();
        setActiveCitation(citationNumber === activeCitation ? null : citationNumber);

        // Scroll to the corresponding match card if it exists
        if (citationNumber <= matches.length) {
            const matchElements = document.querySelectorAll('.match-card');
            const matchElement = matchElements[citationNumber - 1];
            if (matchElement) {
                matchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const renderResponseWithCitations = (text: string) => {
        // Split the text by citation markers [n]
        const parts = text.split(/(\[\d+\])/g);

        return parts.map((part, index) => {
            // Check if this part is a citation
            const citationMatch = part.match(/\[(\d+)\]/);
            if (citationMatch) {
                const citationNumber = parseInt(citationMatch[1]);
                return (
                    <Citation
                        key={index}
                        number={citationNumber}
                        onClick={(e) => handleCitationClick(citationNumber, e)}
                        isActive={activeCitation === citationNumber}
                    />
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    // Update the match card component to handle click events
    const MatchCard = ({ match, index }: { match: Match; index: number }) => {
        const isHighlighted = activeCitation === index + 1;

        const handleMatchClick = () => {
            setActiveCitation(isHighlighted ? null : index + 1);
        };

        const dateMatch = match.description.match(/\d{8}/);
        let formattedDate = '';
        if (dateMatch) {
            const dateStr = dateMatch[0];
            const date = new Date(
                parseInt(dateStr.substring(0, 4)),
                parseInt(dateStr.substring(4, 6)) - 1,
                parseInt(dateStr.substring(6, 8))
            );
            formattedDate = date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }

        return (
            <div
                onClick={handleMatchClick}
                className={`
                    pt-4 first:pt-0 group rounded-lg transition-all duration-300 p-4 
                    ${getSurfaceStyles(match.surface)}
                    ${isHighlighted ? 'ring-2 ring-emerald-500 scale-[1.02] shadow-lg' : ''}
                    hover:scale-[1.01] hover:shadow-lg
                    cursor-pointer
                `}
            >
                {/* Tournament Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {match.tournament_country && (
                            <div className="font-mono text-xs px-2 py-1 bg-white/70 backdrop-blur-sm rounded-md border border-emerald-900/5 
                                shadow-sm transition-all duration-300 group-hover:bg-white/90">
                                {getCountryDisplay(match.tournament_country)}
                            </div>
                        )}
                        <div>
                            <div className="font-serif text-emerald-900 text-lg transition-colors duration-300 
                                group-hover:text-emerald-800">{match.tournament_name}</div>
                            <div className="text-xs text-emerald-600/90 font-serif tracking-wide">
                                {getTournamentLevelName(match.tournament_level)} • {match.surface} • {match.round}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm font-mono text-emerald-800/90 bg-white/40 px-3 py-1 rounded-full 
                        backdrop-blur-sm border border-emerald-900/5">{formattedDate}</div>
                </div>

                {/* Match Result */}
                <div className="bg-white/50 backdrop-blur-sm rounded-md p-3 mt-2 border border-emerald-900/5">
                    <div className="flex items-center justify-between">
                        {/* Winner */}
                        <div className="flex items-center gap-3">
                            {match.winner_country && (
                                <div className="font-mono text-xs px-2 py-1 bg-emerald-100/50 rounded">
                                    {getCountryDisplay(match.winner_country)}
                                </div>
                            )}
                            <div>
                                <div className="font-medium text-emerald-900">{match.winner_name}</div>
                                <div className="text-xs text-emerald-600">Winner</div>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="font-mono text-emerald-800 px-4">{match.score}</div>

                        {/* Loser */}
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="font-medium text-emerald-700 text-right">{match.loser_name}</div>
                                <div className="text-xs text-emerald-600 text-right">Loser</div>
                            </div>
                            {match.loser_country && (
                                <div className="font-mono text-xs px-2 py-1 bg-slate-100/50 rounded">
                                    {getCountryDisplay(match.loser_country)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/10 to-slate-50">
            <Sidebar />

            {/* Enhanced decorative elements */}
            <div className="fixed top-0 left-64 right-0 h-1 bg-emerald-900/10"></div>
            <div className="fixed top-1 left-64 right-0 h-16 bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm border-b border-emerald-900/5">
                {/* Add subtle tennis pattern */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,#065f46_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <main className="ml-64 min-h-screen relative">
                {/* Enhanced court lines */}
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#065f46_1px,transparent_1px),linear-gradient(to_bottom,#065f46_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-emerald-900/5"></div>
                <div className="absolute top-0 bottom-0 right-0 w-px bg-emerald-900/5"></div>

                <div className="max-w-4xl mx-auto px-8 py-12">
                    {/* Enhanced Hero Section */}
                    <div className="mb-16 relative">
                        {/* Decorative tennis ball */}
                        <div className="absolute -top-6 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-[#ccf841] to-[#b0d534] opacity-10 blur-2xl"></div>

                        <h1 className="text-5xl font-serif text-emerald-950 tracking-tight mb-6 flex items-center gap-4">
                            Tennis History Explorer
                            <span className="text-emerald-800/70 font-serif italic text-2xl">est. 2025</span>
                        </h1>

                        {/* Enhanced Feature badges */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-900/10 text-emerald-900 px-5 py-2.5 rounded-md text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white">
                                <Trophy className="w-4 h-4" />
                                <span className="font-serif">Match Archives</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-900/10 text-emerald-900 px-5 py-2.5 rounded-md text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white">
                                <Target className="w-4 h-4" />
                                <span className="font-serif">Intelligent Insights</span>
                            </div>
                        </div>

                        <p className="text-emerald-800 relative z-10 text-lg font-serif leading-relaxed max-w-2xl mb-8">
                            Discover the distinguished history of tennis through our comprehensive knowledge base of every single professional ATP match played in the Open Era.
                        </p>

                        {/* Query History */}
                        <QueryHistory queries={queryHistory} onSelectQuery={handleQuery} />

                        {/* Query Input with restored styling */}
                        <div className="relative backdrop-blur-sm bg-white/50 rounded-xl p-1 border border-emerald-900/10 
                            shadow-lg hover:shadow-xl transition-all duration-300">
                            <QueryInput
                                onSubmit={handleQuery}
                                disabled={loading}
                                value={currentQuestion}
                                onChange={setCurrentQuestion}
                            />
                        </div>
                    </div>

                    {/* Enhanced Query Section */}
                    <div className="space-y-8 relative">
                        {/* Enhanced decorative elements */}
                        <div className="absolute -left-12 top-1/2 w-20 h-20 rounded-full bg-emerald-100/20 blur-2xl animate-pulse"></div>
                        <div className="absolute -right-12 bottom-0 w-32 h-32 rounded-full bg-emerald-50/30 blur-3xl animate-pulse"></div>

                        {/* Tennis ball pattern background */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#065f46_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        </div>

                        {loading && <LoadingState />}
                        {error && (
                            <div className="mt-4 text-sm text-red-900 bg-red-50/50 p-6 rounded-md border border-red-200 font-serif backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        {/* Enhanced Response Section */}
                        {response && (
                            <div className="space-y-6">
                                {response.response && (
                                    <>
                                        {/* Tennis Torch Header */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <Flame className="w-6 h-6 text-emerald-700" />
                                            <h2 className="text-xl font-semibold text-emerald-900">Tennis Torch</h2>
                                        </div>
                                        <div className="prose prose-emerald max-w-none">
                                            {renderResponseWithCitations(response.response)}
                                        </div>
                                    </>
                                )}

                                {matches.length > 0 && (
                                    <>
                                        {/* Match Records Header */}
                                        <div className="flex items-center gap-2 mt-8 mb-4">
                                            <CheckCircle className="w-6 h-6 text-emerald-700" />
                                            <h2 className="text-xl font-semibold text-emerald-900">Match Records</h2>
                                        </div>
                                        <div className="space-y-4">
                                            {matches.map((match, index) => (
                                                <MatchCard
                                                    key={match.match_id}
                                                    match={match}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Enhanced LoadingState component
const LoadingState = () => (
    <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4 relative backdrop-blur-sm p-8 bg-white/50 rounded-lg border border-emerald-900/10 shadow-lg">
            {/* Bouncing tennis ball with shadow */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <div className="relative">
                    {/* Shadow element */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-md animate-[shadow-pulse_1s_ease-in-out_infinite]" />

                    {/* Tennis ball */}
                    <div className={`
                        w-10 h-10 rounded-full 
                        bg-[#c0d82f]
                        shadow-lg relative 
                        animate-[tennis-bounce_1s_ease-in-out_infinite]
                        before:content-[''] before:absolute before:inset-0 
                        before:rounded-full
                        before:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_5%,transparent_25%)]
                        after:content-[''] after:absolute after:inset-0 
                        after:rounded-full
                        after:bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='none' viewBox='0 0 100 100'%3E%3Cpath stroke='rgba(255,255,255,0.7)' stroke-width='2.5' d='M25,50 C25,25 45,15 50,15 C55,15 75,25 75,50 C75,75 55,85 50,85 C45,85 25,75 25,50' /%3E%3C/svg%3E")]
                        after:bg-[length:100%_100%]
                        after:mix-blend-overlay
                    `}>
                        {/* Tennis ball fuzz texture */}
                        <div className={`
                            absolute inset-0 rounded-full
                            bg-[url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")]
                            opacity-[0.15]
                            mix-blend-overlay
                            before:content-[''] before:absolute before:inset-0 
                            before:rounded-full
                            before:bg-[radial-gradient(circle_at_65%_65%,transparent_50%,rgba(0,0,0,0.2)_70%,transparent_80%)]
                            after:content-[''] after:absolute after:inset-0 
                            after:rounded-full
                            after:bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='none' viewBox='0 0 100 100'%3E%3Cpath stroke='rgba(0,0,0,0.15)' stroke-width='2' d='M25,50 C25,25 45,15 50,15 C55,15 75,25 75,50 C75,75 55,85 50,85 C45,85 25,75 25,50' /%3E%3C/svg%3E")]
                            after:bg-[length:100%_100%]
                            after:rotate-90
                        `} />
                    </div>
                </div>
            </div>

            {/* Pulse lines */}
            <div className="space-y-3 pl-4">
                <div className="h-4 bg-gradient-to-r from-emerald-100/70 to-emerald-50/70 rounded-full w-3/4" />
                <div className="h-4 bg-gradient-to-r from-emerald-100/70 to-emerald-50/70 rounded-full" />
                <div className="h-4 bg-gradient-to-r from-emerald-100/70 to-emerald-50/70 rounded-full w-5/6" />
            </div>
        </div>
    </div>
); 