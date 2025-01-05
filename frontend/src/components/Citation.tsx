import React from 'react';
import { motion } from 'framer-motion';

interface CitationProps {
    number: number;
    onClick: (event: React.MouseEvent) => void;
    isActive: boolean;
}

export const Citation: React.FC<CitationProps> = ({ number, onClick, isActive }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        inline-flex items-center justify-center
        w-5 h-5 text-xs font-medium
        rounded-full mx-0.5
        transition-colors duration-200
        ${isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }
      `}
        >
            {number}
        </motion.button>
    );
}; 