export interface TennisResponse {
    answer: string;
    sources: Array<{
        title: string;
        url: string;
        confidence: number;
    }>;
    confidence_score: number;
} 