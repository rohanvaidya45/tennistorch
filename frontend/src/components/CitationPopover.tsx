interface Position {
    x: number;
    y: number;
}

interface Citation {
    tournament: string;
    date: string;
    winner: string;
    loser: string;
    score: string;
}

interface CitationPopoverProps {
    citation: Citation;
    isVisible: boolean;
    position: Position;
}

export const CitationPopover: React.FC<CitationPopoverProps> = ({ citation, isVisible, position }) => {
    if (!isVisible) return null;

    return (
        <div
            className="fixed bg-white rounded-lg shadow-lg border border-slate-200 p-4 w-80 z-50"
            style={{ top: position.y + 'px', left: position.x + 'px' }}
        >
            <div className="text-sm space-y-2">
                <div className="font-medium text-slate-900">{citation.tournament}</div>
                <div className="text-slate-500">{citation.date}</div>
                <div className="flex justify-between">
                    <span className="text-emerald-600">{citation.winner}</span>
                    <span>def.</span>
                    <span className="text-slate-600">{citation.loser}</span>
                </div>
                <div className="text-center font-mono text-sm text-slate-700">{citation.score}</div>
            </div>
        </div>
    );
}; 