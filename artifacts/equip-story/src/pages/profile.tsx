import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateAttendee } from '@workspace/api-client-react';
import { useAppStore } from '@/lib/store';
import { MobileLayout } from '@/components/mobile-layout';
import { SlideUp } from '@/components/animations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BUSINESS_TYPES } from '@/lib/prompts';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  businessType: z.string().min(1, "Please select one")
});

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { setAttendee } = useAppStore();
  const createAttendee = useCreateAttendee();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      city: "",
      state: "",
      businessType: ""
    }
  });

  const selectedBusiness = form.watch("businessType");
  const businessInfo = BUSINESS_TYPES.find(b => b.value === selectedBusiness);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAttendee.mutate(
      {
        data: {
          ...values,
          mobileNumber: "PENDING_VERIFICATION", // Placeholder until next step
        }
      },
      {
        onSuccess: (attendee) => {
          setAttendee(attendee);
          setLocation('/story/verify');
        }
      }
    );
  };

  return (
    <MobileLayout theme="light">
      <div className="flex-1 flex flex-col p-6 max-h-full overflow-y-auto">
        <SlideUp delay={0.1}>
          <div className="mb-8">
            <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-navy">
              FIRST, TELL US A <br/>
              <span className="bg-chartreuse px-2 py-1 inline-block mt-2">LITTLE ABOUT YOU.</span>
            </h1>
          </div>
        </SlideUp>

        <SlideUp delay={0.2} className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-display uppercase tracking-widest text-navy font-bold">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="James" className="bg-white border-2 border-navy rounded-none h-14 text-lg font-medium text-navy focus-visible:ring-primary focus-visible:border-primary placeholder:text-navy/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-display uppercase tracking-widest text-navy font-bold">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" className="bg-white border-2 border-navy rounded-none h-14 text-lg font-medium text-navy focus-visible:ring-primary focus-visible:border-primary placeholder:text-navy/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-display uppercase tracking-widest text-navy font-bold">City</FormLabel>
                      <FormControl>
                        <Input placeholder="Louisville" className="bg-white border-2 border-navy rounded-none h-14 text-lg font-medium text-navy focus-visible:ring-primary focus-visible:border-primary placeholder:text-navy/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-display uppercase tracking-widest text-navy font-bold">State</FormLabel>
                      <FormControl>
                        <Input placeholder="KY" className="bg-white border-2 border-navy rounded-none h-14 text-lg font-medium text-navy uppercase focus-visible:ring-primary focus-visible:border-primary placeholder:text-navy/30" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full border-b-[3px] border-dashed border-primary my-8 opacity-50"></div>

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-display uppercase tracking-widest text-navy font-bold">What best describes your business?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-2 border-navy rounded-none h-14 text-lg font-medium text-navy focus:ring-primary">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-2 border-navy rounded-none">
                        {BUSINESS_TYPES.map((b) => (
                          <SelectItem key={b.value} value={b.value} className="py-3 text-base text-navy hover:bg-chartreuse focus:bg-chartreuse rounded-none cursor-pointer">
                            {b.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {businessInfo && (
                      <SlideUp delay={0}>
                        <p className="text-sm text-primary font-medium mt-2">
                          {businessInfo.description}
                        </p>
                      </SlideUp>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-8">
                <Button 
                  type="submit" 
                  className="w-full h-16 text-3xl font-display font-bold uppercase tracking-wider rounded-none bg-primary hover:bg-navy text-white transition-colors"
                  disabled={createAttendee.isPending}
                >
                  {createAttendee.isPending ? <Loader2 className="animate-spin w-6 h-6" /> : "CONTINUE"}
                </Button>
              </div>
            </form>
          </Form>
        </SlideUp>
      </div>
    </MobileLayout>
  );
}
