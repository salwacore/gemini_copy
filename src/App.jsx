import React, { useEffect, useState } from 'react';
import Sidebar from './components/sidebar/sidebar.jsx';
import Main from './components/main/main.jsx';
import AuthScreen from './components/auth/AuthScreen.jsx';
import { supabase } from './lib/supabase';

const App = () => {
  const [activeView, setActiveView] = useState('main');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const handleSignOut = async () => {
    if (!supabase) {
      setSession(null);
      setActiveView('main');
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setAccountMenuOpen(false);
    setActiveView('main');
  };

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthReady(true);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return <div className="auth-loading">Loading…</div>;
  }

  if (!supabase || !session) {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <Main
        activeView={activeView}
        setActiveView={setActiveView}
        accountMenuOpen={accountMenuOpen}
        setAccountMenuOpen={setAccountMenuOpen}
        session={session}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default App;