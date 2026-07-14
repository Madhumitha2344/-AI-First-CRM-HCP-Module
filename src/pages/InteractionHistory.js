import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchInteractions, deleteInteraction } from '../store/interactionSlice';

export default function InteractionHistory() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.interactions);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchInteractions()); }, [dispatch]);

  const filtered = list.filter(i =>
    (i.doctor_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.hospital || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.products_discussed || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interaction?')) return;
    await dispatch(deleteInteraction(id));
    toast.success('Deleted');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Interaction History</h2>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>{filtered.length} records</p>
        </div>
        <Link to="/log" style={{
          background: 'linear-gradient(135deg,#6366f1,#818cf8)',
          color: '#fff', padding: '10px 20px',
          borderRadius: 8, fontWeight: 700, fontSize: 14,
          boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
        }}>+ Log New</Link>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Search by doctor, hospital, product..."
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10,
          border: '1.5px solid #e5e7eb', fontSize: 14, marginBottom: 16,
          fontFamily: 'Inter, sans-serif', outline: 'none'
        }}
      />

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading...</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => (
          <div key={item.id} style={{
            background: '#fff', borderRadius: 14,
            padding: '18px 22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            borderLeft: '4px solid #6366f1'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{item.doctor_name}</span>
                {item.specialty && (
                  <span style={{
                    background: '#ede9fe', color: '#7c3aed',
                    padding: '2px 10px', borderRadius: 20,
                    fontSize: 11, fontWeight: 600
                  }}>{item.specialty}</span>
                )}
                <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>#{item.id}</span>
              </div>

              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
                🏥 {item.hospital || 'N/A'} &nbsp;•&nbsp; 📅 {item.visit_date || 'N/A'}
              </div>

              {item.products_discussed && (
                <div style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
                  💊 {item.products_discussed}
                </div>
              )}

              {item.discussion && (
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                  💬 {item.discussion.length > 100 ? item.discussion.slice(0, 100) + '...' : item.discussion}
                </div>
              )}

              {item.ai_summary && (
                <div style={{
                  marginTop: 8, fontSize: 12,
                  color: '#5b21b6',
                  background: '#f5f3ff',
                  padding: '7px 12px', borderRadius: 8,
                  borderLeft: '3px solid #7c3aed'
                }}>
                  🤖 {item.ai_summary}
                </div>
              )}

              {item.follow_up_date && (
                <div style={{ marginTop: 6, fontSize: 12, color: '#d97706', fontWeight: 500 }}>
                  ↻ Follow-up: {item.follow_up_date}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginLeft: 16, flexShrink: 0 }}>
              <Link to={`/edit/${item.id}`} style={{
                background: '#f3f4f6', color: '#374151',
                padding: '6px 16px', borderRadius: 7,
                fontSize: 13, fontWeight: 600
              }}>✏️ Edit</Link>
              <button onClick={() => handleDelete(item.id)} style={{
                background: '#fee2e2', color: '#dc2626',
                border: 'none', padding: '6px 16px',
                borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>🗑 Delete</button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
            No interactions found.{' '}
            <Link to="/log" style={{ color: '#6366f1', fontWeight: 600 }}>Log your first one →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
