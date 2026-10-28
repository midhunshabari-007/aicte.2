import { createClient } from '@supabase/supabase-js';

// Default Supabase credentials provided for this project
const DEFAULT_SUPABASE_URL = 'https://gsvcpmzworoujwlpltue.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdmNwbXp3b3JvdWp3bHBsdHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwOTExMzUsImV4cCI6MjEwODY2NzEzNX0.iY3V3AZUR2FI59gWhkjRG2OyavBMAHf9hga33B35oo4';

export const getSupabaseConfig = () => {
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('aicte_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('aicte_supabase_anon_key') : null;

  let url = (storedUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL).trim();
  const key = (storedKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY).trim();

  // Normalize URL if user provided path like /rest/v1/
  if (url.includes('.supabase.co')) {
    const match = url.match(/https?:\/\/[a-z0-9]+\.supabase\.co/);
    if (match) {
      url = match[0];
    }
  } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}.supabase.co`;
  }

  const isConfigured = Boolean(url && key);

  return {
    url,
    key,
    isConfigured
  };
};

const config = getSupabaseConfig();

export const isSupabaseConfigured = config.isConfigured;

export const supabase = createClient(config.url, config.key);

export const saveSupabaseConfig = (url: string, key: string) => {
  let cleanUrl = url.trim();
  if (cleanUrl.includes('.supabase.co')) {
    const match = cleanUrl.match(/https?:\/\/[a-z0-9]+\.supabase\.co/);
    if (match) cleanUrl = match[0];
  } else if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}.supabase.co`;
  }
  localStorage.setItem('aicte_supabase_url', cleanUrl);
  localStorage.setItem('aicte_supabase_anon_key', key.trim());
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('aicte_supabase_url');
  localStorage.removeItem('aicte_supabase_anon_key');
};

/**
 * Checks whether the Supabase database has the necessary tables created
 */
export const checkSupabaseTablesExist = async (): Promise<{ exists: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.from('applications').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "applications" does not exist') || error.message.includes('not found')) {
        return {
          exists: false,
          message: 'Database connected, but tables are not created yet. Please execute the SQL Migration Script in Supabase SQL Editor.'
        };
      }
      return {
        exists: false,
        message: `Connection error: ${error.message}`
      };
    }
    return {
      exists: true,
      message: 'Supabase PostgreSQL connected and tables verified!'
    };
  } catch (err: any) {
    return {
      exists: false,
      message: `Network/connection error: ${err.message}`
    };
  }
};
