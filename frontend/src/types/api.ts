interface Citation {
    id: number;
    winner: string;
    loser: string;
    score: string;
    date: string;
    tournament: string;
}

interface ChatResponse {
    text: string;
    citations: Citation[];
} 