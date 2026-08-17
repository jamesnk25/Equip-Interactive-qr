import { useState } from 'react';
import { useLocation } from 'wouter';
import { useVerifyAttendee } from '@workspace/api-client-react';
import { useAppStore } from '@/lib/store';
import { MobileLayout } from '@/components/mobile-layout';
import { SlideUp } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const [, setLocation] = useLocation();
  const { attendee, setAttendee } = useAppStore();
  const verifyAttendee = useVerifyAttendee();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  // Protect route
  if (!attendee) {
    setLocation('/story/profile');
    return null;
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerify = () => {
    if (code.length !== 6) return;
    
    verifyAttendee.mutate(
      {
        id: attendee.id,
        data: { code }
      },
      {
        onSuccess: (updatedAttendee) => {
          setAttendee(updatedAttendee);
          setLocation('/story/listen');
        }
      }
    );
  };

  return (
    <MobileLayout theme="light">
      <div className="flex-1 flex flex-col p-6 justify-center">
        {step === 'phone' ? (
          <SlideUp delay={0.1}>
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-navy">
                <span className="bg-chartreuse px-3 py-1 inline-block">ONE QUICK STEP.</span>
              </h1>
              <p className="text-navy/80 font-medium text-lg leading-relaxed">
                We'll text you a six-digit code to verify your mobile number.
              </p>
              
              <form onSubmit={handlePhoneSubmit} className="space-y-8 pt-6">
                <Input 
                  type="tel" 
                  placeholder="(555) 555-5555" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border-2 border-navy rounded-none h-16 text-center text-3xl font-display font-bold tracking-widest text-navy focus-visible:ring-primary"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full h-16 text-3xl font-display font-bold uppercase tracking-wider rounded-none bg-primary hover:bg-navy text-white transition-colors"
                  disabled={phone.length < 10}
                >
                  TEXT ME A CODE
                </Button>
              </form>
            </div>
          </SlideUp>
        ) : (
          <SlideUp delay={0}>
            <div className="text-center space-y-8">
              <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-navy">
                ENTER YOUR <br/>
                <span className="bg-chartreuse px-3 py-1 inline-block mt-2">CODE</span>
              </h1>
              <p className="text-navy/80 font-medium text-lg">
                Sent to <span className="font-bold text-navy">{phone}</span>
              </p>
              <p className="bg-[#F4E487] text-navy font-display font-bold uppercase tracking-wider text-sm px-4 py-2 inline-block">
                Demo mode: no text is sent — enter any six-digit code.
              </p>
              
              <div className="flex justify-center py-6">
                <InputOTP 
                  maxLength={6} 
                  value={code} 
                  onChange={setCode}
                  onComplete={handleVerify}
                  disabled={verifyAttendee.isPending}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-16 text-3xl font-display font-bold bg-white border-2 border-navy rounded-none text-navy" />
                    <InputOTPSlot index={1} className="w-12 h-16 text-3xl font-display font-bold bg-white border-2 border-navy rounded-none text-navy" />
                    <InputOTPSlot index={2} className="w-12 h-16 text-3xl font-display font-bold bg-white border-2 border-navy rounded-none text-navy" />
                    <InputOTPSlot index={3} className="w-12 h-16 text-3xl font-display font-bold bg-white border-2 border-navy rounded-none text-navy" />
                    <InputOTPSlot index={4} className="w-12 h-16 text-3xl font-display font-bold bg-white border-2 border-navy rounded-none text-navy" />
                    <InputOTPSlot index={5} className="w-12 h-16 text-3xl font-display font-bold bg-white border-2 border-navy rounded-none text-navy" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="space-y-6">
                <Button 
                  onClick={handleVerify}
                  className="w-full h-16 text-3xl font-display font-bold uppercase tracking-wider rounded-none bg-primary hover:bg-navy text-white transition-colors"
                  disabled={code.length !== 6 || verifyAttendee.isPending}
                >
                  {verifyAttendee.isPending ? <Loader2 className="animate-spin w-6 h-6" /> : "VERIFY"}
                </Button>
                
                <button 
                  onClick={() => setStep('phone')} 
                  className="text-navy/60 text-lg font-display font-bold uppercase tracking-widest hover:text-primary transition-colors inline-block pb-1 border-b border-navy/30"
                >
                  Didn't get it? Send another code.
                </button>
              </div>
            </div>
          </SlideUp>
        )}
      </div>
    </MobileLayout>
  );
}
