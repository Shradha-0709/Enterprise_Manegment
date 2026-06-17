import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const spareParts = [
  { part_name: '1TB NVMe SSD', quantity: 15, reorder_level: 5, unit_cost: 6500, location: 'IT Store Room' },
  { part_name: '32GB DDR5 RAM', quantity: 8, reorder_level: 10, unit_cost: 8500, location: 'IT Store Room' },
  { part_name: 'Cat6 Ethernet Cable (10m)', quantity: 45, reorder_level: 20, unit_cost: 350, location: 'Server Room Cabling Rack' },
  { part_name: 'Daikin AC Filter Set', quantity: 2, reorder_level: 5, unit_cost: 1200, location: 'Facility Locker 2' },
  { part_name: 'Ergonomic Mouse (Logitech)', quantity: 12, reorder_level: 5, unit_cost: 2500, location: 'IT Store Room' },
  { part_name: 'Monitor Desk Mount', quantity: 4, reorder_level: 5, unit_cost: 4500, location: 'IT Store Room' },
];

async function run() {
  const { error: delErr } = await supabase.from('inventory').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Delete old:', delErr);
  const { error: insErr } = await supabase.from('inventory').insert(spareParts);
  console.log('Insert new:', insErr);
}
run();
