export interface TennisResponse {
    matches: {
        match_id: string;
        description: string;
        tournament_name: string;
        tournament_level: string;
        surface: string;
        round: string;
        winner_name: string;
        score: string;
        similarity: number;
    }[];
    analysis: string;
    response: string;
}