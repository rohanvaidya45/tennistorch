import { Flame } from 'lucide-react';

interface ResponseDisplayProps {
    response: string;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
    return (
        <div className="relative">
            {/* Tennis ball seam decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#e8e22c] rounded-full opacity-20"></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 border border-amber-200 rounded-full"></div>

            <div className="bg-gradient-to-br from-white via-white to-amber-50 rounded-lg shadow-sm p-6 border border-amber-100 relative overflow-hidden">
                {/* Court line decorations */}
                <div className="absolute top-0 left-0 w-full h-px bg-green-600/5"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-green-600/5"></div>
                <div className="absolute top-0 left-0 h-full w-px bg-green-600/5"></div>
                <div className="absolute top-0 right-0 h-full w-px bg-green-600/5"></div>

                <div className="flex items-start gap-3 relative">
                    <div className="flex-shrink-0 bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg shadow-md">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="prose prose-amber max-w-none">
                        {response.split('\n').map((paragraph, index) => (
                            <p key={index} className="text-slate-700 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 