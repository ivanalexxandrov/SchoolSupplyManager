import { useAuth } from '../AuthContext.jsx';

const FILTERS = [
  ['all', 'Всички'],
  ['pending', 'Чакащи'],
  ['approved', 'Одобрени'],
  ['rejected', 'Отхвърлени'],
];

export default function Sidebar({ view, onView, filter, onFilter, counts }) {
  const { user, logout } = useAuth();
  return (
    <section id="profile-sec">
      <div className="profile-card">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <p className="profile-name">{user.name}</p>
        <p className="profile-email">{user.email}</p>
        <p className="profile-role">{user.role === 'admin' ? 'Администратор' : 'Учител'}</p>
      </div>

      <nav className="filters">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            className={view === 'requests' && filter === key ? 'active' : ''}
            onClick={() => { onFilter(key); onView('requests'); }}
          >
            <span>{label}</span>
            <span className="count">{counts[key]}</span>
          </button>
        ))}
        {user.role === 'admin' && (
          <button className={view === 'users' ? 'active' : ''} onClick={() => onView('users')}>
            <span>Потребители</span>
          </button>
        )}
      </nav>

      <button className="logout" onClick={logout}>Изход</button>
    </section>
  );
}
