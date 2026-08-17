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
    <MobileLayout>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center p-8 text-center">
          <SlideUp delay={0.1}>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.9] text-primary mb-6">
              THANKS, {attendee.firstName.toUpperCase()}.
            </h1>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-8 leading-snug">
              You just helped shape the future of Equip.
            </h2>
          </SlideUp>

          <SlideUp delay={0.2}>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Every story helps Equip understand what this industry needs next.
            </p>
            <div className="my-12 flex flex-col gap-3 font-black text-sm tracking-[0.2em] uppercase text-foreground/40">
              <p>30,000 Attendees</p>
              <div className="w-12 h-px bg-foreground/10 mx-auto" />
              <p>30,000 Stories</p>
              <div className="w-12 h-px bg-foreground/10 mx-auto" />
              <p className="text-primary">One Equip Community</p>
            </div>
          </SlideUp>

          <SlideUp delay={0.3} className="space-y-4 w-full mt-4">
            <Button 
              onClick={() => {
                clearState();
                setLocation('/story');
              }}
              className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-xl bg-card border border-card-border text-foreground hover:bg-card/80"
            >
              KEEP EXPLORING
            </Button>
            <Button 
              onClick={() => setLocation('/story/listen')}
              className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-xl bg-primary text-primary-foreground shadow-[0_0_30px_rgba(255,90,0,0.3)] hover:scale-[1.02] transition-transform"
            >
              SHARE ANOTHER THOUGHT
            </Button>
          </SlideUp>
        </div>

        {/* Fictional Recommendations */}
        <SlideUp delay={0.5} className="p-6 bg-card border-t border-card-border mt-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
            BASED ON WHAT YOU SHARED...
          </p>
          <h3 className="font-bold mb-4">You may be interested in:</h3>
          <div className="space-y-3">
            <div className="bg-background p-4 rounded-xl border border-card-border flex flex-col justify-center">
              <p className="font-bold text-sm">Workforce Productivity Session</p>
              <p className="text-xs text-muted-foreground mt-1">Tomorrow, 10:00 AM &bull; Room 204</p>
            </div>
            <div className="bg-background p-4 rounded-xl border border-card-border flex flex-col justify-center">
              <p className="font-bold text-sm">Autonomous Equipment Demo</p>
              <p className="text-xs text-muted-foreground mt-1">Outdoor Demo Area, Booth 402</p>
            </div>
          </div>
        </SlideUp>
      </div>
    </MobileLayout>
  );
}
