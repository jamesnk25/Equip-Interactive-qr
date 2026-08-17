import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

export function MobileLayout({ children, hideLogo = false }: { children: ReactNode; hideLogo?: boolean }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] w-full bg-background flex justify-center">
      {/* 
        On desktop, it restricts to a mobile width.
        On mobile, it takes the full width. 
      */}
      <div className="w-full max-w-md bg-background relative shadow-2xl flex flex-col min-h-[100dvh]">
        {!hideLogo && (
          <div className="p-6 pt-12 flex justify-center z-10 relative">
            <img 
              src={(import.meta as any).env?.MODE === 'development' ? '/attached_assets/brand/equip_White.png' : 'https://raw.githubusercontent.com/replit/vite-plugin-cartographer/main/attached_assets/brand/equip_White.png'} 
              alt="Equip" 
              className="h-10 object-contain opacity-90"
              onError={(e) => {
                // Fallback in case of path issues
                (e.target as HTMLImageElement).src = '/src/assets/equip_White.png'; // Will break if doesn't exist, but visual failsafe
                (e.target as HTMLImageElement).style.display = 'none'; // hide if broken
              }}
            />
          </div>
        )}
        
        <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
