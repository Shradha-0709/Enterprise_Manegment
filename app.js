// State Management Cache
let state = {
    employees: [],
    tasks: [],
    departments: [],
    activeSection: 'dashboard'
};

// Map sections to page headers
const sectionMeta = {
    dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of corporate operations and metrics.',
        btnText: 'New Employee',
        action: () => openAddEmployeeModal()
    },
    employees: {
        title: 'Employees',
        subtitle: 'Manage company personnel directory and details.',
        btnText: 'Add Employee',
        action: () => openAddEmployeeModal()
    },
    tasks: {
        title: 'Tasks & Projects',
        subtitle: 'Track team activities, workflows, and task progress.',
        btnText: 'Create Task',
        action: () => openAddTaskModal()
    },
    departments: {
        title: 'Departments',
        subtitle: 'Manage department organizational units and budgets.',
        btnText: 'New Department',
        action: () => openAddDepartmentModal()
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

    // Employee Search Input
    const empSearch = document.getElementById('employeeSearchInput');
    if (empSearch) {
        empSearch.addEventListener('input', renderEmployees);
    }

    // Modal forms submission
    document.getElementById('employeeForm').addEventListener('submit', handleEmployeeSubmit);
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    document.getElementById('departmentForm').addEventListener('submit', handleDepartmentSubmit);
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
        const [empRes, taskRes, deptRes] = await Promise.all([
            window.supabaseClient.from('employees').select('*'),
            window.supabaseClient.from('tasks').select('*'),
            window.supabaseClient.from('departments').select('*')
        ]);

        // Check for common connection/schema errors
        if (empRes.error && empRes.error.code === 'PGRST205') {
            displaySchemaSetupError();
            return;
        }

        if (empRes.error) throw empRes.error;
        if (taskRes.error) throw taskRes.error;
        if (deptRes.error) throw deptRes.error;

        state.employees = empRes.data || [];
        state.tasks = taskRes.data || [];
        state.departments = deptRes.data || [];

        // Redraw Views
        updateMetrics();
        populateFormSelectors();
        renderDashboard();
        renderEmployees();
        renderTasks();
        renderDepartments();
        
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
    // Total Employees
    document.getElementById('metricEmployees').textContent = state.employees.length;
    
    // Active Tasks (Todo, In Progress, In Review)
    const activeTasks = state.tasks.filter(t => t.status !== 'Done').length;
    document.getElementById('metricTasks').textContent = activeTasks;
    
    // Departments
    document.getElementById('metricDepartments').textContent = state.departments.length;
    
    // Total Payroll
    const totalPayroll = state.employees
        .filter(emp => emp.status === 'Active')
        .reduce((sum, emp) => sum + Number(emp.salary || 0), 0);
    
    document.getElementById('metricPayroll').textContent = 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalPayroll);
}

// Populate Modal Forms Selector options
function populateFormSelectors() {
    // Populate departments in employee modal select
    const deptSelect = document.getElementById('empDepartment');
    deptSelect.innerHTML = '<option value="">Select Department</option>';
    state.departments.forEach(dept => {
        const opt = document.createElement('option');
        opt.value = dept.id;
        opt.textContent = dept.name;
        deptSelect.appendChild(opt);
    });

    // Populate employees in tasks modal select
    const empSelect = document.getElementById('taskAssignee');
    empSelect.innerHTML = '<option value="">Unassigned</option>';
    state.employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.first_name} ${emp.last_name}`;
        empSelect.appendChild(opt);
    });
}

// Render Dashboard Lists
function renderDashboard() {
    // 1. Recent Tasks
    const recentTasksBody = document.querySelector('#recentTasksTable tbody');
    recentTasksBody.innerHTML = '';
    
    // Get latest 5 tasks
    const sortedTasks = [...state.tasks]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    if (sortedTasks.length === 0) {
        recentTasksBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon">assignment_late</span>
                    <div class="empty-state-title">No tasks found</div>
                </td>
            </tr>
        `;
    } else {
        sortedTasks.forEach(task => {
            const row = document.createElement('tr');
            
            // Assignee representation
            const assignee = state.employees.find(e => e.id === task.assigned_to);
            const assigneeName = assignee ? `${assignee.first_name} ${assignee.last_name}` : 'Unassigned';
            const initials = assignee ? `${assignee.first_name[0]}${assignee.last_name[0]}`.toUpperCase() : '?';
            
            // Priority pill class
            const priorityClass = `badge badge-${task.priority.toLowerCase()}`;
            // Status pill class
            const statusClass = `badge badge-${task.status.toLowerCase().replace(' ', '')}`;

            row.innerHTML = `
                <td style="font-weight: 500;">${task.title}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="assignee-avatar" style="width: 20px; height: 20px; font-size: 0.6rem;">${initials}</div>
                        <span>${assigneeName}</span>
                    </div>
                </td>
                <td><span class="${priorityClass}">${task.priority}</span></td>
                <td><span class="${statusClass}">${task.status}</span></td>
            `;
            recentTasksBody.appendChild(row);
        });
    }

    // 2. Recent Hires
    const recentHiresBody = document.querySelector('#recentHiresTable tbody');
    recentHiresBody.innerHTML = '';

    const sortedHires = [...state.employees]
        .sort((a, b) => new Date(b.join_date) - new Date(a.join_date))
        .slice(0, 5);

    if (sortedHires.length === 0) {
        recentHiresBody.innerHTML = `
            <tr>
                <td colspan="2" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon">person_off</span>
                    <div class="empty-state-title">No employees found</div>
                </td>
            </tr>
        `;
    } else {
        sortedHires.forEach(emp => {
            const row = document.createElement('tr');
            const initials = `${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase();
            const joinDate = new Date(emp.join_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            row.innerHTML = `
                <td>
                    <div class="avatar-cell">
                        <div class="avatar">${initials}</div>
                        <div>
                            <div class="user-name">${emp.first_name} ${emp.last_name}</div>
                            <div class="user-email">${emp.role}</div>
                        </div>
                    </div>
                </td>
                <td style="color: var(--text-secondary); font-size: 0.85rem;">${joinDate}</td>
            `;
            recentHiresBody.appendChild(row);
        });
    }
}

// Render Employees directory
function renderEmployees() {
    const tbody = document.getElementById('employeesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const query = document.getElementById('employeeSearchInput').value.toLowerCase().trim();
    
    const filteredEmployees = state.employees.filter(emp => {
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        const role = emp.role.toLowerCase();
        const email = emp.email.toLowerCase();
        
        // Match department name
        const dept = state.departments.find(d => d.id === emp.department_id);
        const deptName = dept ? dept.name.toLowerCase() : '';
        
        return fullName.includes(query) || role.includes(query) || email.includes(query) || deptName.includes(query);
    });

    if (filteredEmployees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <span class="material-symbols-rounded empty-state-icon">search_off</span>
                    <div class="empty-state-title">No employees matched search criteria</div>
                    <div class="empty-state-desc">Try double checking the spelling or add a new record.</div>
                </td>
            </tr>
        `;
        return;
    }

    filteredEmployees.forEach(emp => {
        const row = document.createElement('tr');
        const initials = `${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase();
        
        const dept = state.departments.find(d => d.id === emp.department_id);
        const deptName = dept ? dept.name : 'No Department';
        
        const statusClass = `badge badge-${emp.status.toLowerCase().replace(' ', '')}`;
        const salaryText = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(emp.salary);
        const joinDate = new Date(emp.join_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        row.innerHTML = `
            <td>
                <div class="avatar-cell">
                    <div class="avatar">${initials}</div>
                    <div>
                        <div class="user-name">${emp.first_name} ${emp.last_name}</div>
                        <div class="user-email">${emp.email}</div>
                    </div>
                </div>
            </td>
            <td>
                <div style="font-weight: 500;">${emp.role}</div>
                <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 2px;">${deptName}</div>
            </td>
            <td><span class="${statusClass}">${emp.status}</span></td>
            <td style="color: var(--text-secondary);">${joinDate}</td>
            <td style="font-weight: 600;">${salaryText}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-icon-edit" onclick="openEditEmployeeModal('${emp.id}')" title="Edit Employee">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="btn-icon btn-icon-delete" onclick="deleteEmployee('${emp.id}')" title="Delete Employee">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Kanban board tasks
function renderTasks() {
    const statuses = ['Todo', 'In Progress', 'In Review', 'Done'];
    
    // Clear counts and containers
    statuses.forEach(status => {
        const containerId = `cards-${status.replace(' ', '')}`;
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
        
        const countEl = document.getElementById(`count-${status.replace(' ', '')}`);
        if (countEl) countEl.textContent = '0';
    });

    // Populate tasks
    state.tasks.forEach(task => {
        const statusKey = task.status.replace(' ', '');
        const container = document.getElementById(`cards-${statusKey}`);
        
        if (container) {
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.draggable = true;
            card.id = `task-card-${task.id}`;
            card.dataset.taskId = task.id;
            
            // Drag and drop event bindings
            card.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', task.id);
                card.style.opacity = '0.5';
            };
            card.ondragend = () => {
                card.style.opacity = '1';
            };

            // Double click to edit task
            card.ondblclick = () => openEditTaskModal(task.id);

            // Fetch assignee
            const assignee = state.employees.find(e => e.id === task.assigned_to);
            const assigneeName = assignee ? `${assignee.first_name} ${assignee.last_name}` : 'Unassigned';
            const initials = assignee ? `${assignee.first_name[0]}${assignee.last_name[0]}`.toUpperCase() : '?';

            const priorityClass = `badge badge-${task.priority.toLowerCase()}`;
            const description = task.description || 'No description provided.';

            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                    <span class="${priorityClass}">${task.priority}</span>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn-icon btn-icon-edit" style="width: 24px; height: 24px; font-size: 14px;" onclick="openEditTaskModal('${task.id}')">
                            <span class="material-symbols-rounded" style="font-size: 14px;">edit</span>
                        </button>
                        <button class="btn-icon btn-icon-delete" style="width: 24px; height: 24px; font-size: 14px;" onclick="deleteTask('${task.id}')">
                            <span class="material-symbols-rounded" style="font-size: 14px;">delete</span>
                        </button>
                    </div>
                </div>
                <div class="task-title">${task.title}</div>
                <div class="task-desc">${description}</div>
                <div class="task-meta">
                    <div class="task-assignee" title="Assignee: ${assigneeName}">
                        <div class="assignee-avatar">${initials}</div>
                        <span>${assigneeName}</span>
                    </div>
                    ${task.due_date ? `<div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;"><span class="material-symbols-rounded" style="font-size: 14px;">calendar_today</span> ${new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>` : ''}
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
            
            // Render empty state placeholder if column is empty
            if (count === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="padding: 24px 12px; min-height: 200px;">
                        <span class="material-symbols-rounded empty-state-icon" style="font-size: 32px;">inbox</span>
                        <div class="empty-state-title" style="font-size: 0.85rem;">No tasks here</div>
                    </div>
                `;
            }
        }
    });
}

// Drag & Drop event helpers
function allowDrop(e) {
    e.preventDefault();
}

async function dropTask(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    // Find the target column status
    let targetColumn = e.target.closest('.kanban-column');
    if (!targetColumn) return;
    
    const newStatus = targetColumn.dataset.status;

    // Optimistically update the UI state
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const oldStatus = task.status;
    task.status = newStatus;
    renderTasks();

    try {
        const { error } = await window.supabaseClient
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', taskId);

        if (error) throw error;
        showToast(`Task status updated to "${newStatus}"`, "success");
        updateMetrics();
    } catch (error) {
        console.error("Error updating task status:", error);
        showToast("Failed to update status on server. Reverting...", "error");
        // Revert
        task.status = oldStatus;
        renderTasks();
    }
}

// Render Departments units
function renderDepartments() {
    const grid = document.getElementById('departmentsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';

    if (state.departments.length === 0) {
        grid.innerHTML = `
            <div class="panel empty-state" style="grid-column: 1 / -1;">
                <span class="material-symbols-rounded empty-state-icon">corporate_fare</span>
                <div class="empty-state-title">No Departments Registered</div>
                <button class="btn btn-primary" onclick="openAddDepartmentModal()">Add First Department</button>
            </div>
        `;
        return;
    }

    state.departments.forEach(dept => {
        // Count employees in this department
        const empCount = state.employees.filter(e => e.department_id === dept.id).length;
        
        // Sum payroll for this department
        const deptPayroll = state.employees
            .filter(e => e.department_id === dept.id && e.status === 'Active')
            .reduce((sum, e) => sum + Number(e.salary || 0), 0);

        const budgetFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(dept.budget);
        const payrollFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(deptPayroll);

        const card = document.createElement('div');
        card.className = 'panel dept-card';
        
        card.innerHTML = `
            <div class="dept-header">
                <div class="dept-name">${dept.name}</div>
                <div style="font-size: 0.8rem; background: rgba(99, 102, 241, 0.15); color: var(--primary); padding: 4px 10px; border-radius: 12px; font-weight: 600;">
                    ${empCount} Staff
                </div>
            </div>
            
            <div class="dept-stats">
                <div class="dept-stat-row">
                    <span class="dept-stat-label">Manager</span>
                    <span class="dept-stat-value">${dept.manager || 'Vacant'}</span>
                </div>
                <div class="dept-stat-row">
                    <span class="dept-stat-label">Annual Budget</span>
                    <span class="dept-stat-value" style="color: var(--success); font-weight: 600;">${budgetFormatted}</span>
                </div>
                <div class="dept-stat-row">
                    <span class="dept-stat-label">Payroll Allocated</span>
                    <span class="dept-stat-value" style="color: var(--secondary);">${payrollFormatted}</span>
                </div>
            </div>

            <div class="dept-actions">
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="openEditDepartmentModal('${dept.id}')">
                    <span class="material-symbols-rounded" style="font-size: 16px;">edit</span> Edit
                </button>
                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 0.8rem;" onclick="deleteDepartment('${dept.id}')">
                    <span class="material-symbols-rounded" style="font-size: 16px;">delete</span> Delete
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modal handling utilities
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// CRUD Operations - Employee
function openAddEmployeeModal() {
    document.getElementById('employeeModalTitle').textContent = "Add New Employee";
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
    openModal('employeeModal');
}

function openEditEmployeeModal(id) {
    const emp = state.employees.find(e => e.id === id);
    if (!emp) return;
    
    document.getElementById('employeeModalTitle').textContent = "Edit Employee";
    document.getElementById('employeeId').value = emp.id;
    document.getElementById('empFirstName').value = emp.first_name;
    document.getElementById('empLastName').value = emp.last_name;
    document.getElementById('empEmail').value = emp.email;
    document.getElementById('empRole').value = emp.role;
    document.getElementById('empDepartment').value = emp.department_id || '';
    document.getElementById('empSalary').value = emp.salary;
    document.getElementById('empStatus').value = emp.status;
    
    openModal('employeeModal');
}

async function handleEmployeeSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('employeeId').value;
    
    const employeeData = {
        first_name: document.getElementById('empFirstName').value,
        last_name: document.getElementById('empLastName').value,
        email: document.getElementById('empEmail').value,
        role: document.getElementById('empRole').value,
        department_id: document.getElementById('empDepartment').value || null,
        salary: Number(document.getElementById('empSalary').value),
        status: document.getElementById('empStatus').value
    };

    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('employees')
                .update(employeeData)
                .eq('id', id);
            
            if (error) throw error;
            showToast("Employee updated successfully.", "success");
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('employees')
                .insert([employeeData]);
            
            if (error) throw error;
            showToast("Employee added successfully.", "success");
        }
        closeModal('employeeModal');
        await syncAllData();
    } catch (error) {
        console.error("Employee submit error:", error);
        showToast(`Error saving employee: ${error.message || error}`, "error");
    }
}

async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to remove this employee? This will also unassign their tasks.")) return;

    try {
        const { error } = await window.supabaseClient
            .from('employees')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast("Employee removed successfully.", "success");
        await syncAllData();
    } catch (error) {
        console.error("Employee delete error:", error);
        showToast(`Error deleting employee: ${error.message || error}`, "error");
    }
}

// CRUD Operations - Task
function openAddTaskModal() {
    document.getElementById('taskModalTitle').textContent = "Create Task";
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    openModal('taskModal');
}

function openEditTaskModal(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    
    document.getElementById('taskModalTitle').textContent = "Edit Task";
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.description || '';
    document.getElementById('taskAssignee').value = task.assigned_to || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskDueDate').value = task.due_date || '';
    
    openModal('taskModal');
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDesc').value || null,
        assigned_to: document.getElementById('taskAssignee').value || null,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        due_date: document.getElementById('taskDueDate').value || null
    };

    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('tasks')
                .update(taskData)
                .eq('id', id);
            
            if (error) throw error;
            showToast("Task updated successfully.", "success");
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('tasks')
                .insert([taskData]);
            
            if (error) throw error;
            showToast("Task created successfully.", "success");
        }
        closeModal('taskModal');
        await syncAllData();
    } catch (error) {
        console.error("Task submit error:", error);
        showToast(`Error saving task: ${error.message || error}`, "error");
    }
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const { error } = await window.supabaseClient
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast("Task deleted successfully.", "success");
        await syncAllData();
    } catch (error) {
        console.error("Task delete error:", error);
        showToast(`Error deleting task: ${error.message || error}`, "error");
    }
}

// CRUD Operations - Department
function openAddDepartmentModal() {
    document.getElementById('departmentModalTitle').textContent = "Add Department";
    document.getElementById('departmentForm').reset();
    document.getElementById('departmentId').value = '';
    openModal('departmentModal');
}

function openEditDepartmentModal(id) {
    const dept = state.departments.find(d => d.id === id);
    if (!dept) return;

    document.getElementById('departmentModalTitle').textContent = "Edit Department";
    document.getElementById('departmentId').value = dept.id;
    document.getElementById('deptName').value = dept.name;
    document.getElementById('deptManager').value = dept.manager || '';
    document.getElementById('deptBudget').value = dept.budget;

    openModal('departmentModal');
}

async function handleDepartmentSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('departmentId').value;

    const departmentData = {
        name: document.getElementById('deptName').value,
        manager: document.getElementById('deptManager').value,
        budget: Number(document.getElementById('deptBudget').value)
    };

    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('departments')
                .update(departmentData)
                .eq('id', id);

            if (error) throw error;
            showToast("Department updated successfully.", "success");
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('departments')
                .insert([departmentData]);

            if (error) throw error;
            showToast("Department created successfully.", "success");
        }
        closeModal('departmentModal');
        await syncAllData();
    } catch (error) {
        console.error("Department submit error:", error);
        showToast(`Error saving department: ${error.message || error}`, "error");
    }
}

async function deleteDepartment(id) {
    if (!confirm("Are you sure you want to delete this department? Employees linked to this department will be marked as having 'No Department'.")) return;

    try {
        const { error } = await window.supabaseClient
            .from('departments')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast("Department deleted successfully.", "success");
        await syncAllData();
    } catch (error) {
        console.error("Department delete error:", error);
        showToast(`Error deleting department: ${error.message || error}`, "error");
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

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s reverse forwards';
        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}
