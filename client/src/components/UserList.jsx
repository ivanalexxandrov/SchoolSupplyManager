import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { formatDate } from './MailList.jsx';

export default function UserList() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listUsers().then(setUsers).catch((e) => setError(e.message));
  }, []);

  const toggleRole = async (u) => {
    const role = u.role === 'admin' ? 'teacher' : 'admin';
    const action = role === 'admin' ? 'направите администратор' : 'премахнете като администратор';
    if (!window.confirm(`Сигурни ли сте, че искате да ${action} ${u.name}?`)) return;
    try {
      const updated = await api.setRole(u.id, role);
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section id="mail-sec">
      {error && <div className="form-error">{error}</div>}
      <div className="mail-header mail-row user-row">
        <p>Име</p>
        <p>Имейл</p>
        <p>Регистриран</p>
        <p>Роля</p>
        <p />
      </div>
      <hr />
      <div className="mail-list">
        {users.map((u) => (
          <div key={u.id} className="email mail-row user-row already-opened">
            <p>{u.name}</p>
            <p>{u.email}</p>
            <p>{formatDate(u.createdAt)}</p>
            <p>{u.role === 'admin' ? 'Администратор' : 'Учител'}</p>
            <p>
              {u.id !== me.id && (
                <button className="btn-primary btn-small" onClick={() => toggleRole(u)}>
                  {u.role === 'admin' ? 'Премахни админ' : 'Направи админ'}
                </button>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
