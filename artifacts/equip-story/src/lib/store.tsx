import { createContext, useContext, useState, ReactNode } from 'react';
import type { Attendee } from '@workspace/api-client-react';

interface AppState {
  attendee: Attendee | null;
  setAttendee: (a: Attendee | null) => void;
  storyId: number | null;
  setStoryId: (id: number | null) => void;
  clearState: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [attendee, setAttendeeState] = useState<Attendee | null>(() => {
    try {
      const saved = sessionStorage.getItem('equip_attendee');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [storyId, setStoryIdState] = useState<number | null>(() => {
    try {
      const saved = sessionStorage.getItem('equip_story_id');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setAttendee = (a: Attendee | null) => {
    setAttendeeState(a);
    if (a) sessionStorage.setItem('equip_attendee', JSON.stringify(a));
    else sessionStorage.removeItem('equip_attendee');
  };

  const setStoryId = (id: number | null) => {
    setStoryIdState(id);
    if (id) sessionStorage.setItem('equip_story_id', JSON.stringify(id));
    else sessionStorage.removeItem('equip_story_id');
  };

  const clearState = () => {
    setAttendee(null);
    setStoryId(null);
  };

  return (
    <AppContext.Provider value={{ attendee, setAttendee, storyId, setStoryId, clearState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}
