import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Modal from './Modal.jsx';
import { STATUS_LABEL, formatDate } from './MailList.jsx';

export default function RequestModal({ id, onClose, onChanged }) {
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getRequest(id)
      .then((r) => { setItem(r); setComment(r.adminComment || ''); onChanged(r); })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const decide = async (status) => {
    try {
      const updated = await api.setStatus(id, status, comment);
      setItem(updated);
      onChanged(updated);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal title={item ? `${item.requestNumber} – ${item.caption}` : 'Заявка'} onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      {item && (
        <div className="detail">
          <dl>
            <dt>От</dt><dd>{item.author?.name} ({item.author?.email})</dd>
            <dt>Дата</dt><dd>{formatDate(item.createdAt)}</dd>
            <dt>Количество</dt><dd>{item.quantity}</dd>
            <dt>Описание</dt><dd>{item.description || '—'}</dd>
            <dt>Статус</dt><dd><span className={`badge ${item.status}`}>{STATUS_LABEL[item.status]}</span></dd>
            {user.role !== 'admin' && item.adminComment && (<><dt>Коментар</dt><dd>{item.adminComment}</dd></>)}
          </dl>

          {user.role === 'admin' && (
            <div className="decision">
              <label>Коментар към решението (по избор)
                <input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={300} />
              </label>
              <div className="decision-btns">
                <button className="btn-approve" onClick={() => decide('approved')}>Одобри</button>
                <button className="btn-reject" onClick={() => decide('rejected')}>Отхвърли</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
