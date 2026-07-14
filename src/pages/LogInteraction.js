import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createInteraction } from '../store/interactionSlice';

const field = (label, name, form, onChange, type = 'text', placeholder = '') => (
  <div>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={form[name] || ''}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 13px',
        border: '1.5px solid #e5e7eb', borderRadius: 8,
        fontSize: 14, outline: 'none', background: '#fafafa',
        fontFamily: 'Inter, sans-serif',
        transition: 'border-color 0.15s'
      }}
      onFocus={e => e.target.style.borderColor = '#6366f1'}
      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
    />
  </div>
);

export default function LogInteraction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doctor_name: '', hospital: '', specialty: '',
    visit_date: new Date().toISOString().split('T')[0],
    discussion: '', products_discussed: '',
    follow_up_date: '', additional_notes: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.doctor_name.trim()) { toast.error('Doctor name is required'); return; }
    setLoading(true);
    try {
      await dispatch(createInteraction(form)).unwrap();
      toast.success('Interaction logged successfully!');
      navigate('/history');
    } catch {
      toast.error('Failed to save. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fafafa', fontFamily: 'Inter, sans-serif' };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Log Interaction</h2>
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Record a structured HCP visit</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {field('Doctor Name *', 'doctor_name', form, handleChange, 'text', 'Dr. Ravi Kumar')}
          {field('Hospital / Clinic', 'hospital', form, handleChange, 'text', 'Apollo Hospital')}
          {field('Specialty', 'specialty', form, handleChange, 'text', 'Endocrinology')}
          {field('Visit Date', 'visit_date', form, handleChange, 'date')}
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Discussion</label>
          <textarea
            name="discussion" value={form.discussion} onChange={handleChange}
            placeholder="Topics discussed during the visit..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Products Discussed</label>
          <input style={inputStyle} name="products_discussed" value={form.products_discussed} onChange={handleChange} placeholder="Insulin Glargine, Metformin..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
          {field('Follow-up Date', 'follow_up_date', form, handleChange, 'date')}
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Additional Notes</label>
          <textarea
            name="additional_notes" value={form.additional_notes} onChange={handleChange}
            placeholder="Extra observations, requests..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            color: '#fff', border: 'none',
            padding: '11px 32px', borderRadius: 8,
            fontWeight: 700, fontSize: 14,
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(99,102,241,0.35)'
          }}>
            {loading ? 'Saving...' : '💾 Save Interaction'}
          </button>
          <button type="button" onClick={() => navigate('/')} style={{
            background: '#f3f4f6', color: '#374151',
            border: 'none', padding: '11px 22px',
            borderRadius: 8, fontWeight: 500, fontSize: 14
          }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
