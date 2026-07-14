import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchInteractions } from '../store/interactionSlice';
import { fetchHCPs } from '../store/hcpSlice';

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderLeft: `4px solid ${color}`,
      display: 'flex', alignItems: 'center', gap: 16
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list: interactions, loading } = useSelector(s => s.interactions);
  const { list: hcps } = useSelector(s => s.hcps);

  useEffect(() => {
    dispatch(fetchInteractions());
    dispatch(fetchHCPs());
  }, [dispatch]);

  const thisMonth = interactions.filter(i =>
    new Date(i.created_at).getMonth() === new Date().getMonth()
  ).length;
  const pendingFollowups = interactions.filter(i => i.follow_up_date && !i.is_completed).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>Dashboard</h2>
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Welcome back, Field Representative</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Interactions" value={loading ? '...' : interactions.length} icon="📝" color="#6366f1" />
        <StatCard label="HCPs Managed" value={hcps.length} icon="👨‍⚕️" color="#10b981" />
        <StatCard label="Follow-ups Pending" value={pendingFollowups} icon="📅" color="#f59e0b" />
        <StatCard label="This Month" value={thisMonth} icon="📊" color="#3b82f6" />
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { to: '/log',     label: 'Log Interaction', icon: '✏️', bg: '#6366f1' },
            { to: '/chat',    label: 'AI Chat',         icon: '🤖', bg: '#10b981' },
            { to: '/history', label: 'View History',    icon: '📋', bg: '#3b82f6' },
            { to: '/hcps',    label: 'HCP Directory',   icon: '👨‍⚕️', bg: '#f59e0b' },
          ].map(a => (
            <Link key={a.to} to={a.to} style={{
              background: a.bg,
              color: '#fff',
              borderRadius: 12,
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: 600, fontSize: 14,
              boxShadow: `0 4px 14px ${a.bg}44`,
              transition: 'transform 0.15s',
            }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: 20 }}>{a.icon}</span> {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Interactions */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Recent Interactions</span>
          <Link to="/history" style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>View all →</Link>
        </div>
        {loading && <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>}
        {interactions.slice(0, 6).map(i => (
          <div key={i.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#7c3aed', fontSize: 14 }}>
                {(i.doctor_name || 'D').charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{i.doctor_name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{i.hospital || 'N/A'} • {i.specialty || 'N/A'}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{i.visit_date}</div>
              {i.follow_up_date && (
                <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>↻ {i.follow_up_date}</div>
              )}
            </div>
          </div>
        ))}
        {!loading && interactions.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
            No interactions yet. <Link to="/log" style={{ color: '#6366f1', fontWeight: 600 }}>Log one now →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
