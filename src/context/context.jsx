import { createContext, useEffect, useMemo, useState } from 'react';
import runChat from '../config/gemini';
import { loadUserChats, saveUserChat, supabase } from '../lib/supabase';

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }

    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await loadUserChats(session.user.id);
        const mapped = (data ?? []).map((chat) => ({
          id: chat.id,
          prompt: chat.prompt,
          response: chat.response,
        }));
        setChatHistory(mapped);
      } else {
        setChatHistory([]);
      }
    };

    syncUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await loadUserChats(session.user.id);
        const mapped = (data ?? []).map((chat) => ({
          id: chat.id,
          prompt: chat.prompt,
          response: chat.response,
        }));
        setChatHistory(mapped);
      } else {
        setChatHistory([]);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const startNewChat = () => {
    setCurrentChatId(null);
    setCurrentPrompt('');
    setResultData('');
    setShowResults(false);
    setLoading(false);
    setInput('');
  };

  const openChat = (chat) => {
    setCurrentChatId(chat.id);
    setCurrentPrompt(chat.prompt);
    setResultData(chat.response);
    setShowResults(true);
    setLoading(false);
    setInput('');
  };

  const onSent = async (prompt = input) => {
    const trimmedPrompt = prompt?.trim();
    if (!trimmedPrompt) {
      console.log('Type something first');
      return '';
    }

    const newChatId = currentChatId ?? Date.now();
    const loadingStartedAt = Date.now();
    const minimumLoadingMs = 1500;

    setLoading(true);
    setShowResults(true);
    setCurrentPrompt(trimmedPrompt);
    setResultData('');

    const response = await runChat(trimmedPrompt);
    const elapsed = Date.now() - loadingStartedAt;

    if (elapsed < minimumLoadingMs) {
      await new Promise((resolve) => setTimeout(resolve, minimumLoadingMs - elapsed));
    }

    setResultData(response);
    setRecentPrompts((prev) => [trimmedPrompt, ...prev.filter((item) => item !== trimmedPrompt)].slice(0, 6));

    let savedId = newChatId;
    if (user?.id && supabase) {
      const { data, error } = await saveUserChat({
        userId: user.id,
        prompt: trimmedPrompt,
        response,
      });

      if (!error && data?.id) {
        savedId = data.id;
      }
    }

    setChatHistory((prev) => {
      const existing = prev.find((chat) => chat.id === savedId || chat.id === newChatId);
      const nextEntry = { id: savedId, prompt: trimmedPrompt, response };

      if (existing) {
        return [nextEntry, ...prev.filter((chat) => chat.id !== savedId && chat.id !== newChatId)].slice(0, 6);
      }

      return [nextEntry, ...prev].slice(0, 6);
    });

    setCurrentChatId(savedId);
    setLoading(false);
    setInput('');

    return response;
  };

  const contextValue = useMemo(() => ({
    onSent,
    recentPrompts,
    setRecentPrompts,
    chatHistory,
    setChatHistory,
    openChat,
    startNewChat,
    showResults,
    loading,
    setInput,
    input,
    currentPrompt,
    setCurrentPrompt,
    resultData,
    setResultData,
    currentChatId,
    setCurrentChatId,
    user,
  }), [recentPrompts, chatHistory, currentChatId, showResults, loading, input, currentPrompt, resultData, user]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;