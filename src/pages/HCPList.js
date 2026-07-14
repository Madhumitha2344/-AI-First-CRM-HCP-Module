import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchHCPs, createHCP } from '../store/hcpSlice';

const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1.5px solid #e5e7eb', borderRadius: 8,
  fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none'
};

const SPECIALTIES = ['Endocrinology', 'Cardiology', 'General Medicine', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Other'];

export default function HCPList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.hcps);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', hospital: '', specialty: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchHCPs()); }, [dispatch]);

  const filtered = list.filter(h =>
    (h.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (h.hospital || '').toLowerCase().includes(search.toLowerCase()) ||
    (h.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await dispatch(createHCP(form)).unwrap();
      toast.success('HCP added!');
      setForm({ name: '', hospital: '', specialty: '', email: '', phone: '' });
      setShowForm(false);
    } catch {
      toast.error('Failed to add HCP');
    } finally {
      setSaving(false);
    }
  };

  const COLORS = ['#6366f1','#10b981','#f59e0b','#3b82f6','#ec4899','#8b5cf6'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>HCP Directory</h2>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>{list.length} healthcare professionals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: showForm ? '#f3f4f6' : 'linear-gradient(135deg,#6366f1,#818cf8)',
          color: showForm ? '#374151' : '#fff',
          border: 'none', padding: '10px 20px',
          borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          boxShadow: showForm ? 'none' : '0 4px 14px rgba(99,102,241,0.3)'
        }}>
          {showForm ? '✕ Cancel' : '+ Add HCP'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#fff', borderRadius: 14, padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20,
          borderLeft: '4px solid #6366f1'
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#374151' }}>Add New HCP</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {[
              ['name', 'Name *', 'text', 'Dr. Ravi Kumar'],
              ['hospital', 'Hospital', 'text', 'Apollo Hospital'],
              ['email', 'Email', 'email', 'doctor@hospital.com'],
              ['phone', 'Phone', 'tel', '+91 9876543210'],
            ].map(([field, label, type, placeholder]) => (
              <div key={field}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>{label}</label>
                <input style={inputStyle} type={type} placeholder={placeholder} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Specialty</label>
              <select style={inputStyle} value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })}>
                <option value="">Select...</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} style={{
            marginTop: 16,
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            color: '#fff', border: 'none',
            padding: '9px 24px', borderRadius: 8,
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Saving...' : '💾 Save HCP'}
          </button>
        </form>
      )}

      {/* Search */}
      <input
        style={{ ...inputStyle, marginBottom: 16 }}
        placeholder="🔍 Search by name, hospital or specialty..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading...</div>}

      {/* HCP Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map((hcp, idx) => (
          <div key={hcp.id} style={{
            background: '#fff', borderRadius: 14,
            padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderTop: `3px solid ${COLORS[idx % COLORS.length]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44,
                background: COLORS[idx % COLORS.length] + '20',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS[idx % COLORS.length],
                fontWeight: 700, fontSize: 16,
                border: `2px solid ${COLORS[idx % COLORS.length]}40`
              }}>
                {(hcp.name || 'D').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{hcp.name}</div>
                {hcp.specialty && (
                  <span style={{
                    background: COLORS[idx % COLORS.length] + '15',
                    color: COLORS[idx % COLORS.length],
                    padding: '2px 8px', borderRadius: 12,
                    fontSize: 11, fontWeight: 600
                  }}>{hcp.specialty}</span>
                )}
              </div>
            </div>
            {hcp.hospital && <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>🏥 {hcp.hospital}</div>}
            {hcp.email && <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>✉ {hcp.email}</div>}
            {hcp.phone && <div style={{ fontSize: 12, color: '#9ca3af' }}>📞 {hcp.phone}</div>}
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          No HCPs found. Click "Add HCP" to get started.
        </div>
      )}
    </div>
  );
}
