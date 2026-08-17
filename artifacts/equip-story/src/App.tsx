import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { AppProvider } from '@/lib/store';

// Pages
import PresentationPage from '@/pages/presentation';
import WelcomePage from '@/pages/welcome';
import ProfilePage from '@/pages/profile';
import VerifyPage from '@/pages/verify';
import ListenPage from '@/pages/listen';
import ThanksPage from '@/pages/thanks';
import IntelligencePage from '@/pages/intelligence';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={PresentationPage} />
        <Route path="/story" component={WelcomePage} />
        <Route path="/story/profile" component={ProfilePage} />
        <Route path="/story/verify" component={VerifyPage} />
        <Route path="/story/listen" component={ListenPage} />
        <Route path="/story/thanks" component={ThanksPage} />
        <Route path="/intelligence" component={IntelligencePage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;