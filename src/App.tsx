import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Login from '@/pages/Login';
import ModalManager from '@/components/modals/ModalManager';

import Dashboard from '@/pages/Dashboard';
import Assets from '@/pages/Assets';
import MaintenancePreventive from '@/pages/MaintenancePreventive';
import MaintenanceCorrective from '@/pages/MaintenanceCorrective';
import MaintenanceTracking from '@/pages/MaintenanceTracking';
import VendorDirectory from '@/pages/VendorDirectory';
import VendorWarranties from '@/pages/VendorWarranties';
import Inventory from '@/pages/Inventory';
import Reports from '@/pages/Reports';
import RoleManagement from '@/pages/RoleManagement';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/maintenance/preventive" element={<MaintenancePreventive />} />
            <Route path="/maintenance/corrective" element={<MaintenanceCorrective />} />
            <Route path="/maintenance/tracking" element={<MaintenanceTracking />} />
            <Route path="/vendors/directory" element={<VendorDirectory />} />
            <Route path="/vendors/warranties" element={<VendorWarranties />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/roles" element={<RoleManagement />} />
          </Route>
        </Routes>
        <div className="toast-container" id="toastContainer"></div>
        <ModalManager />
      </BrowserRouter>
    </AuthProvider>
  );
}
