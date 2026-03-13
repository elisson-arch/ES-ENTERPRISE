import React from 'react';
import { motion } from 'framer-motion';
import { theme2026 } from '@shared/config/theme';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: boolean;
}

export const PremiumCard = ({ 
  children, 
  className = '', 
  delay = 0,
  hoverScale = true 
}: PremiumCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={hoverScale ? { 
        y: -5,
        scale: 1.01,
        transition: { duration: 0.2 }
      } : undefined}
      className={`
        ${theme2026.glass} 
        ${theme2026.depth.mid} 
        rounded-[2rem] 
        p-6 
        overflow-hidden 
        relative 
        group
        ${className}
      `}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
