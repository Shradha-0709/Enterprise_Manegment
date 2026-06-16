import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ModalManager from '@/components/modals/ModalManager';

import Dashboard from '@/pages/Dashboard';
import Assets from '@/pages/Assets';
import Maintenance from '@/pages/Maintenance';
import Vendors from '@/pages/Vendors';
import Inventory from '@/pages/Inventory';
import Reports from '@/pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
      <div className="toast-container" id="toastContainer"></div>
      <ModalManager />
    </BrowserRouter>
  );
}
