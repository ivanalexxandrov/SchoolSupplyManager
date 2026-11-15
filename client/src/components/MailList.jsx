export const STATUS_LABEL = { pending: 'Чака', approved: 'Одобрена', rejected: 'Отхвърлена' };
export const formatDate = (iso) => new Date(iso).toLocaleDateString('bg-BG');

export default function MailList({ items, onOpen }) {
  return (
    <section id="mail-sec">
      <div className="mail-header mail-row">
        <p>Имейл</p>
        <p>Заглавие</p>
        <p>Количество</p>
        <p>Дата</p>
        <p>Статус</p>
      </div>
      <hr />
      <div className="mail-list">
        {items.length === 0 && <p className="empty">Няма заявки за показване.</p>}
        {items.map((r) => (
          <div key={r.id} className={`email mail-row ${r.isOpened ? 'already-opened' : ''}`} onClick={() => onOpen(r.id)}>
            <p>{r.author?.email}</p>
            <p>{r.caption}</p>
            <p>{r.quantity}</p>
            <p>{formatDate(r.createdAt)}</p>
            <p><span className={`badge ${r.status}`}>{STATUS_LABEL[r.status]}</span></p>
          </div>
        ))}
      </div>
    </section>
  );
}
