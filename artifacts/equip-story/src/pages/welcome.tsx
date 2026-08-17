import { Link } from 'wouter';
import { MobileLayout } from '@/components/mobile-layout';
import { SlideUp } from '@/components/animations';

export default function WelcomePage() {
  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <SlideUp delay={0.1}>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
            YOUR EQUIP.<br/>
            <span className="text-primary">YOUR EXPERIENCE.</span><br/>
            YOUR VOICE.
          </h1>
        </SlideUp>
        
        <SlideUp delay={0.2} className="mt-8">
          <p className="text-xl text-muted-foreground leading-relaxed font-medium">
            Tell us what you're looking for, what you're learning, and what would make Equip even more valuable to you.
          </p>
        </SlideUp>

        <SlideUp delay={0.4} className="mt-16 w-full">
          <Link href="/story/profile" className="block w-full bg-primary text-primary-foreground font-black text-2xl py-6 rounded-2xl shadow-[0_0_40px_rgba(255,90,0,0.3)] active-elevate-2 transition-transform hover:scale-[1.02]">
            START
          </Link>
          <p className="mt-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
            About 60 seconds.
          </p>
        </SlideUp>
      </div>
    </MobileLayout>
  );
}
