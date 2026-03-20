import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvvhnyzthkvwtozwkooo.supabase.co';
const supabaseAnonKey = 'sb_publishable_s8MY1Orkyqh5vhy_bV3OJQ_kIQbN0xI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);