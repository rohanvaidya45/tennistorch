import { useState, useEffect } from 'react';
import { Sparkles, History, Trophy, TrendingUp, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface QuestionSuggestionsProps {
    onSelectQuestion: (question: string) => void;
}

type CategoryKey = 'Head-to-Head' | 'Historical' | 'Statistics' | 'Analysis';

const categories: Record<CategoryKey, string[]> = {
    'Head-to-Head': [
        "Compare Nadal and Federer's performance on clay courts from 2005-2010",
        "What's the head-to-head record between Djokovic and Murray at Grand Slams?",
        "Show me matches where Federer beat Nadal on grass",
    ],
    'Historical': [
        "When did Federer first reach World No. 1?",
        "Which era had the most competitive matches?",
        "Has the average match duration changed since 2000?",
    ],
    'Statistics': [
        "What's the average number of tiebreaks in Wimbledon finals?",
        "Who are the top 5 performers at the Australian Open in the last decade?",
        "Which surface has produced the most five-set matches?",
    ],
    'Analysis': [
        "Analyze the 2008 Wimbledon final between Federer and Nadal",
        "What were the key statistics in the 2019 US Open final?",
        "Show me the closest matches between Djokovic and Nadal",
    ],
};

const categoryIcons: Record<CategoryKey, React.ElementType> = {
    'Head-to-Head': Users,
    'Historical': History,
    'Statistics': TrendingUp,
    'Analysis': Trophy,
};

export default function QuestionSuggestions({ onSelectQuestion }: QuestionSuggestionsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('Head-to-Head');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setIsAnimating(false);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeCategory]);

    const handleQuestionSelect = (question: string) => {
        const newSearchParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
            newSearchParams.set(key, value);
        });
        newSearchParams.set('q', question);
        router.push(`/?${newSearchParams.toString()}`, { scroll: false });
        onSelectQuestion(question);
    };

    return (
        <div className="mt-8">
            {/* Category Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-slate-200">
                {(Object.entries(categories) as [CategoryKey, string[]][]).map(([category, _]) => {
                    const Icon = categoryIcons[category];
                    return (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${activeCategory === category
                                ? 'text-amber-500 border-b-2 border-amber-500'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {category}
                        </button>
                    );
                })}
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories[activeCategory].map((question, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuestionSelect(question)}
                        className={`text-left p-4 bg-white border border-slate-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all text-sm text-slate-600 hover:text-slate-900 group ${isAnimating ? 'opacity-0' : 'opacity-100'
                            }`}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>{question}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Hint Text */}
            <div className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3" />
                <span>Click any question to get instant analysis</span>
            </div>
        </div>
    );
} 