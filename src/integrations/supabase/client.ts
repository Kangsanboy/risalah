import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qopurdxonaxuleewaxvk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcHVyZHhvbmF4dWxlZXdheHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTE2MjYsImV4cCI6MjA4NzQyNzYyNn0.paLIo1sE6TLi2jSfdQPG1QYMnYNybs7rSjfPa1dFG48'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
