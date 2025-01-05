import { History, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QueryHistoryProps {
    queries: string[];
    onSelectQuery: (query: string) => void;
}

export default function QueryHistory({ queries, onSelectQuery }: QueryHistoryProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || queries.length === 0) return null;

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-emerald-900/10 p-4 mb-6">
            <div className="flex items-center gap-2 text-emerald-900/70 mb-3">
                <History className="w-4 h-4" />
                <span className="text-sm font-medium">Recent Queries</span>
            </div>
            <div className="space-y-2">
                {queries.map((query, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectQuery(query)}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-emerald-50 text-sm text-emerald-800 transition-colors group"
                    >
                        <Clock className="w-4 h-4 text-emerald-400 group-hover:text-emerald-500" />
                        {query}
                    </button>
                ))}
            </div>
        </div>
    );
}
