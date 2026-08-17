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
    <MobileLayout>
      <div className="flex-1 flex flex-col p-6 justify-center">
        {step === 'phone' ? (
          <SlideUp delay={0.1}>
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-black uppercase tracking-tight">ONE QUICK STEP.</h1>
              <p className="text-muted-foreground font-medium text-lg">
                We'll text you a six-digit code to verify your mobile number.
              </p>
              
              <form onSubmit={handlePhoneSubmit} className="space-y-6 pt-4">
                <Input 
                  type="tel" 
                  placeholder="(555) 555-5555" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-card border-card-border h-16 text-center text-2xl font-bold tracking-widest"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-xl"
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
              <h1 className="text-3xl font-black uppercase tracking-tight">ENTER YOUR CODE</h1>
              <p className="text-muted-foreground font-medium">
                Sent to {phone}
              </p>
              
              <div className="flex justify-center py-4">
                <InputOTP 
                  maxLength={6} 
                  value={code} 
                  onChange={setCode}
                  onComplete={handleVerify}
                  disabled={verifyAttendee.isPending}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-14 text-2xl font-bold bg-card border-card-border rounded-lg" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-2xl font-bold bg-card border-card-border rounded-lg" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-2xl font-bold bg-card border-card-border rounded-lg" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-2xl font-bold bg-card border-card-border rounded-lg" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-2xl font-bold bg-card border-card-border rounded-lg" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-2xl font-bold bg-card border-card-border rounded-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleVerify}
                  className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-xl"
                  disabled={code.length !== 6 || verifyAttendee.isPending}
                >
                  {verifyAttendee.isPending ? <Loader2 className="animate-spin w-6 h-6" /> : "VERIFY"}
                </Button>
                
                <button 
                  onClick={() => setStep('phone')} 
                  className="text-muted-foreground text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
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
