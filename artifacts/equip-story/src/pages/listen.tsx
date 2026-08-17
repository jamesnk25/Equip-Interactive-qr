import { useState, useEffect, useRef } from 'react';
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
  const [isFollowUpAction, setIsFollowUpAction] = useState(false);

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
    navigator.mediaDevices?.getUserMedia({ audio: true }).catch(() => {});
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
          generateFollowUp(type === 'written' ? content : undefined);
        }
      }
    );
  };

  const generateFollowUp = (responseContext?: string) => {
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
    setTimeout(() => {
      submitResponse('voice', undefined, recordTime);
    }, 500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTheme = () => {
    if (screen === 'record' || screen === 'followup') return 'dark';
    return 'light';
  };

  return (
    <MobileLayout theme={getTheme()} hideLogo={screen !== 'home' && screen !== 'followup'}>
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
              <h1 className="text-5xl font-display font-bold uppercase tracking-tight leading-[0.9] text-navy mb-4">
                {attendee.firstName.toUpperCase()}, WHAT'S ON <br/>
                <span className="bg-chartreuse px-2 py-1 inline-block mt-2">YOUR MIND?</span>
              </h1>
              <p className="text-navy/80 font-medium text-lg leading-relaxed">
                Tell Equip what you're seeing, looking for, thinking about, or trying to solve.
              </p>
            </SlideUp>

            <SlideUp delay={0.2} className="mt-10 grid gap-4">
              <Button 
                onClick={() => startRecord("Tell Equip what's on your mind...")}
                className="w-full h-20 bg-primary hover:bg-navy text-white text-3xl font-display font-bold rounded-none flex items-center justify-between px-6 transition-colors"
              >
                <span>TALK TO EQUIP</span>
                <Mic size={32} />
              </Button>
              <Button 
                onClick={() => startWrite("What's happening in your world? What are you looking for at Equip?")}
                variant="outline"
                className="w-full h-20 bg-white hover:bg-navy hover:text-white border-2 border-navy text-navy text-3xl font-display font-bold rounded-none flex items-center justify-between px-6 transition-colors"
              >
                <span>WRITE IT INSTEAD</span>
                <Keyboard size={32} />
              </Button>
            </SlideUp>

            <SlideUp delay={0.3} className="mt-12">
              <h3 className="text-xl font-display font-bold text-navy uppercase tracking-widest mb-4">Need a place to start?</h3>
              <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 snap-x">
                {displayPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => startRecord(prompt)}
                    className="snap-start flex-none w-[260px] bg-white border-2 border-navy p-6 rounded-none text-left hover:border-primary transition-colors flex flex-col justify-between group"
                  >
                    <p className="font-bold text-lg text-navy leading-snug">{prompt}</p>
                    <div className="mt-6 flex items-center gap-2 text-primary font-display font-bold text-xl tracking-widest uppercase group-hover:text-navy transition-colors">
                      <Mic size={20} /> Tap to answer
                    </div>
                  </button>
                ))}
              </div>
            </SlideUp>

            <SlideUp delay={0.4} className="mt-6 mb-12">
              <button 
                onClick={() => setScreen('interests')}
                className="w-full bg-navy text-white p-6 rounded-none text-left flex items-center justify-between hover:bg-primary transition-colors"
              >
                <div>
                  <h3 className="font-display font-bold text-3xl uppercase tracking-wider mb-1">QUICK INTEREST PATH</h3>
                  <p className="text-white/80 font-medium text-sm">Select what matters most to you</p>
                </div>
                <ArrowRight size={32} />
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
            <button onClick={() => setScreen('home')} className="self-start mb-6 p-2 -ml-2 text-navy hover:text-primary transition-colors">
              <X size={32} />
            </button>
            
            <h2 className="text-5xl font-display font-bold uppercase tracking-tight leading-[0.9] text-navy mb-4">
              WHAT ARE YOU <br/>
              <span className="bg-chartreuse px-2 py-1 inline-block mt-2">MOST INTERESTED IN?</span>
            </h2>
            <p className="text-navy/80 font-medium mb-8 text-lg">Select all that apply.</p>

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
                    className={`px-5 py-3 rounded-none font-display font-bold text-2xl uppercase tracking-wider border-2 transition-colors ${
                      isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-navy border-navy hover:border-primary'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>

            {selectedInterests.length > 0 && (
              <SlideUp delay={0}>
                <div className="bg-white border-4 border-navy p-6 rounded-none text-center mb-8">
                  <h3 className="font-display font-bold uppercase tracking-widest text-primary mb-3 text-xl">Tell us a little more</h3>
                  <p className="text-xl font-bold text-navy mb-8">
                    {PROMPTS_BY_INTEREST[selectedInterests[0]] || "What brings you to Equip this year?"}
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={() => startRecord(PROMPTS_BY_INTEREST[selectedInterests[0]] || "Tell us more", false)} className="flex-1 font-display font-bold text-2xl tracking-wider rounded-none h-14 bg-primary text-white hover:bg-navy transition-colors">TALK</Button>
                    <Button onClick={() => startWrite(PROMPTS_BY_INTEREST[selectedInterests[0]] || "Tell us more", false)} variant="outline" className="flex-1 font-display font-bold text-2xl tracking-wider rounded-none h-14 bg-white text-navy border-2 border-navy hover:bg-navy hover:text-white transition-colors">WRITE</Button>
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
            className="absolute inset-0 z-50 bg-navy text-white flex flex-col p-6 pt-12"
          >
            <button onClick={() => {
              setIsRecording(false);
              setScreen('home');
            }} className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors z-10">
              <X size={32} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="text-center px-4 max-w-sm mb-16">
                <p className="text-chartreuse font-display font-bold tracking-widest uppercase text-xl mb-4">
                  {isRecording ? "We're listening..." : "Ready to share"}
                </p>
                <h2 className="text-3xl font-bold leading-snug">
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
                        className={`w-3 bg-primary rounded-none audio-bar delay-${(i % 5) + 1}`} 
                        style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-16 mb-6 flex items-center">
                    <div className="w-[120px] h-2 bg-white/20 rounded-none" />
                  </div>
                )}
                <div className="text-6xl font-display font-bold tracking-wider tabular-nums">
                  {formatTime(recordTime)}
                </div>
              </div>
            </div>

            <div className="pb-12 pt-8 flex justify-center relative z-10">
              {isRecording ? (
                <button 
                  onClick={handleStopRecording}
                  className="w-24 h-24 bg-chartreuse text-navy rounded-none flex items-center justify-center hover:scale-95 transition-transform"
                >
                  <Square fill="currentColor" size={40} />
                </button>
              ) : (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="mt-4 font-display font-bold text-white/60 uppercase tracking-widest text-xl">Processing...</p>
                </div>
              )}
            </div>
            
            <p className="text-center text-[10px] text-white/40 font-medium px-8 pb-4">
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
            className="absolute inset-0 z-50 bg-[#F4E487] text-navy flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b-4 border-navy bg-[#F4E487]">
              <button onClick={() => setScreen('home')} className="p-3 -ml-3 text-navy hover:text-primary transition-colors">
                <X size={32} />
              </button>
              <span className="font-display font-bold uppercase tracking-widest text-xl">Share Your Story</span>
              <Button 
                onClick={() => submitResponse('written', text)}
                disabled={text.trim().length < 5 || createStory.isPending || addFollowUp.isPending}
                size="sm"
                className="bg-navy text-white font-display font-bold text-xl uppercase tracking-widest rounded-none px-6 h-10 hover:bg-primary transition-colors"
              >
                {(createStory.isPending || addFollowUp.isPending) ? <Loader2 className="w-5 h-5 animate-spin" /> : "SEND"}
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col p-6">
              <h2 className="text-2xl font-bold mb-6 text-navy/80 leading-snug">
                {activePrompt}
              </h2>
              <Textarea 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Start typing..."
                className="flex-1 bg-transparent border-none text-2xl font-medium resize-none focus-visible:ring-0 p-0 leading-relaxed placeholder:text-navy/30 text-navy"
                autoFocus
              />
            </div>
            
            <div className="p-6 pb-8 bg-[#F4E487]">
              <p className="text-center text-sm text-navy/60 font-medium">
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
              <div className="inline-block px-4 py-1 border-2 border-chartreuse text-chartreuse font-display font-bold uppercase tracking-widest text-xl mb-8">
                GOT IT.
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase leading-[1.1] mb-12">
                {followUpPrompt}
              </h2>
            </SlideUp>

            <SlideUp delay={0.3} className="w-full space-y-4">
              <Button 
                onClick={() => startRecord(followUpPrompt, true)}
                className="w-full h-16 bg-primary text-white font-display font-bold text-3xl uppercase tracking-wider rounded-none hover:bg-white hover:text-navy transition-colors"
              >
                ANSWER
              </Button>
              <Button 
                onClick={() => setLocation('/story/thanks')}
                variant="ghost"
                className="w-full h-16 text-white/60 font-display font-bold text-2xl uppercase tracking-widest hover:text-chartreuse hover:bg-transparent rounded-none transition-colors"
              >
                I'M DONE
              </Button>
            </SlideUp>
          </motion.div>
        )}

      </AnimatePresence>
    </MobileLayout>
  );
}
