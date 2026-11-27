import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  'https://ueysbgkcegvrwrsmhyer.supabase.co'

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_GUTu7cEB5VZR6T3Jf_m6gg_vFIWbC4y'

// Check if credentials are properly configured
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabasePublishableKey) &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('demo-project')
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
