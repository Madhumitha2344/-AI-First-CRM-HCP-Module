import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogInteraction from './pages/LogInteraction';
import ChatInterface from './pages/ChatInterface';
import InteractionHistory from './pages/InteractionHistory';
import EditInteraction from './pages/EditInteraction';
import HCPList from './pages/HCPList';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogInteraction />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/history" element={<InteractionHistory />} />
          <Route path="/edit/:id" element={<EditInteraction />} />
          <Route path="/hcps" element={<HCPList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
