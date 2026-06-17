import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const moreAssets = [
  // Laptops & PCs
  { name: 'ThinkPad T14 Gen 3', category: 'Laptops & PCs', serial_number: 'TP-T14-001', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 110000, purchase_date: '2026-04-10' },
  { name: 'MacBook Air M2', category: 'Laptops & PCs', serial_number: 'MBA-2026-003', location: 'Floor 2 - HR', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 120000, purchase_date: '2026-05-15' },
  { name: 'HP EliteDesk 800', category: 'Laptops & PCs', serial_number: 'HPD-004', location: 'Floor 1 - Admin', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 85000, purchase_date: '2025-10-12' },
  { name: 'Mac Studio M2 Max', category: 'Laptops & PCs', serial_number: 'MS-M2-005', location: 'Floor 3 - Design', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 210000, purchase_date: '2026-03-20' },

  // Networking Equipment
  { name: 'Ubiquiti UniFi UAP-AC-PRO', category: 'Networking Equipment', serial_number: 'UBNT-AP-01', location: 'Ceiling - Floor 3', status: 'Operational', owner_team: 'Maintenance Team', purchase_cost: 15000, purchase_date: '2025-06-15' },
  { name: 'Ubiquiti UniFi UAP-AC-PRO', category: 'Networking Equipment', serial_number: 'UBNT-AP-02', location: 'Ceiling - Floor 2', status: 'Operational', owner_team: 'Maintenance Team', purchase_cost: 15000, purchase_date: '2025-06-15' },
  { name: 'Fortinet FortiGate 60F', category: 'Networking Equipment', serial_number: 'FG-60F-001', location: 'Server Room A', status: 'Operational', owner_team: 'Maintenance Team', purchase_cost: 85000, purchase_date: '2026-01-20' },
  { name: 'Cisco Meraki MX68', category: 'Networking Equipment', serial_number: 'CMX-68-001', location: 'Server Room B', status: 'Under Maintenance', owner_team: 'Maintenance Team', purchase_cost: 95000, purchase_date: '2024-11-10' },

  // Servers
  { name: 'HP ProLiant DL380 Gen10', category: 'Servers', serial_number: 'HPP-DL380-01', location: 'Server Room B', status: 'Operational', owner_team: 'Maintenance Team', purchase_cost: 420000, purchase_date: '2025-02-28' },
  { name: 'Dell PowerEdge R640', category: 'Servers', serial_number: 'DPE-R640-02', location: 'Server Room A', status: 'Operational', owner_team: 'Maintenance Team', purchase_cost: 380000, purchase_date: '2026-01-05' },
  { name: 'Synology RackStation RS2423+', category: 'Servers', serial_number: 'SYN-RS-001', location: 'Server Room A', status: 'Operational', owner_team: 'Maintenance Team', purchase_cost: 210000, purchase_date: '2025-08-14' },

  // Peripherals
  { name: 'Dell UltraSharp 27" 4K Monitor', category: 'Peripherals', serial_number: 'DELL-U27-01', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 45000, purchase_date: '2026-02-15' },
  { name: 'Dell UltraSharp 27" 4K Monitor', category: 'Peripherals', serial_number: 'DELL-U27-02', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 45000, purchase_date: '2026-02-15' },
  { name: 'Keychron K8 Pro Keyboard', category: 'Peripherals', serial_number: 'KCH-K8-01', location: 'Floor 3 - Dev', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 9000, purchase_date: '2026-03-10' },
  { name: 'Logitech Brio 4K Webcam', category: 'Peripherals', serial_number: 'LOG-B4K-01', location: 'Meeting Room 1', status: 'Operational', owner_team: 'Operations Team', purchase_cost: 16000, purchase_date: '2025-12-05' },
  { name: 'Epson EcoTank L3250 Printer', category: 'Peripherals', serial_number: 'EPS-L3250-01', location: 'Floor 2 - HR', status: 'Broken', owner_team: 'Operations Team', purchase_cost: 14000, purchase_date: '2024-05-22' }
];

async function run() {
  const { error: insErr } = await supabase.from('assets').insert(moreAssets);
  console.log('Insert more assets:', insErr);
}
run();
