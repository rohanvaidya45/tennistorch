module.exports = {
    // ... other config
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 20s linear infinite',
                'tennis-bounce': 'tennis-bounce 1s ease-in-out infinite'
            },
            fontFamily: {
                'serif': ['Playfair Display', 'Georgia', 'serif'],
                'mono': ['Courier Prime', 'monospace'],
            },
            keyframes: {
                'tennis-bounce': {
                    '0%, 100%': {
                        transform: 'translateY(-15px) rotate(0deg)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
                    },
                    '50%': {
                        transform: 'translateY(0) rotate(180deg)',
                        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
                    }
                },
                'shadow-pulse': {
                    '0%, 100%': {
                        transform: 'translateX(-50%) scale(1)',
                        opacity: '0.3'
                    },
                    '50%': {
                        transform: 'translateX(-50%) scale(0.85)',
                        opacity: '0.1'
                    }
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                'tennis-bounce': 'tennis-bounce 1s ease-in-out infinite',
                'shadow-pulse': 'shadow-pulse 1s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out forwards'
            }
        }
    }
} 