export interface Match {
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

export interface QueryResponse {
    matches: Match[];
    analysis: string;
    response: string;
} 