import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateStory, useAddFollowUp } from '@workspace/api-client-react';
import { useAppStore } from '@/lib/store';
import { MobileLayout } from '@/components/mobile-layout';
import { SlideUp } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Keyboard, Square, X, ArrowRight, Loader2 } from 'lucide-react';
import { PROMPTS_BY_BUSINESS, GENERIC_PROMPTS, INTERESTS, PROMPTS_BY_INTEREST } from '@/lib/prompts';

type ScreenState = 'home' | 'interests' | 'record' | 'write' | 'followup';

export default function ListenPage() {
  const [, setLocation] = useLocation();
  const { attendee, setStoryId, storyId } = useAppStore();
  const createStory = useCreateStory();
  const addFollowUp = useAddFollowUp();

  const [screen, setScreen] = useState<ScreenState>('home');
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Written state
  const [text, setText] = useState('');

  // Follow-up state
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [isFollowUpAction, setIsFollowUpAction] = useState(false); // If currently recording/writing for follow-up

  // Protect route
  if (!attendee) {
    setLocation('/story/profile');
    return null;
  }

  // Derived prompts
  const businessPrompts = PROMPTS_BY_BUSINESS[attendee.businessType] || [];
  const displayPrompts = [...businessPrompts, ...GENERIC_PROMPTS].slice(0, 5);

  const startRecord = (prompt: string, isFollowUp = false) => {
    setActivePrompt(prompt);
    setIsFollowUpAction(isFollowUp);
    setScreen('record');
    setRecordTime(0);
    setIsRecording(true);
    // Simulate real mic permission
    navigator.mediaDevices?.getUserMedia({ audio: true }).catch(() => {
      // ignore, we just simulate visually if blocked
    });
  };

  const startWrite = (prompt: string, isFollowUp = false) => {
    setActivePrompt(prompt);
    setIsFollowUpAction(isFollowUp);
    setText('');
    setScreen('write');
  };

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const mutateFnRef = useRef(createStory.mutate);
  mutateFnRef.current = createStory.mutate;
  
  const followUpFnRef = useRef(addFollowUp.mutate);
  followUpFnRef.current = addFollowUp.mutate;

  const submitResponse = (type: 'voice' | 'written', content?: string, duration?: number) => {
    if (isFollowUpAction && storyId) {
      followUpFnRef.current(
        {
          id: storyId,
          data: {
            followUpPrompt: activePrompt,
            followUpResponse: type === 'written' ? content : `[Voice Response: ${duration}s]`
          }
        },
        {
          onSuccess: () => setLocation('/story/thanks')
        }
      );
      return;
    }

    mutateFnRef.current(
      {
        data: {
          attendeeId: attendee.id,
          responseType: type,
          writtenResponse: type === 'written' ? content : undefined,
          voiceDurationSeconds: type === 'voice' ? duration : undefined,
          promptShown: activePrompt,
          selectedInterests: selectedInterests.length > 0 ? selectedInterests : undefined
        }
      },
      {
        onSuccess: (story) => {
          setStoryId(story.id);
          // Generate follow up question
          generateFollowUp(type === 'written' ? content : undefined);
        }
      }
    );
  };

  const generateFollowUp = (responseContext?: string) => {
    // Simple client-side demo logic
    let q = "What's the biggest barrier to solving that right now?";
    if (selectedInterests.includes('Labor & Workforce')) {
      q = "Where do you think technology or equipment could reduce the amount of labor you need?";
    } else if (attendee.businessType === 'Landscape Contractor') {
      q = "How is that affecting your ability to take on new commercial contracts?";
    }
    setFollowUpPrompt(q);
    setScreen('followup');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Auto submit after a tiny delay
    setTimeout(() => {
      submitResponse('voice', undefined, recordTime);
    }, 500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <MobileLayout hideLogo={screen !== 'home' && screen !== 'followup'}>
      <AnimatePresence mode="wait">
        
        {/* HOME SCREEN */}
        {screen === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col p-6 overflow-y-auto"
          >
            <SlideUp delay={0.1}>
              <h1 className="text-3xl font-black uppercase tracking-tight leading-[1.1] mb-2">
                {attendee.firstName.toUpperCase()}, WHAT'S ON YOUR MIND?
              </h1>
              <p className="text-muted-foreground font-medium text-lg">
                Tell Equip what you're seeing, looking for, thinking about, or trying to solve.
              </p>
            </SlideUp>

            <SlideUp delay={0.2} className="mt-10 grid gap-4">
              <Button 
                onClick={() => startRecord("Tell Equip what's on your mind...")}
                className="w-full h-20 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-black rounded-2xl shadow-[0_0_30px_rgba(255,90,0,0.2)] flex items-center justify-between px-6 group"
              >
                <span>TALK TO EQUIP</span>
                <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center group-active:scale-95 transition-transform">
                  <Mic size={24} />
                </div>
              </Button>
              <Button 
                onClick={() => startWrite("What's happening in your world? What are you looking for at Equip?")}
                variant="outline"
                className="w-full h-20 bg-card hover:bg-card border-card-border text-foreground text-xl font-black rounded-2xl flex items-center justify-between px-6 group"
              >
                <span>WRITE IT INSTEAD</span>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-active:scale-95 transition-transform">
                  <Keyboard size={24} className="text-muted-foreground" />
                </div>
              </Button>
            </SlideUp>

            <SlideUp delay={0.3} className="mt-12">
              <h3 className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-4">Need a place to start?</h3>
              <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 snap-x">
                {displayPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => startRecord(prompt)}
                    className="snap-start flex-none w-[260px] bg-card border border-card-border p-5 rounded-2xl text-left active-elevate hover:border-primary/50 transition-colors"
                  >
                    <p className="font-bold text-lg leading-snug">{prompt}</p>
                    <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                      <Mic size={14} /> Tap to answer
                    </div>
                  </button>
                ))}
              </div>
            </SlideUp>

            <SlideUp delay={0.4} className="mt-6 mb-12">
              <button 
                onClick={() => setScreen('interests')}
                className="w-full bg-secondary border border-secondary-border p-6 rounded-2xl text-left flex items-center justify-between active-elevate"
              >
                <div>
                  <h3 className="font-black text-xl mb-1">QUICK INTEREST PATH</h3>
                  <p className="text-muted-foreground font-medium text-sm">Select what matters most to you</p>
                </div>
                <ArrowRight className="text-muted-foreground" />
              </button>
            </SlideUp>
          </motion.div>
        )}

        {/* INTERESTS SCREEN */}
        {screen === 'interests' && (
          <motion.div 
            key="interests"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-6 overflow-y-auto"
          >
            <button onClick={() => setScreen('home')} className="self-start mb-6 p-2 -ml-2 rounded-full bg-card">
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-black uppercase tracking-tight leading-[1.1] mb-2">
              WHAT ARE YOU MOST INTERESTED IN RIGHT NOW?
            </h2>
            <p className="text-muted-foreground font-medium mb-8">Select all that apply.</p>

            <div className="flex flex-wrap gap-3 mb-12">
              {INTERESTS.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => {
                      setSelectedInterests(prev => 
                        isSelected ? prev.filter(i => i !== interest) : [...prev, interest]
                      )
                    }}
                    className={`px-5 py-3 rounded-full font-bold text-sm transition-all ${
                      isSelected ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-card text-foreground border border-card-border hover:border-primary/50'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>

            {selectedInterests.length > 0 && (
              <SlideUp delay={0}>
                <div className="bg-card border border-card-border p-6 rounded-2xl text-center mb-8 shadow-xl">
                  <h3 className="font-black uppercase tracking-widest text-primary mb-2 text-sm">Tell us a little more</h3>
                  <p className="text-xl font-bold mb-6">
                    {PROMPTS_BY_INTEREST[selectedInterests[0]] || "What brings you to Equip this year?"}
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={() => startRecord(PROMPTS_BY_INTEREST[selectedInterests[0]] || "Tell us more", false)} className="flex-1 font-bold h-12 bg-primary">Talk</Button>
                    <Button onClick={() => startWrite(PROMPTS_BY_INTEREST[selectedInterests[0]] || "Tell us more", false)} variant="outline" className="flex-1 font-bold h-12 bg-background border-card-border">Write</Button>
                  </div>
                </div>
              </SlideUp>
            )}
          </motion.div>
        )}

        {/* RECORD SCREEN */}
        {screen === 'record' && (
          <motion.div 
            key="record"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-background flex flex-col p-6 pt-12"
          >
            <button onClick={() => {
              setIsRecording(false);
              setScreen('home');
            }} className="absolute top-6 right-6 p-3 rounded-full bg-card text-muted-foreground z-10">
              <X size={24} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="text-center px-4 max-w-sm mb-16">
                <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
                  {isRecording ? "We're listening..." : "Ready to share"}
                </p>
                <h2 className="text-2xl font-bold leading-snug">
                  "{activePrompt}"
                </h2>
              </div>

              {/* Visualizer / Timer */}
              <div className="h-40 flex flex-col items-center justify-center">
                {isRecording ? (
                  <div className="flex items-center gap-1.5 h-16 mb-6">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 bg-primary rounded-full audio-bar delay-${(i % 5) + 1}`} 
                        style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-16 mb-6 flex items-center">
                    <div className="w-[100px] h-1 bg-muted rounded-full" />
                  </div>
                )}
                <div className="text-5xl font-black font-mono tracking-tighter tabular-nums">
                  {formatTime(recordTime)}
                </div>
              </div>
            </div>

            <div className="pb-12 pt-8 flex justify-center relative z-10">
              {isRecording ? (
                <button 
                  onClick={handleStopRecording}
                  className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_40px_rgba(255,90,0,0.4)] active:scale-95 transition-transform"
                >
                  <Square fill="currentColor" size={32} />
                </button>
              ) : (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="mt-4 font-bold text-muted-foreground uppercase tracking-widest text-sm">Processing...</p>
                </div>
              )}
            </div>
            
            <p className="text-center text-[10px] text-muted-foreground/60 font-medium px-8 pb-4">
              Your voice response may be transcribed and analyzed to help Equip understand attendee needs.
            </p>
          </motion.div>
        )}

        {/* WRITE SCREEN */}
        {screen === 'write' && (
          <motion.div 
            key="write"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-background flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-card-border bg-card/50 backdrop-blur-md">
              <button onClick={() => setScreen('home')} className="p-3 -ml-3 text-muted-foreground">
                <X size={24} />
              </button>
              <span className="font-bold uppercase tracking-widest text-xs">Share Your Story</span>
              <Button 
                onClick={() => submitResponse('written', text)}
                disabled={text.trim().length < 5 || createStory.isPending || addFollowUp.isPending}
                size="sm"
                className="bg-primary font-black uppercase tracking-widest rounded-full px-6"
              >
                {(createStory.isPending || addFollowUp.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col p-6">
              <h2 className="text-xl font-bold mb-6 text-muted-foreground leading-snug">
                {activePrompt}
              </h2>
              <Textarea 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Start typing..."
                className="flex-1 bg-transparent border-none text-2xl font-medium resize-none focus-visible:ring-0 p-0 leading-relaxed placeholder:text-muted-foreground/30"
                autoFocus
              />
            </div>
            
            <div className="p-6 pb-8 bg-card/30">
              <p className="text-center text-[10px] text-muted-foreground/60 font-medium">
                By sharing, you agree that Equip may use your feedback to improve future events.
              </p>
            </div>
          </motion.div>
        )}

        {/* FOLLOW-UP SCREEN */}
        {screen === 'followup' && (
          <motion.div 
            key="followup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          >
            <SlideUp delay={0.1}>
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-sm mb-8">
                Got it.
              </div>
              <h2 className="text-4xl font-black leading-[1.1] mb-12">
                {followUpPrompt}
              </h2>
            </SlideUp>

            <SlideUp delay={0.3} className="w-full space-y-4">
              <Button 
                onClick={() => startRecord(followUpPrompt, true)}
                className="w-full h-16 bg-primary text-primary-foreground font-black text-xl rounded-2xl shadow-lg"
              >
                ANSWER
              </Button>
              <Button 
                onClick={() => setLocation('/story/thanks')}
                variant="ghost"
                className="w-full h-16 text-muted-foreground font-bold text-lg uppercase tracking-widest hover:text-foreground"
              >
                I'm Done
              </Button>
            </SlideUp>
          </motion.div>
        )}

      </AnimatePresence>
    </MobileLayout>
  );
}
