import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const mockAssets = [
  { name: 'MacBook Pro M2', category: 'Laptops & PCs', serial_number: 'MBP-2026-001', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 150000, purchase_date: '2026-01-15' },
  { name: 'Dell XPS 15', category: 'Laptops & PCs', serial_number: 'DXP-2026-002', location: 'Floor 2 - Marketing', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 130000, purchase_date: '2026-02-10' },
  { name: 'Cisco Catalyst Switch', category: 'Networking Equipment', serial_number: 'CSW-9901', location: 'Server Room A', status: 'Operational', owner_team: 'Maintenance Team', purchase_cost: 45000, purchase_date: '2025-11-20' },
  { name: 'Dell PowerEdge R740', category: 'Servers', serial_number: 'DPE-001', location: 'Server Room A', status: 'Under Maintenance', owner_team: 'Maintenance Team', purchase_cost: 350000, purchase_date: '2025-05-10' },
  { name: 'Logitech MX Master 3', category: 'Peripherals', serial_number: 'LMX-9092', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 8000, purchase_date: '2026-03-01' }
];

async function run() {
  const { error: delErr } = await supabase.from('assets').delete().neq('id', 0);
  console.log('Delete old:', delErr);
  const { error: insErr } = await supabase.from('assets').insert(mockAssets);
  console.log('Insert new:', insErr);
}
run();
