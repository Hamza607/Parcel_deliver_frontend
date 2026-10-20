import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { OrderModal } from '../orders/OrderModal';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewOrderClick={() => setOrderModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ openCreateOrderModal: () => setOrderModalOpen(true) }} />
        </main>
      </div>

      {/* Global Quick Create Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSuccess={() => {
          setOrderModalOpen(false);
          // Trigger a window event or reload so pages can listen if needed
          window.dispatchEvent(new CustomEvent('order-created'));
        }}
      />
    </div>
  );
};
