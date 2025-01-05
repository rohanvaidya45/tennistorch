export const getTournamentLevelName = (level: string): string => {
    const levelMap: { [key: string]: string } = {
        'G': 'Grand Slam',
        'M': 'Masters 1000',
        'F': 'Tour Finals',
        'A': 'ATP 500',
        'B': 'ATP 250',
        'D': 'Davis Cup'
    };
    return levelMap[level] || level;
};

export const getCountryDisplay = (countryCode: string): string => {
    if (!countryCode) return '';
    return countryCode.toUpperCase();
};

export const getSurfaceStyles = (surface: string): string => {
    const surfaceMap: { [key: string]: string } = {
        'Hard': 'bg-gradient-to-b from-blue-500/5 to-blue-600/5 border border-blue-900/10 hover:from-blue-500/10 hover:to-blue-600/10',
        'Clay': 'bg-gradient-to-b from-orange-600/5 to-orange-700/5 border border-orange-900/10 hover:from-orange-600/10 hover:to-orange-700/10',
        'Grass': 'bg-gradient-to-b from-emerald-500/5 to-emerald-600/5 border border-emerald-900/10 hover:from-emerald-500/10 hover:to-emerald-600/10',
        'Carpet': 'bg-gradient-to-b from-slate-200/50 to-slate-300/50 border border-slate-400/20 hover:from-slate-200/60 hover:to-slate-300/60',
    };
    return `${surfaceMap[surface] || 'bg-white/90 border border-slate-200/20'} transition-all duration-300`;
}; 