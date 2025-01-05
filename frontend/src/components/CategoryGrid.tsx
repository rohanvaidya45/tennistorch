import { ArrowRight } from 'lucide-react';

const categories = [
    {
        label: '01 / Technique',
        title: 'Stroke Analysis',
        description: 'Detailed breakdown of fundamental tennis strokes with frame-by-frame analysis and improvement tips.'
    },
    {
        label: '02 / Strategy',
        title: 'Game Planning',
        description: 'Learn to construct points effectively and develop winning strategies for different play styles.'
    },
    {
        label: '03 / Training',
        title: 'Practice System',
        description: 'Structured training programs designed to improve specific aspects of your tennis game.'
    },
    {
        label: '04 / Mental',
        title: 'Performance',
        description: 'Develop mental toughness and learn techniques for maintaining focus during crucial moments.'
    },
    {
        label: '05 / Analysis',
        title: 'Match Review',
        description: 'Advanced statistics and tactical analysis of professional matches and playing patterns.'
    },
    {
        label: '06 / Equipment',
        title: 'Gear Guide',
        description: 'Expert recommendations on tennis equipment selection and customization.'
    }
];

export default function CategoryGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
                <div key={index} className="group cursor-pointer">
                    <div className="aspect-square bg-white border border-slate-200 p-8 hover:border-slate-900 transition-colors">
                        <div className="h-full flex flex-col justify-between">
                            <div>
                                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                                    {category.label}
                                </p>
                                <h3 className="text-xl font-light text-slate-900 mb-4">
                                    {category.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 