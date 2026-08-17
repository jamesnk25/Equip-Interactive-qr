import { useGetIntelligenceSummary } from '@workspace/api-client-react';
import { SlideUp } from '@/components/animations';
import { Link } from 'wouter';
import { Loader2, ArrowLeft, Mic, Keyboard, Users, TrendingUp } from 'lucide-react';

export default function IntelligencePage() {
  const { data, isLoading } = useGetIntelligenceSummary({
    query: {
      queryKey: ['intelligence-summary']
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12 overflow-x-hidden">
      <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-12 hover:text-primary/80 transition-colors">
        <ArrowLeft size={16} /> Back to Presentation
      </Link>

      <SlideUp delay={0.1}>
        <div className="mb-12">
          <h2 className="text-primary font-black uppercase tracking-widest mb-2 text-sm">Executive Dashboard</h2>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
            30,000 STORIES <br />
            BECOME INTELLIGENCE.
          </h1>
        </div>
      </SlideUp>

      {isLoading || !data ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Key Metrics */}
          <SlideUp delay={0.2} className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-card-border p-8 rounded-3xl">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Stories Shared</h3>
              <p className="text-6xl font-black text-white tabular-nums tracking-tighter">
                {data.storiesShared.toLocaleString()}
              </p>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Mic size={16} className="text-primary" />
                  <span className="font-bold">{data.voicePercent}%</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Keyboard size={16} />
                  <span className="font-bold">{data.writtenPercent}%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-card-border p-8 rounded-3xl">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users size={16} /> Top Voices By Business
              </h3>
              <div className="space-y-4">
                {data.topBusinessTypes.map((bt, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="truncate pr-4">{bt.businessType}</span>
                      <span className="text-primary">{bt.percent}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${bt.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Center Column - Insights */}
          <SlideUp delay={0.3} className="lg:col-span-2 space-y-6 flex flex-col">
            <div className="bg-primary p-8 md:p-12 rounded-3xl text-primary-foreground flex-1 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <h3 className="text-sm font-black text-black/50 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <TrendingUp size={16} /> Emerging Insight
              </h3>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6 relative z-10">
                {data.emergingStoryHeadline}
              </h2>
              <p className="text-xl md:text-2xl font-medium leading-relaxed relative z-10 text-white/90">
                {data.emergingStoryInsight}
              </p>
            </div>

            <div className="bg-card border border-card-border p-8 rounded-3xl">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Top Themes</h3>
              <div className="flex flex-wrap gap-3">
                {data.topThemes.map((theme, i) => (
                  <div key={i} className="px-4 py-2 bg-background border border-card-border rounded-lg text-sm font-bold text-foreground">
                    {theme}
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Right Column - Voice Quotes */}
          <SlideUp delay={0.4} className="lg:col-span-1">
            <div className="bg-card border border-card-border p-8 rounded-3xl h-full flex flex-col">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">Raw Attendee Voice</h3>
              
              <div className="space-y-6 flex-1 overflow-hidden relative">
                {/* Gradient overlay for fade effect */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
                
                <div className="space-y-8 pr-2">
                  {data.attendeeVoices.map((voice, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-3 top-[-8px] text-4xl text-primary/20 font-serif">"</div>
                      <p className="text-lg font-medium leading-snug italic relative z-10 mb-3">
                        {voice.quote}
                      </p>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">
                        &mdash; {voice.businessType}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SlideUp>
          
        </div>
      )}
      
      <div className="mt-16 text-center text-muted-foreground font-bold text-xs uppercase tracking-[0.3em]">
        Stories &rarr; Data &rarr; Intelligence &rarr; Action
      </div>
    </div>
  );
}
