import { createClient } from '@supabase/supabase-js';

// Chiavi di configurazione Supabase
const supabaseUrl = 'https://skcjdqvibzstuxdubjry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2pkcXZpYnpzdHV4ZHVianJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDc0MTAsImV4cCI6MjA3OTY4MzQxMH0.sjCuGrUuXfiV7WrobN3pwtwDn0XlPE-W-CPEGkH4-bs';

export const supabase = createClient(supabaseUrl, supabaseKey);