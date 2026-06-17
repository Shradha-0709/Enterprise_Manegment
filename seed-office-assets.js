import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const officeAssets = [
  { name: 'Daikin 2.0 Ton Split AC', category: 'Office', serial_number: 'DKN-AC-001', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Facility Team', purchase_cost: 65000, purchase_date: '2025-08-12' },
  { name: 'Ergonomic Office Chair', category: 'Office', serial_number: 'EOC-101', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Facility Team', purchase_cost: 15000, purchase_date: '2026-01-10' },
  { name: 'Standing Desk Pro', category: 'Office', serial_number: 'SDP-202', location: 'Floor 2 - Marketing', status: 'Operational', owner_team: 'Facility Team', purchase_cost: 35000, purchase_date: '2026-02-05' },
  { name: 'Conference Table (8 Seater)', category: 'Office', serial_number: 'CT-8S-01', location: 'Meeting Room 1', status: 'Operational', owner_team: 'Facility Team', purchase_cost: 55000, purchase_date: '2025-11-20' },
  { name: 'Blue Star Water Dispenser', category: 'Office', serial_number: 'BSW-002', location: 'Pantry - Floor 2', status: 'Under Maintenance', owner_team: 'Facility Team', purchase_cost: 12000, purchase_date: '2024-06-15' }
];

async function run() {
  const { error: insErr } = await supabase.from('assets').insert(officeAssets);
  console.log('Insert office assets:', insErr);
}
run();
