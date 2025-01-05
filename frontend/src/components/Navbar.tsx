export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-slate-100 z-50">
            <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <span className="font-light tracking-widest text-slate-900">TENNIS</span>
                    <span className="font-medium tracking-widest text-slate-900">TORCH</span>
                </div>

                <div className="flex items-center space-x-8 text-sm">
                    <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Index</a>
                    <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Search</a>
                    <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
                </div>
            </div>
        </nav>
    );
} 