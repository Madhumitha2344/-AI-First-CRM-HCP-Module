import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/',        label: 'Dashboard',       icon: '🏢' },
  { path: '/log',     label: 'Log Interaction',  icon: '✏️' },
  { path: '/chat',    label: 'AI Chat',          icon: '🤖' },
  { path: '/history', label: 'History',          icon: '📋' },
  { path: '/hcps',    label: 'HCP List',         icon: '👨‍⚕️' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 224,
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        boxShadow: '2px 0 12px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 64
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>💊</span>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>CRM HCP</div>
              <div style={{ fontSize: 10, color: '#818cf8', letterSpacing: 0.5 }}>AI-FIRST</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: '#9ca3af', fontSize: 18, cursor: 'pointer', flexShrink: 0,
            padding: '4px', borderRadius: 4
          }}>☰</button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} title={collapsed ? item.label : ''} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '12px 20px' : '11px 18px',
                background: active ? 'rgba(99,102,241,0.25)' : 'transparent',
                borderLeft: active ? '3px solid #818cf8' : '3px solid transparent',
                color: active ? '#c7d2fe' : '#9ca3af',
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div style={{
            padding: '12px 18px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            fontSize: 10,
            color: '#4b5563',
            letterSpacing: 0.3
          }}>
            Powered by Groq + LangGraph
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Bar */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>
              AI-First CRM
            </span>
            <span style={{ color: '#9ca3af', fontSize: 13, marginLeft: 8 }}>
              Healthcare Professional Module
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              background: '#dcfce7', color: '#16a34a',
              padding: '3px 10px', borderRadius: 20,
              fontSize: 11, fontWeight: 600
            }}>● Live</span>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 13
            }}>FR</div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
