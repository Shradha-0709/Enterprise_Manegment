import { Suspense } from 'react';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ModalManager from '@/components/modals/ModalManager';

export const metadata: Metadata = {
  title: 'Enterprise Asset & Maintenance Management System',
  description: 'Manage your enterprise assets effectively.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Header />
            {children}
          </main>
        </div>
        <div className="toast-container" id="toastContainer"></div>
        <Suspense fallback={null}>
          <ModalManager />
        </Suspense>
      </body>
    </html>
  );
}
