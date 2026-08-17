import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'wouter';
import { SlideUp } from '@/components/animations';

export default function PresentationPage() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const baseUrl = window.location.origin + import.meta.env.BASE_URL;
    setUrl(baseUrl.replace(/\/$/, '') + '/story');
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-4xl text-center w-full">
        <SlideUp delay={0.1}>
          <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
            WHAT'S YOUR <br/><span className="text-primary">EQUIP STORY?</span>
          </h1>
        </SlideUp>
        
        <SlideUp delay={0.2} className="mt-8 max-w-2xl">
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Tell us what you're seeing, what you're looking for, and what could make Equip even better.
          </p>
        </SlideUp>

        <SlideUp delay={0.4} className="mt-16 bg-card p-10 rounded-3xl border border-card-border shadow-2xl flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-inner mb-8">
            {url ? (
              <QRCodeSVG 
                value={url} 
                size={340} 
                level="H"
                includeMargin={false}
                fgColor="#081320"
                bgColor="#FFFFFF"
              />
            ) : (
              <div className="w-[340px] h-[340px] bg-muted animate-pulse rounded-xl" />
            )}
          </div>
          <h2 className="text-3xl font-bold tracking-wide">SCAN TO SHARE YOUR STORY</h2>
          <div className="mt-6 flex flex-col items-center gap-2 text-muted-foreground font-medium">
            <p className="text-lg">No app required. Takes about a minute.</p>
            <p className="text-primary mt-2 uppercase tracking-widest text-sm font-bold">30,000 attendees. 30,000 stories.</p>
          </div>
        </SlideUp>

        <Link href="/intelligence" className="absolute bottom-8 right-8 text-xs font-medium text-muted-foreground/30 hover:text-muted-foreground transition-colors uppercase tracking-widest">
          View Equip Intelligence
        </Link>
      </div>
    </div>
  );
}
