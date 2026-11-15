import { useState } from 'react';
import { api } from '../api.js';
import Modal from './Modal.jsx';

export default function NewRequestModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ caption: '', description: '', quantity: 1 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const created = await api.createRequest({ ...form, quantity: Number(form.quantity) });
      onCreated(created);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title="Нова заявка" onClose={onClose}>
      <form onSubmit={submit} className="modal-form">
        <label>Заглавие
          <input value={form.caption} onChange={set('caption')} maxLength={120} placeholder="напр. Химикалки" required />
        </label>
        <label>Количество
          <input type="number" min="1" max="100000" value={form.quantity} onChange={set('quantity')} required />
        </label>
        <label>Кратко описание
          <textarea rows="4" value={form.description} onChange={set('description')} maxLength={1000} placeholder="За какво са необходими, предпочитан вид и др." />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="btn-primary" disabled={busy}>Изпрати заявката</button>
      </form>
    </Modal>
  );
}
