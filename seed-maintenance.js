import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: assets, error: assetErr } = await supabase.from('assets').select('id, name, category').limit(20);
  if (assetErr || !assets || assets.length === 0) {
    console.error('No assets found to link maintenance records:', assetErr);
    return;
  }

  const ac = assets.find(a => a.name.includes('AC'));
  const server = assets.find(a => a.category === 'Servers');
  const macbook = assets.find(a => a.name.includes('MacBook'));
  const network = assets.find(a => a.category === 'Networking Equipment');
  
  const records = [];
  
  if (ac) {
    records.push({
      asset_id: ac.id,
      type: 'Preventive',
      assigned_team: 'Facility Team',
      description: '[Quarterly] Deep clean filters and check refrigerant levels',
      scheduled_date: '2026-07-01',
      status: 'Scheduled',
      cost: 0,
      downtime_hours: 0
    });
    records.push({
      asset_id: ac.id,
      type: 'Corrective',
      assigned_team: 'Facility Team',
      description: 'Water leaking from indoor unit',
      scheduled_date: '2026-06-15',
      status: 'Scheduled',
      cost: 0,
      downtime_hours: 2
    });
  }

  if (server) {
    records.push({
      asset_id: server.id,
      type: 'Preventive',
      assigned_team: 'Maintenance Team',
      description: '[Monthly] Firmware updates and disk health check',
      scheduled_date: '2026-06-25',
      status: 'Scheduled',
      cost: 0,
      downtime_hours: 0
    });
  }

  if (macbook) {
    records.push({
      asset_id: macbook.id,
      type: 'Corrective',
      assigned_team: 'Maintenance Team',
      description: 'Battery drains quickly, replacement needed',
      scheduled_date: '2026-06-16',
      status: 'Scheduled',
      cost: 8500,
      downtime_hours: 4
    });
  }

  if (network) {
    records.push({
      asset_id: network.id,
      type: 'Corrective',
      assigned_team: 'Maintenance Team',
      description: 'Intermittent packet loss on port 3',
      scheduled_date: '2026-06-10',
      status: 'Completed',
      completed_date: '2026-06-11',
      cost: 0,
      downtime_hours: 1
    });
  }

  records.push({
    asset_id: assets[0].id,
    type: 'Preventive',
    assigned_team: 'Facility Team',
    description: '[Annual] General physical inspection and tagging',
    scheduled_date: '2026-12-01',
    status: 'Scheduled',
    cost: 0,
    downtime_hours: 0
  });

  const { error: insErr } = await supabase.from('maintenance_records').insert(records);
  console.log('Insert maintenance records:', insErr);
}
run();
