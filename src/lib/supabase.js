import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const loadUserChats = async (userId) => {
  if (!supabase || !userId) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data ?? [], error };
};

export const saveUserChat = async ({ userId, prompt, response }) => {
  if (!supabase || !userId) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('chats')
    .insert([
      {
        user_id: userId,
        prompt,
        response,
      },
    ])
    .select()
    .single();

  return { data, error };
};
