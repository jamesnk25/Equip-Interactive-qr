import { useLocation } from 'wouter';
import { useAppStore } from '@/lib/store';
import { MobileLayout } from '@/components/mobile-layout';
import { SlideUp } from '@/components/animations';
import { Button } from '@/components/ui/button';

export default function ThanksPage() {
  const { attendee, clearState } = useAppStore();
  const [, setLocation] = useLocation();

  if (!attendee) {
    setLocation('/story');
    return null;
  }

  return (
    <MobileLayout theme="light">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center p-8 text-center">
          <SlideUp delay={0.1}>
            <h1 className="text-6xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-navy mb-6">
              <span className="bg-chartreuse px-3 py-2 inline-block">THANKS, {attendee.firstName.toUpperCase()}.</span>
            </h1>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight mb-8 leading-snug text-navy">
              You just helped shape the future of Equip.
            </h2>
          </SlideUp>

          <SlideUp delay={0.2}>
            <p className="text-navy/80 font-medium text-lg leading-relaxed">
              Every story helps Equip understand what this industry needs next.
            </p>
            <div className="my-12 flex flex-col gap-3 font-display font-bold text-xl tracking-[0.1em] uppercase text-navy/40">
              <p>30,000 Attendees</p>
              <div className="w-12 h-[3px] border-b-[3px] border-dashed border-primary/50 mx-auto" />
              <p>30,000 Stories</p>
              <div className="w-12 h-[3px] border-b-[3px] border-dashed border-primary/50 mx-auto" />
              <p className="text-primary tracking-widest">ONE EQUIP COMMUNITY</p>
            </div>
          </SlideUp>

          <SlideUp delay={0.3} className="space-y-4 w-full mt-4">
            <Button 
              onClick={() => {
                clearState();
                setLocation('/story');
              }}
              className="w-full h-16 text-3xl font-display font-bold uppercase tracking-wider rounded-none bg-white border-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              KEEP EXPLORING
            </Button>
            <Button 
              onClick={() => setLocation('/story/listen')}
              className="w-full h-16 text-3xl font-display font-bold uppercase tracking-wider rounded-none bg-primary text-white hover:bg-navy transition-colors"
            >
              SHARE ANOTHER THOUGHT
            </Button>
          </SlideUp>
        </div>

        {/* Fictional Recommendations */}
        <SlideUp delay={0.5} className="p-6 bg-white border-t-4 border-navy mt-auto">
          <p className="text-lg font-display font-bold uppercase tracking-widest text-primary mb-4">
            BASED ON WHAT YOU SHARED...
          </p>
          <h3 className="font-bold text-navy mb-4">You may be interested in:</h3>
          <div className="space-y-4">
            <div className="bg-[#F4E487] p-4 border-2 border-navy flex flex-col justify-center">
              <p className="font-display font-bold text-xl uppercase tracking-wide text-navy">Workforce Productivity Session</p>
              <p className="text-sm text-navy/70 font-medium mt-1">Tomorrow, 10:00 AM &bull; Room 204</p>
            </div>
            <div className="bg-[#F4E487] p-4 border-2 border-navy flex flex-col justify-center">
              <p className="font-display font-bold text-xl uppercase tracking-wide text-navy">Autonomous Equipment Demo</p>
              <p className="text-sm text-navy/70 font-medium mt-1">Outdoor Demo Area, Booth 402</p>
            </div>
          </div>
        </SlideUp>
      </div>
    </MobileLayout>
  );
}
