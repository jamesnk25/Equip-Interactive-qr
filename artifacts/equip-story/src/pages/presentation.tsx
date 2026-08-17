import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'wouter';
import { SlideUp } from '@/components/animations';
import equipLogoNavy from '@assets/brand/equip_540.png';

export default function PresentationPage() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const baseUrl = window.location.origin + import.meta.env.BASE_URL;
    setUrl(baseUrl.replace(/\/$/, '') + '/story');
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      <div className="absolute top-8 left-8">
        <img 
          src={equipLogoNavy} 
          alt="Equip" 
          className="h-12 object-contain"
        />
      </div>

      <div className="z-10 flex flex-col items-center max-w-5xl text-center w-full mt-12">
        <SlideUp delay={0.1}>
          <h1 className="text-7xl md:text-9xl font-display font-bold text-navy uppercase leading-[0.85] tracking-tight">
            WHAT'S YOUR <br/>
            <span className="bg-chartreuse text-navy px-6 py-2 inline-block mt-4">EQUIP STORY?</span>
          </h1>
        </SlideUp>
        
        <SlideUp delay={0.2} className="mt-8 max-w-2xl">
          <p className="text-xl md:text-2xl text-navy/80 font-medium">
            Tell us what you're seeing, what you're looking for, and what could make Equip even better.
          </p>
        </SlideUp>

        <SlideUp delay={0.4} className="mt-16 flex flex-col items-center w-full max-w-md">
          <div className="bg-white p-6 border-4 border-navy w-full flex flex-col items-center">
            {url ? (
              <QRCodeSVG 
                value={url} 
                size={280} 
                level="H"
                includeMargin={false}
                fgColor="#123B63"
                bgColor="#FFFFFF"
              />
            ) : (
              <div className="w-[280px] h-[280px] bg-muted animate-pulse" />
            )}
          </div>
          <div className="w-full bg-primary text-white py-4 font-display font-bold text-3xl tracking-wide uppercase">
            SCAN TO SHARE
          </div>
          
          <div className="mt-8 w-full border-b-[3px] border-dashed border-primary"></div>
          
          <div className="mt-6 flex flex-col items-center gap-2 text-navy font-medium">
            <p className="text-lg">No app required. Takes about a minute.</p>
            <p className="text-primary font-display uppercase tracking-widest text-xl font-bold">30,000 attendees. 30,000 stories.</p>
          </div>
        </SlideUp>

        <Link href="/intelligence" className="absolute bottom-8 right-8 font-display text-xl font-bold text-primary hover:text-navy transition-colors uppercase tracking-wider">
          View Intelligence Dashboard &rarr;
        </Link>
      </div>
    </div>
  );
}
