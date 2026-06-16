// State Management Cache
let state = {
    assets: [],
    maintenance: [],
    vendors: [],
    inventory: [],
    activeSection: 'dashboard'
};

// Map sections to page headers
const sectionMeta = {
    dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of enterprise assets, work tickets, and stock warnings.',
        btnText: 'Register Asset',
        action: () => openAddAssetModal()
    },
    assets: {
        title: 'Assets Directory',
        subtitle: 'Manage company assets, categories, and warranty records.',
        btnText: 'Register Asset',
        action: () => openAddAssetModal()
    },
    maintenance: {
        title: 'Maintenance Schedules',
        subtitle: 'Schedule preventive maintenance and process corrective work tickets.',
        btnText: 'Schedule Work',
        action: () => openAddMaintenanceModal()
    },
    vendors: {
        title: 'Vendor Directory & AMC',
        subtitle: 'Manage service providers, contacts, and active AMC contract terms.',
        btnText: 'Add Vendor',
        action: () => openAddVendorModal()
    },
    inventory: {
        title: 'Spare Parts Inventory',
        subtitle: 'Monitor stock levels, warehouse locations, and reorder alerts.',
        btnText: 'Add Spare Part',
        action: () => openAddInventoryModal()
    },
    reports: {
        title: 'Operations Analytics',
        subtitle: 'View asset utilization metrics, total maintenance costs, and downtime summaries.',
        btnText: '',
        action: null
    }
};

// Document Load Event
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// App Initialization
async function initApp() {
    setupEventListeners();
    handleHashRouting();
    await syncAllData();
}

// Event Listeners
function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            window.location.hash = section;
        });
    });

    // Hash change router
    window.addEventListener('hashchange', handleHashRouting);

    // Refresh Button
    document.getElementById('refreshBtn').addEventListener('click', async () => {
        const btn = document.getElementById('refreshBtn');
        btn.disabled = true;
        const origContent = btn.innerHTML;
        btn.innerHTML = `<span class="material-symbols-rounded">sync</span> Syncing...`;
        await syncAllData();
        btn.disabled = false;
        btn.innerHTML = origContent;
    });

    // Global Action Button
    document.getElementById('globalActionBtn').addEventListener('click', () => {
        if (sectionMeta[state.activeSection] && sectionMeta[state.activeSection].action) {
            sectionMeta[state.activeSection].action();
        }
    });

    // Mobile Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar on clicking main content in mobile view
    document.querySelector('.main-content').addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });

    // Search and Filters for Assets
    const assetSearch = document.getElementById('assetSearchInput');
    if (assetSearch) assetSearch.addEventListener('input', renderAssets);
    
    const catFilter = document.getElementById('assetCategoryFilter');
    if (catFilter) catFilter.addEventListener('change', renderAssets);
    
    const statFilter = document.getElementById('assetStatusFilter');
    if (statFilter) statFilter.addEventListener('change', renderAssets);

    // Modal forms submission
    document.getElementById('assetForm').addEventListener('submit', handleAssetSubmit);
    document.getElementById('maintenanceForm').addEventListener('submit', handleMaintenanceSubmit);
    document.getElementById('vendorForm').addEventListener('submit', handleVendorSubmit);
    document.getElementById('inventoryForm').addEventListener('submit', handleInventorySubmit);
}

// Router
function handleHashRouting() {
    let hash = window.location.hash.substring(1);
    if (!hash || !sectionMeta[hash]) {
        hash = 'dashboard';
    }
    switchSection(hash);
}

// Switch Section (UI Update)
function switchSection(sectionId) {
    state.activeSection = sectionId;
    
    // Update active nav link
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update main section displays
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    const targetSection = document.getElementById(`${sectionId}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update headers
    const meta = sectionMeta[sectionId];
    if (meta) {
        document.getElementById('pageTitle').textContent = meta.title;
        document.getElementById('pageSubtitle').textContent = meta.subtitle;
        
        const actionBtn = document.getElementById('globalActionBtn');
        if (meta.btnText) {
            actionBtn.style.display = 'inline-flex';
            actionBtn.innerHTML = `<span class="material-symbols-rounded">add</span> ${meta.btnText}`;
        } else {
            actionBtn.style.display = 'none';
        }
    }
}

// Fetch data from Supabase
async function syncAllData() {
    if (!window.supabaseClient) {
        showToast("Supabase client is not initialized. Please verify config.js.", "error");
        return;
    }

    try {
        const [assetsRes, maintRes, vendorsRes, invRes] = await Promise.all([
            window.supabaseClient.from('assets').select('*'),
            window.supabaseClient.from('maintenance_records').select('*'),
            window.supabaseClient.from('vendors').select('*'),
            window.supabaseClient.from('inventory').select('*')
        ]);

        // Check for common connection/schema errors
        if (assetsRes.error && assetsRes.error.code === 'PGRST205') {
            displaySchemaSetupError();
            return;
        }

        if (assetsRes.error) throw assetsRes.error;
        if (maintRes.error) throw maintRes.error;
        if (vendorsRes.error) throw vendorsRes.error;
        if (invRes.error) throw invRes.error;

        state.assets = assetsRes.data || [];
        state.maintenance = maintRes.data || [];
        state.vendors = vendorsRes.data || [];
        state.inventory = invRes.data || [];

        // Redraw Views
        updateMetrics();
        populateFormSelectors();
        renderDashboard();
        renderAssets();
        renderMaintenance();
        renderVendors();
        renderInventory();
        renderReports();
        
        showToast("Synchronized successfully with Supabase.", "success");
    } catch (error) {
        console.error("Data syncing error:", error);
        showToast(`Sync Error: ${error.message || error}`, "error");
    }
}

// Display Database Schema Setup warning
function displaySchemaSetupError() {
    const main = document.querySelector('.main-content');
    main.innerHTML = `
        <div class="panel" style="margin-top: 40px; border-left: 5px solid var(--danger); background: rgba(239, 68, 68, 0.05);">
            <div style="display: flex; gap: 20px; align-items: flex-start;">
                <span class="material-symbols-rounded" style="font-size: 48px; color: var(--danger);">warning</span>
                <div>
                    <h2 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 8px;">Database Setup Required</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">
                        It looks like the necessary tables do not exist in your Supabase project yet. 
                        Please execute the SQL database setup script from the <strong>implementation_plan.md</strong> 
                        in the Supabase SQL Editor.
                    </p>
                    <button class="btn btn-primary" onclick="window.location.reload();">
                        <span class="material-symbols-rounded">refresh</span> Retry Connection
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update Dashboard Statistics Cards
function updateMetrics() {
    // Total Registered Assets
    document.getElementById('metricAssets').textContent = state.assets.length;
    
    // Active/Pending Tickets (Scheduled, In Progress, In Review)
    const pendingCount = state.maintenance.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled').length;
    document.getElementById('metricPendingTickets').textContent = pendingCount;
    
    // Low Stock Spare Parts (Quantity <= Reorder Level)
    const lowStockCount = state.inventory.filter(i => i.quantity <= i.reorder_level).length;
    document.getElementById('metricLowStock').textContent = lowStockCount;
    
    // Total Maintenance Costs
    const totalCost = state.maintenance.reduce((sum, item) => sum + Number(item.cost || 0), 0);
    document.getElementById('metricTotalCost').textContent = 
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalCost);
}

// Populate Modal Forms Selector options
function populateFormSelectors() {
    // Populate assets list in maintenance ticket modal select
    const assetSelect = document.getElementById('maintAsset');
    assetSelect.innerHTML = '<option value="">Select Target Asset</option>';
    state.assets.forEach(asset => {
        const opt = document.createElement('option');
        opt.value = asset.id;
        opt.textContent = `${asset.name} (${asset.serial_number || 'N/A'})`;
        assetSelect.appendChild(opt);
    });
}

// Render Dashboard Sections
function renderDashboard() {
    // 1. Upcoming scheduled maintenance
    const ticketsBody = document.querySelector('#dashboardTicketsTable tbody');
    ticketsBody.innerHTML = '';
    
    // Get latest 5 pending tickets
    const pendingTickets = [...state.maintenance]
        .filter(t => t.status !== 'Completed' && t.status !== 'Cancelled')
        .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
        .slice(0, 5);

    if (pendingTickets.length === 0) {
        ticketsBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon">done_all</span>
                    <div class="empty-state-title">No pending tickets</div>
                </td>
            </tr>
        `;
    } else {
        pendingTickets.forEach(ticket => {
            const row = document.createElement('tr');
            const asset = state.assets.find(a => a.id === ticket.asset_id);
            const assetName = asset ? asset.name : 'Unknown Asset';
            const scheduledDate = new Date(ticket.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const statusClass = `badge badge-${ticket.status.toLowerCase().replace(' ', '')}`;

            row.innerHTML = `
                <td style="font-weight: 500;">${assetName}</td>
                <td>${ticket.type}</td>
                <td style="color: var(--text-secondary);">${scheduledDate}</td>
                <td><span class="${statusClass}">${ticket.status}</span></td>
            `;
            ticketsBody.appendChild(row);
        });
    }

    // 2. Low stock parts warning list
    const stockBody = document.querySelector('#dashboardStockTable tbody');
    stockBody.innerHTML = '';

    const lowStockParts = [...state.inventory]
        .filter(i => i.quantity <= i.reorder_level)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5);

    if (lowStockParts.length === 0) {
        stockBody.innerHTML = `
            <tr>
                <td colspan="2" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon" style="color: var(--success);">check_circle</span>
                    <div class="empty-state-title">All stock levels normal</div>
                </td>
            </tr>
        `;
    } else {
        lowStockParts.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight: 500;">${item.part_name}</td>
                <td>
                    <span class="badge badge-lowstock">${item.quantity} units (Min: ${item.reorder_level})</span>
                </td>
            `;
            stockBody.appendChild(row);
        });
    }
}

// Render Assets directory list
function renderAssets() {
    const tbody = document.getElementById('assetsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const query = document.getElementById('assetSearchInput').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('assetCategoryFilter').value;
    const statusFilter = document.getElementById('assetStatusFilter').value;
    
    const filteredAssets = state.assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(query) || 
                              (asset.serial_number && asset.serial_number.toLowerCase().includes(query)) ||
                              (asset.location && asset.location.toLowerCase().includes(query));
        
        const matchesCategory = categoryFilter === '' || asset.category === categoryFilter;
        const matchesStatus = statusFilter === '' || asset.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (filteredAssets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon">search_off</span>
                    <div class="empty-state-title">No assets found</div>
                    <div class="empty-state-desc">Try resetting your filters or register a new asset.</div>
                </td>
            </tr>
        `;
        return;
    }

    filteredAssets.forEach(asset => {
        const row = document.createElement('tr');
        const statusClass = `badge badge-${asset.status.toLowerCase().replace(' ', '')}`;
        const purchaseDate = new Date(asset.purchase_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const purchaseCost = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(asset.purchase_cost);

        row.innerHTML = `
            <td style="font-weight: 500;">${asset.name}</td>
            <td>${asset.category}</td>
            <td style="color: var(--text-secondary); font-family: monospace;">${asset.serial_number || 'N/A'}</td>
            <td>${asset.location}</td>
            <td><span class="${statusClass}">${asset.status}</span></td>
            <td>${asset.owner_team}</td>
            <td style="font-weight: 600;">${purchaseCost} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">(${purchaseDate})</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-icon-edit" onclick="openEditAssetModal('${asset.id}')" title="Edit Asset Details">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="btn-icon btn-icon-delete" onclick="deleteAsset('${asset.id}')" title="Remove Asset">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Kanban board maintenance tickets
function renderMaintenance() {
    const statuses = ['Scheduled', 'In Progress', 'In Review', 'Completed'];
    
    // Clear counts and containers
    statuses.forEach(status => {
        const containerId = `cards-${status.replace(' ', '')}`;
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
        
        const countEl = document.getElementById(`count-${status.replace(' ', '')}`);
        if (countEl) countEl.textContent = '0';
    });

    // Populate tickets
    state.maintenance.forEach(ticket => {
        // Exclude cancelled tickets from standard kanban view
        if (ticket.status === 'Cancelled') return;

        const statusKey = ticket.status.replace(' ', '');
        const container = document.getElementById(`cards-${statusKey}`);
        
        if (container) {
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.draggable = true;
            card.id = `ticket-card-${ticket.id}`;
            card.dataset.ticketId = ticket.id;
            
            // Drag and drop event bindings
            card.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', ticket.id);
                card.style.opacity = '0.5';
            };
            card.ondragend = () => {
                card.style.opacity = '1';
            };

            // Double click to edit ticket
            card.ondblclick = () => openEditMaintenanceModal(ticket.id);

            // Fetch target asset info
            const asset = state.assets.find(a => a.id === ticket.asset_id);
            const assetName = asset ? asset.name : 'Unknown Asset';
            const location = asset ? asset.location : 'Unknown Location';

            const typeClass = ticket.type === 'Preventive' ? 'badge badge-low' : 'badge badge-high';
            const description = ticket.description || 'No maintenance details provided.';
            
            const costFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(ticket.cost);

            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                    <span class="${typeClass}">${ticket.type}</span>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn-icon btn-icon-edit" style="width: 24px; height: 24px; font-size: 14px;" onclick="openEditMaintenanceModal('${ticket.id}')">
                            <span class="material-symbols-rounded" style="font-size: 14px;">edit</span>
                        </button>
                        <button class="btn-icon btn-icon-delete" style="width: 24px; height: 24px; font-size: 14px;" onclick="deleteMaintenance('${ticket.id}')">
                            <span class="material-symbols-rounded" style="font-size: 14px;">delete</span>
                        </button>
                    </div>
                </div>
                <div class="task-title">${assetName}</div>
                <div class="task-desc">${description}</div>
                <div class="task-meta">
                    <div class="meta-row">
                        <div class="meta-item"><span class="material-symbols-rounded">pin_drop</span> ${location}</div>
                    </div>
                    <div class="meta-row" style="margin-top: 4px;">
                        <div class="meta-item"><span class="material-symbols-rounded">engineering</span> ${ticket.assigned_team}</div>
                        <div class="meta-item"><span class="material-symbols-rounded">payments</span> ${costFormatted}</div>
                    </div>
                    <div class="meta-row" style="margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 6px;">
                        <div class="meta-item"><span class="material-symbols-rounded">calendar_today</span> ${new Date(ticket.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        ${ticket.downtime_hours > 0 ? `<div class="meta-item" style="color: var(--danger);"><span class="material-symbols-rounded" style="color:var(--danger);">hourglass_empty</span> ${ticket.downtime_hours} hrs</div>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
    });

    // Update column counters
    statuses.forEach(status => {
        const statusKey = status.replace(' ', '');
        const container = document.getElementById(`cards-${statusKey}`);
        const countEl = document.getElementById(`count-${statusKey}`);
        
        if (container && countEl) {
            const count = container.children.length;
            countEl.textContent = count;
            
            if (count === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="padding: 24px 12px; min-height: 200px;">
                        <span class="material-symbols-rounded empty-state-icon" style="font-size: 32px;">verified</span>
                        <div class="empty-state-title" style="font-size: 0.82rem;">No schedules</div>
                    </div>
                `;
            }
        }
    });
}

// Drag & Drop event helpers for maintenance Kanban
function allowDrop(e) {
    e.preventDefault();
}

async function dropTicket(e) {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    if (!ticketId) return;

    let targetColumn = e.target.closest('.kanban-column');
    if (!targetColumn) return;
    
    const newStatus = targetColumn.dataset.status;

    // Optimistically update state
    const ticket = state.maintenance.find(t => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    const oldStatus = ticket.status;
    
    // If completed status, make sure we ask for completed_date
    let updateFields = { status: newStatus };
    if (newStatus === 'Completed' && !ticket.completed_date) {
        updateFields.completed_date = new Date().toISOString().split('T')[0];
        ticket.completed_date = updateFields.completed_date;
    }

    ticket.status = newStatus;
    renderMaintenance();

    try {
        const { error } = await window.supabaseClient
            .from('maintenance_records')
            .update(updateFields)
            .eq('id', ticketId);

        if (error) throw error;
        showToast(`Work order status updated to "${newStatus}"`, "success");
        updateMetrics();
        renderReports();
    } catch (error) {
        console.error("Error updating ticket status:", error);
        showToast("Failed to update status on server. Reverting...", "error");
        ticket.status = oldStatus;
        renderMaintenance();
    }
}

// Render Vendors & Contracts list
function renderVendors() {
    const tbody = document.getElementById('vendorsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (state.vendors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon">handshake</span>
                    <div class="empty-state-title">No service providers registered</div>
                    <button class="btn btn-primary" onclick="openAddVendorModal()">Register First Vendor</button>
                </td>
            </tr>
        `;
        return;
    }

    state.vendors.forEach(vendor => {
        const row = document.createElement('tr');
        
        let contractText = 'No active AMC contract';
        let contractStatusClass = 'badge badge-leave';
        
        if (vendor.amc_start_date && vendor.amc_end_date) {
            const start = new Date(vendor.amc_start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const end = new Date(vendor.amc_end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            // Check if active
            const today = new Date().toISOString().split('T')[0];
            if (today >= vendor.amc_start_date && today <= vendor.amc_end_date) {
                contractText = `Active (${start} - ${end})`;
                contractStatusClass = 'badge badge-active';
            } else {
                contractText = `Expired (${start} - ${end})`;
                contractStatusClass = 'badge badge-terminated';
            }
        }

        row.innerHTML = `
            <td style="font-weight: 500;">${vendor.name}</td>
            <td>${vendor.contact_name}</td>
            <td><a href="mailto:${vendor.email}" style="color:var(--secondary); text-decoration:none;">${vendor.email}</a></td>
            <td style="color: var(--text-secondary);">${vendor.phone}</td>
            <td><span class="${contractStatusClass}">${contractText}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-icon-edit" onclick="openEditVendorModal('${vendor.id}')" title="Edit Vendor Details">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="btn-icon btn-icon-delete" onclick="deleteVendor('${vendor.id}')" title="Remove Contract">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Spare parts stock inventory
function renderInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (state.inventory.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon">inventory</span>
                    <div class="empty-state-title">Warehouse inventory is empty</div>
                    <button class="btn btn-primary" onclick="openAddInventoryModal()">Add Spare Part</button>
                </td>
            </tr>
        `;
        return;
    }

    state.inventory.forEach(item => {
        const row = document.createElement('tr');
        const costFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(item.unit_cost);
        
        const isLowStock = item.quantity <= item.reorder_level;
        const statusBadge = isLowStock 
            ? '<span class="badge badge-lowstock">Low Stock Warning</span>' 
            : '<span class="badge badge-normal">Stock Sufficient</span>';

        row.innerHTML = `
            <td style="font-weight: 500;">${item.part_name}</td>
            <td style="font-weight: 600; font-size: 1rem;">${item.quantity} units</td>
            <td style="color: var(--text-secondary);">${item.reorder_level} units</td>
            <td style="font-weight: 600;">${costFormatted}</td>
            <td>${item.location}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-icon-edit" onclick="openEditInventoryModal('${item.id}')" title="Update Stock">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="btn-icon btn-icon-delete" onclick="deleteInventory('${item.id}')" title="Delete Part">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Reports & Utilizations Charts
function renderReports() {
    // 1. Asset Status Distribution Breakdown
    const breakdownContainer = document.getElementById('assetStatusBreakdown');
    if (breakdownContainer) {
        breakdownContainer.innerHTML = '';
        
        const statuses = ['Operational', 'Under Maintenance', 'Broken', 'Retired'];
        const total = state.assets.length;
        
        statuses.forEach(status => {
            const count = state.assets.filter(a => a.status === status).length;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            // Map statuses to color themes
            let barColor = 'var(--primary)';
            if (status === 'Operational') barColor = 'var(--success)';
            if (status === 'Under Maintenance') barColor = 'var(--secondary)';
            if (status === 'Broken') barColor = 'var(--danger)';
            if (status === 'Retired') barColor = 'var(--text-muted)';

            const item = document.createElement('div');
            item.className = 'progress-metric-item';
            
            item.innerHTML = `
                <div class="metric-header-row">
                    <span>${status}</span>
                    <span style="color: ${barColor}">${count} assets (${percentage}%)</span>
                </div>
                <div class="metric-bar-container">
                    <div class="metric-bar-fill" style="width: ${percentage}%; background: ${barColor}"></div>
                </div>
            `;
            breakdownContainer.appendChild(item);
        });
    }

    // 2. Cost Distribution Breakdown (Preventive vs Corrective)
    const costGrid = document.getElementById('costBreakdownGrid');
    if (costGrid) {
        costGrid.innerHTML = '';

        const preventiveCost = state.maintenance
            .filter(t => t.type === 'Preventive')
            .reduce((sum, t) => sum + Number(t.cost || 0), 0);
            
        const correctiveCost = state.maintenance
            .filter(t => t.type === 'Corrective')
            .reduce((sum, t) => sum + Number(t.cost || 0), 0);

        const totalCost = preventiveCost + correctiveCost;
        
        const prevPercent = totalCost > 0 ? Math.round((preventiveCost / totalCost) * 100) : 0;
        const corrPercent = totalCost > 0 ? Math.round((correctiveCost / totalCost) * 100) : 0;

        const prevCostFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(preventiveCost);
        const corrCostFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(correctiveCost);

        costGrid.innerHTML = `
            <div class="cost-item">
                <div class="cost-label">
                    <span class="dot" style="background: var(--success)"></span>
                    Preventive Maintenance
                </div>
                <div class="cost-value">${prevCostFormatted} <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:400;">(${prevPercent}%)</span></div>
            </div>
            <div class="cost-item">
                <div class="cost-label">
                    <span class="dot" style="background: var(--danger)"></span>
                    Corrective Maintenance
                </div>
                <div class="cost-value">${corrCostFormatted} <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:400;">(${corrPercent}%)</span></div>
            </div>
        `;
    }

    // 3. Downtime metrics
    const downtimeEl = document.getElementById('totalDowntimeVal');
    if (downtimeEl) {
        const totalDowntime = state.maintenance.reduce((sum, t) => sum + Number(t.downtime_hours || 0), 0);
        downtimeEl.textContent = `${totalDowntime} hrs`;
    }
}

// Modal handling utilities
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// CRUD Operations - Asset
function openAddAssetModal() {
    document.getElementById('assetModalTitle').textContent = "Register New Asset";
    document.getElementById('assetForm').reset();
    document.getElementById('assetId').value = '';
    
    // Set default dates
    document.getElementById('assetPurchaseDate').value = new Date().toISOString().split('T')[0];
    openModal('assetModal');
}

function openEditAssetModal(id) {
    const asset = state.assets.find(a => a.id === id);
    if (!asset) return;
    
    document.getElementById('assetModalTitle').textContent = "Edit Asset Details";
    document.getElementById('assetId').value = asset.id;
    document.getElementById('assetName').value = asset.name;
    document.getElementById('assetCategory').value = asset.category;
    document.getElementById('assetSerial').value = asset.serial_number || '';
    document.getElementById('assetStatus').value = asset.status;
    document.getElementById('assetOwner').value = asset.owner_team;
    document.getElementById('assetLocation').value = asset.location || '';
    document.getElementById('assetCost').value = asset.purchase_cost;
    document.getElementById('assetPurchaseDate').value = asset.purchase_date;
    document.getElementById('assetWarranty').value = asset.warranty_expiration || '';
    
    openModal('assetModal');
}

async function handleAssetSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('assetId').value;
    
    const assetData = {
        name: document.getElementById('assetName').value,
        category: document.getElementById('assetCategory').value,
        serial_number: document.getElementById('assetSerial').value || null,
        status: document.getElementById('assetStatus').value,
        owner_team: document.getElementById('assetOwner').value,
        location: document.getElementById('assetLocation').value,
        purchase_cost: Number(document.getElementById('assetCost').value),
        purchase_date: document.getElementById('assetPurchaseDate').value,
        warranty_expiration: document.getElementById('assetWarranty').value || null
    };

    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('assets')
                .update(assetData)
                .eq('id', id);
            
            if (error) throw error;
            showToast("Asset details updated successfully.", "success");
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('assets')
                .insert([assetData]);
            
            if (error) throw error;
            showToast("Asset registered successfully.", "success");
        }
        closeModal('assetModal');
        await syncAllData();
    } catch (error) {
        console.error("Asset submit error:", error);
        showToast(`Error saving asset: ${error.message || error}`, "error");
    }
}

async function deleteAsset(id) {
    if (!confirm("Are you sure you want to retire and remove this asset? All historical maintenance logs will be lost.")) return;

    try {
        const { error } = await window.supabaseClient
            .from('assets')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast("Asset removed successfully.", "success");
        await syncAllData();
    } catch (error) {
        console.error("Asset delete error:", error);
        showToast(`Error deleting asset: ${error.message || error}`, "error");
    }
}

// CRUD Operations - Maintenance schedules
function openAddMaintenanceModal() {
    document.getElementById('maintenanceModalTitle').textContent = "Schedule Maintenance Work";
    document.getElementById('maintenanceForm').reset();
    document.getElementById('maintenanceId').value = '';
    
    // Set default date
    document.getElementById('maintScheduledDate').value = new Date().toISOString().split('T')[0];
    openModal('maintenanceModal');
}

function openEditMaintenanceModal(id) {
    const ticket = state.maintenance.find(t => t.id === id);
    if (!ticket) return;
    
    document.getElementById('maintenanceModalTitle').textContent = "Edit Work Order";
    document.getElementById('maintenanceId').value = ticket.id;
    document.getElementById('maintAsset').value = ticket.asset_id;
    document.getElementById('maintType').value = ticket.type;
    document.getElementById('maintTeam').value = ticket.assigned_team;
    document.getElementById('maintDesc').value = ticket.description;
    document.getElementById('maintScheduledDate').value = ticket.scheduled_date;
    document.getElementById('maintCompletedDate').value = ticket.completed_date || '';
    document.getElementById('maintCost').value = ticket.cost;
    document.getElementById('maintDowntime').value = ticket.downtime_hours;
    document.getElementById('maintStatus').value = ticket.status;
    
    openModal('maintenanceModal');
}

async function handleMaintenanceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('maintenanceId').value;
    
    const ticketData = {
        asset_id: document.getElementById('maintAsset').value,
        type: document.getElementById('maintType').value,
        assigned_team: document.getElementById('maintTeam').value,
        description: document.getElementById('maintDesc').value,
        scheduled_date: document.getElementById('maintScheduledDate').value,
        completed_date: document.getElementById('maintCompletedDate').value || null,
        cost: Number(document.getElementById('maintCost').value),
        downtime_hours: Number(document.getElementById('maintDowntime').value),
        status: document.getElementById('maintStatus').value
    };

    // Auto update asset status based on work order status
    let targetAssetStatus = null;
    if (ticketData.status === 'In Progress') {
        targetAssetStatus = 'Under Maintenance';
    } else if (ticketData.status === 'Completed') {
        targetAssetStatus = 'Operational';
    }

    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('maintenance_records')
                .update(ticketData)
                .eq('id', id);
            
            if (error) throw error;
            showToast("Work order ticket updated.", "success");
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('maintenance_records')
                .insert([ticketData]);
            
            if (error) throw error;
            showToast("Work order ticket created.", "success");
        }

        // Run asset status update if status transitions
        if (targetAssetStatus) {
            await window.supabaseClient
                .from('assets')
                .update({ status: targetAssetStatus })
                .eq('id', ticketData.asset_id);
        }

        closeModal('maintenanceModal');
        await syncAllData();
    } catch (error) {
        console.error("Maintenance submit error:", error);
        showToast(`Error saving ticket: ${error.message || error}`, "error");
    }
}

async function deleteMaintenance(id) {
    if (!confirm("Are you sure you want to delete this maintenance schedule?")) return;

    try {
        const { error } = await window.supabaseClient
            .from('maintenance_records')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast("Maintenance ticket deleted.", "success");
        await syncAllData();
    } catch (error) {
        console.error("Maintenance delete error:", error);
        showToast(`Error deleting ticket: ${error.message || error}`, "error");
    }
}

// CRUD Operations - Vendor Contract
function openAddVendorModal() {
    document.getElementById('vendorModalTitle').textContent = "Add Vendor Contract";
    document.getElementById('vendorForm').reset();
    document.getElementById('vendorId').value = '';
    openModal('vendorModal');
}

function openEditVendorModal(id) {
    const vendor = state.vendors.find(v => v.id === id);
    if (!vendor) return;

    document.getElementById('vendorModalTitle').textContent = "Edit Vendor Details";
    document.getElementById('vendorId').value = vendor.id;
    document.getElementById('vendorName').value = vendor.name;
    document.getElementById('vendorContact').value = vendor.contact_name;
    document.getElementById('vendorEmail').value = vendor.email;
    document.getElementById('vendorPhone').value = vendor.phone;
    document.getElementById('vendorAmcStart').value = vendor.amc_start_date || '';
    document.getElementById('vendorAmcEnd').value = vendor.amc_end_date || '';

    openModal('vendorModal');
}

async function handleVendorSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('vendorId').value;

    const vendorData = {
        name: document.getElementById('vendorName').value,
        contact_name: document.getElementById('vendorContact').value,
        email: document.getElementById('vendorEmail').value,
        phone: document.getElementById('vendorPhone').value,
        amc_start_date: document.getElementById('vendorAmcStart').value || null,
        amc_end_date: document.getElementById('vendorAmcEnd').value || null
    };

    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('vendors')
                .update(vendorData)
                .eq('id', id);

            if (error) throw error;
            showToast("Vendor contract details updated.", "success");
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('vendors')
                .insert([vendorData]);

            if (error) throw error;
            showToast("Vendor contract added successfully.", "success");
        }
        closeModal('vendorModal');
        await syncAllData();
    } catch (error) {
        console.error("Vendor submit error:", error);
        showToast(`Error saving vendor: ${error.message || error}`, "error");
    }
}

async function deleteVendor(id) {
    if (!confirm("Are you sure you want to terminate this vendor contract registry?")) return;

    try {
        const { error } = await window.supabaseClient
            .from('vendors')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast("Vendor contract removed.", "success");
        await syncAllData();
    } catch (error) {
        console.error("Vendor delete error:", error);
        showToast(`Error deleting vendor: ${error.message || error}`, "error");
    }
}

// CRUD Operations - Inventory Spare Parts
function openAddInventoryModal() {
    document.getElementById('inventoryModalTitle').textContent = "Add Spare Part";
    document.getElementById('inventoryForm').reset();
    document.getElementById('inventoryId').value = '';
    openModal('inventoryModal');
}

function openEditInventoryModal(id) {
    const item = state.inventory.find(i => i.id === id);
    if (!item) return;

    document.getElementById('inventoryModalTitle').textContent = "Update Spare Part Stock";
    document.getElementById('inventoryId').value = item.id;
    document.getElementById('partName').value = item.part_name;
    document.getElementById('partQty').value = item.quantity;
    document.getElementById('partReorder').value = item.reorder_level;
    document.getElementById('partCost').value = item.unit_cost;
    document.getElementById('partLocation').value = item.location || '';

    openModal('inventoryModal');
}

async function handleInventorySubmit(e) {
    e.preventDefault();
    const id = document.getElementById('inventoryId').value;

    const inventoryData = {
        part_name: document.getElementById('partName').value,
        quantity: Number(document.getElementById('partQty').value),
        reorder_level: Number(document.getElementById('partReorder').value),
        unit_cost: Number(document.getElementById('partCost').value),
        location: document.getElementById('partLocation').value
    };

    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('inventory')
                .update(inventoryData)
                .eq('id', id);

            if (error) throw error;
            showToast("Spare part inventory details updated.", "success");
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('inventory')
                .insert([inventoryData]);

            if (error) throw error;
            showToast("Spare part registered to stock.", "success");
        }
        closeModal('inventoryModal');
        await syncAllData();
    } catch (error) {
        console.error("Inventory submit error:", error);
        showToast(`Error saving part: ${error.message || error}`, "error");
    }
}

async function deleteInventory(id) {
    if (!confirm("Are you sure you want to delete this spare part from stock list?")) return;

    try {
        const { error } = await window.supabaseClient
            .from('inventory')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast("Spare part removed from registry.", "success");
        await syncAllData();
    } catch (error) {
        console.error("Inventory delete error:", error);
        showToast(`Error deleting item: ${error.message || error}`, "error");
    }
}

// Toast notification helper
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'error') icon = 'warning';

    toast.innerHTML = `
        <span class="material-symbols-rounded toast-icon">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s reverse forwards';
        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}
