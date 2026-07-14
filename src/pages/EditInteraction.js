import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateInteraction, fetchInteractions } from '../store/interactionSlice';

const inputStyle = {
  width: '100%', padding: '10px 13px',
  border: '1.5px solid #e5e7eb', borderRadius: 8,
  fontSize: 14, fontFamily: 'Inter, sans-serif',
  outline: 'none', background: '#fafafa'
};

export default function EditInteraction() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list } = useSelector(s => s.interactions);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (list.length === 0) dispatch(fetchInteractions());
  }, [dispatch, list.length]);

  useEffect(() => {
    const found = list.find(i => i.id === parseInt(id));
    if (found) {
      setForm({
        ...found,
        visit_date: found.visit_date || '',
        follow_up_date: found.follow_up_date || ''
      });
    }
  }, [list, id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateInteraction({ id: parseInt(id), data: form })).unwrap();
      toast.success('Updated successfully!');
      navigate('/history');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
      Loading interaction...
    </div>
  );

  const Label = ({ children }) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>
      {children}
    </label>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Edit Interaction #{id}</h2>
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Update interaction details</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <Label>Doctor Name</Label>
            <input style={inputStyle} name="doctor_name" value={form.doctor_name || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Hospital</Label>
            <input style={inputStyle} name="hospital" value={form.hospital || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Specialty</Label>
            <input style={inputStyle} name="specialty" value={form.specialty || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Visit Date</Label>
            <input style={inputStyle} type="date" name="visit_date" value={form.visit_date || ''} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Discussion</Label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} name="discussion" value={form.discussion || ''} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Products Discussed</Label>
          <input style={inputStyle} name="products_discussed" value={form.products_discussed || ''} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Follow-up Date</Label>
          <input style={inputStyle} type="date" name="follow_up_date" value={form.follow_up_date || ''} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Additional Notes</Label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} name="additional_notes" value={form.additional_notes || ''} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving} style={{
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            color: '#fff', border: 'none',
            padding: '11px 32px', borderRadius: 8,
            fontWeight: 700, fontSize: 14,
            opacity: saving ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(99,102,241,0.35)'
          }}>
            {saving ? 'Saving...' : '💾 Update Interaction'}
          </button>
          <button type="button" onClick={() => navigate('/history')} style={{
            background: '#f3f4f6', color: '#374151',
            border: 'none', padding: '11px 22px',
            borderRadius: 8, fontWeight: 500, fontSize: 14
          }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
