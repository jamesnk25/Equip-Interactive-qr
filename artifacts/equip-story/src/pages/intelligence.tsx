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
    <div className="min-h-screen bg-background text-navy font-sans p-6 md:p-12 overflow-x-hidden">
      <Link href="/" className="inline-flex items-center gap-2 text-primary font-display font-bold uppercase tracking-widest text-xl mb-12 hover:text-navy transition-colors">
        <ArrowLeft size={24} /> Back to Presentation
      </Link>

      <SlideUp delay={0.1}>
        <div className="mb-12">
          <h2 className="text-primary font-display font-bold uppercase tracking-widest mb-4 text-2xl">Executive Dashboard</h2>
          <h1 className="text-7xl md:text-9xl font-display font-bold uppercase tracking-tight leading-[0.85]">
            30,000 STORIES <br />
            <span className="bg-chartreuse px-4 py-2 inline-block mt-4">BECOME INTELLIGENCE.</span>
          </h1>
        </div>
      </SlideUp>

      {isLoading || !data ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Key Metrics */}
          <SlideUp delay={0.2} className="lg:col-span-1 space-y-6">
            <div className="bg-white border-4 border-navy p-8">
              <h3 className="text-xl font-display font-bold text-navy/60 uppercase tracking-widest mb-2">Total Stories Shared</h3>
              <p className="text-7xl font-display font-bold text-navy tabular-nums tracking-tighter">
                {data.storiesShared.toLocaleString()}
              </p>
              <div className="mt-8 pt-6 border-t-2 border-dashed border-primary flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Mic size={24} className="text-primary" />
                  <span className="font-display font-bold text-2xl text-navy">{data.voicePercent}%</span>
                </div>
                <div className="flex items-center gap-2 text-navy/60">
                  <Keyboard size={24} />
                  <span className="font-display font-bold text-2xl">{data.writtenPercent}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-navy p-8">
              <h3 className="text-xl font-display font-bold text-navy/60 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users size={20} /> Top Voices By Business
              </h3>
              <div className="space-y-6">
                {data.topBusinessTypes.map((bt, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-display font-bold text-xl uppercase tracking-wider mb-2 text-navy">
                      <span className="truncate pr-4">{bt.businessType}</span>
                      <span className="text-primary">{bt.percent}%</span>
                    </div>
                    <div className="w-full bg-navy/10 h-3">
                      <div className="bg-primary h-3" style={{ width: `${bt.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Center Column - Insights */}
          <SlideUp delay={0.3} className="lg:col-span-2 space-y-6 flex flex-col">
            <div className="bg-navy p-8 md:p-12 text-white flex-1 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <h3 className="text-xl font-display font-bold text-chartreuse uppercase tracking-widest mb-8 flex items-center gap-2 relative z-10">
                <TrendingUp size={24} /> Emerging Insight
              </h3>
              <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight leading-[1.0] mb-8 relative z-10">
                {data.emergingStoryHeadline}
              </h2>
              <p className="text-xl md:text-2xl font-medium leading-relaxed relative z-10 text-white/90">
                {data.emergingStoryInsight}
              </p>
            </div>

            <div className="bg-white border-4 border-navy p-8">
              <h3 className="text-xl font-display font-bold text-navy/60 uppercase tracking-widest mb-6">Top Themes</h3>
              <div className="flex flex-wrap gap-3">
                {data.topThemes.map((theme, i) => (
                  <div key={i} className="px-6 py-3 bg-[#F4E487] border-2 border-navy text-xl font-display font-bold text-navy uppercase tracking-wider">
                    {theme}
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Right Column - Voice Quotes */}
          <SlideUp delay={0.4} className="lg:col-span-1">
            <div className="bg-white border-4 border-navy p-8 h-full flex flex-col">
              <h3 className="text-xl font-display font-bold text-navy/60 uppercase tracking-widest mb-8">Raw Attendee Voice</h3>
              
              <div className="space-y-8 flex-1 overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                
                <div className="space-y-10 pr-2">
                  {data.attendeeVoices.map((voice, i) => (
                    <div key={i} className="relative pl-6 border-l-4 border-primary">
                      <p className="text-xl font-medium leading-relaxed italic relative z-10 mb-4 text-navy">
                        "{voice.quote}"
                      </p>
                      <p className="text-lg font-display font-bold text-primary uppercase tracking-widest">
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
      
      <div className="mt-20 text-center font-display font-bold text-navy/40 text-2xl uppercase tracking-[0.3em]">
        Stories &rarr; Data &rarr; Intelligence &rarr; Action
      </div>
    </div>
  );
}
