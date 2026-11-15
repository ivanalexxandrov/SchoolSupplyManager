import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import MailList from './MailList.jsx';
import UserList from './UserList.jsx';
import NewRequestModal from './NewRequestModal.jsx';
import RequestModal from './RequestModal.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [view, setView] = useState('requests');
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listRequests().then(setItems).catch((e) => setError(e.message));
  }, []);

  const counts = useMemo(() => ({
    all: items.length,
    pending: items.filter((i) => i.status === 'pending').length,
    approved: items.filter((i) => i.status === 'approved').length,
    rejected: items.filter((i) => i.status === 'rejected').length,
  }), [items]);

  const visible = filter === 'all' ? items : items.filter((i) => i.status === filter);

  // Обновява заявката в списъка след отваряне / решение
  const upsert = (r) => setItems((prev) => prev.map((i) => (i.id === r.id ? { ...i, ...r } : i)));

  return (
    <>
      <header />
      <div id="main-container">
        <Sidebar view={view} onView={setView} filter={filter} onFilter={setFilter} counts={counts} />
        <div className="content">
          {error && <div className="form-error">{error}</div>}
          {view === 'users' ? <UserList /> : <MailList items={visible} onOpen={setOpenId} />}
        </div>

        {user.role === 'teacher' && view === 'requests' && (
          <div id="main-button" onClick={() => setCreating(true)} role="button" tabIndex={0}>
            <p>Make a Request</p>
          </div>
        )}
      </div>

      {creating && (
        <NewRequestModal
          onClose={() => setCreating(false)}
          onCreated={(r) => { setItems((prev) => [r, ...prev]); setCreating(false); }}
        />
      )}
      {openId && <RequestModal id={openId} onClose={() => setOpenId(null)} onChanged={upsert} />}
    </>
  );
}
