import { Link } from 'wouter';
import { MobileLayout } from '@/components/mobile-layout';
import { SlideUp } from '@/components/animations';

export default function WelcomePage() {
  return (
    <MobileLayout theme="light">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <SlideUp delay={0.1}>
          <h1 className="text-6xl font-display font-bold uppercase tracking-tight leading-[0.9] text-navy">
            YOUR EQUIP.<br/>
            <span className="bg-chartreuse text-navy px-3 py-1 inline-block my-3">YOUR EXPERIENCE.</span><br/>
            YOUR VOICE.
          </h1>
        </SlideUp>
        
        <SlideUp delay={0.2} className="mt-8">
          <p className="text-lg text-navy/80 leading-relaxed font-medium">
            Tell us what you're looking for, what you're learning, and what would make Equip even more valuable to you.
          </p>
        </SlideUp>

        <div className="w-full border-b-[3px] border-dashed border-primary my-12 opacity-50"></div>

        <SlideUp delay={0.4} className="w-full">
          <Link href="/story/profile" className="flex items-center justify-center w-full bg-primary text-white font-display font-bold text-4xl py-6 hover:bg-navy transition-colors uppercase">
            START
          </Link>
          <p className="mt-6 text-sm text-navy/60 font-bold uppercase tracking-widest font-display text-xl">
            About 60 seconds.
          </p>
        </SlideUp>
      </div>
    </MobileLayout>
  );
}
