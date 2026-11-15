import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1>SchoolSupply</h1>
        <p className="auth-sub">{mode === 'login' ? 'Впишете се, за да управлявате заявките.' : 'Регистрация на учител'}</p>

        {mode === 'register' && (
          <input placeholder="Име и фамилия" value={form.name} onChange={set('name')} required />
        )}
        <input type="email" placeholder="Имейл" value={form.email} onChange={set('email')} required />
        <input type="password" placeholder="Парола (мин. 8 символа)" value={form.password} onChange={set('password')} required />

        {error && <div className="form-error">{error}</div>}

        <button className="btn-primary" disabled={busy}>{mode === 'login' ? 'Вписване' : 'Регистрация'}</button>
        <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Нямате акаунт? Регистрирайте се' : 'Вече имате акаунт? Впишете се'}
        </button>
      </form>
    </div>
  );
}
