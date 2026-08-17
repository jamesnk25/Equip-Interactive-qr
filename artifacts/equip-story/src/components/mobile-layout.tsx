import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import equipLogoNavy from '@assets/brand/equip_540.png';
import equipLogoWhite from '@assets/brand/equip_White.png';

interface MobileLayoutProps {
  children: ReactNode;
  hideLogo?: boolean;
  theme?: 'light' | 'dark';
}

export function MobileLayout({ children, hideLogo = false, theme = 'light' }: MobileLayoutProps) {
  const [location] = useLocation();

  const logoPath = theme === 'dark' ? equipLogoWhite : equipLogoNavy;
  const bgClass = theme === 'dark' ? 'bg-navy text-white' : 'bg-background text-navy';

  return (
    <div className={`min-h-[100dvh] w-full flex justify-center ${bgClass} transition-colors duration-300`}>
      <div className={`w-full max-w-md relative shadow-2xl flex flex-col min-h-[100dvh] ${bgClass} transition-colors duration-300 border-x border-black/5`}>
        {!hideLogo && (
          <div className="p-6 pt-12 flex justify-center z-10 relative">
            <img 
              src={logoPath} 
              alt="Equip" 
              className="h-10 object-contain"
            />
          </div>
        )}
        
        <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
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
