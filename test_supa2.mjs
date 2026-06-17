import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('maintenance_records').update({ status: 'Scheduled' }).eq('id', 'non-existent-id');
  console.log('Update Error:', error);

  const { data: cols, error: colError } = await supabase.from('maintenance_records').select('*').limit(1);
  console.log('Columns:', cols ? Object.keys(cols[0] || {}) : 'No data', 'Error:', colError);
}

run();
