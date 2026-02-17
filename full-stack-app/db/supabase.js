import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_LINK, process.env.SUPABASE_API_KEY)

export default supabase;