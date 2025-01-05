import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

interface QueryInputProps {
    onSubmit: (question: string) => void;
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
}

export default function QueryInput({ onSubmit, disabled, value, onChange }: QueryInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    // Update internal state when value prop changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSubmit(inputValue);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    return (
        <form onSubmit={handleSubmit} className="relative group">
            {/* Glow effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-green-500 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500 ${isFocused ? 'opacity-20' : ''}`} />

            <div className="relative bg-white shadow-xl rounded-lg">
                <div className="flex items-center px-4 py-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask about tennis history"
                        className="w-full bg-transparent text-lg text-slate-900 placeholder-slate-400 focus:outline-none"
                        disabled={disabled}
                    />
                    <button
                        type="submit"
                        disabled={disabled || !inputValue.trim()}
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md flex items-center gap-2 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {disabled ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Illuminating</span>
                            </div>
                        ) : (
                            <>
                                <span>Ask</span>
                                <Flame className="w-4 h-4 text-white" />
                            </>
                        )}
                    </button>
                </div>

                {/* Tennis ball seam decoration */}
                <div className="absolute left-0 right-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
            </div>
        </form>
    );
} 