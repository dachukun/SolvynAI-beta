
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ansxhdqnocqmwsaozuml.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc3hoZHFub2NxbXdzYW96dW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTY4MjAsImV4cCI6MjA1Nzc3MjgyMH0.WTdKrnXlIqvtwQA_oZTCBvOEFIKBSNDQkNZ3nbIlrqA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
