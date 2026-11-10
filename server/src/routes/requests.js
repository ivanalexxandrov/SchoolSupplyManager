const express = require('express');
const { Request, User } = require('../models');
const { requireAuth, requireRole } = require('../auth');

const router = express.Router();
router.use(requireAuth);

const include = [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }];

// Списък: админът вижда всички, учителят – само своите
router.get('/', async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
  const items = await Request.findAll({ where, include, order: [['createdAt', 'DESC']] });
  res.json(items);
});

// Нова заявка (само учители)
router.post('/', requireRole('teacher'), async (req, res) => {
  const caption = String(req.body.caption || '').trim();
  const description = String(req.body.description || '').trim();
  const quantity = Number(req.body.quantity);

  if (caption.length < 2 || caption.length > 120) return res.status(400).json({ error: 'Заглавието трябва да е между 2 и 120 символа.' });
  if (description.length > 1000) return res.status(400).json({ error: 'Описанието е твърде дълго (макс. 1000 символа).' });
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) return res.status(400).json({ error: 'Количеството трябва да е цяло число от 1 до 100000.' });

  const created = await Request.create({ caption, description, quantity, userId: req.user.id });
  created.requestNumber = `REQ-${String(created.id).padStart(4, '0')}`;
  await created.save();

  res.status(201).json(await Request.findByPk(created.id, { include }));
});

// Детайли; админът маркира заявката като прочетена
router.get('/:id', async (req, res) => {
  const item = await Request.findByPk(Number(req.params.id), { include });
  if (!item) return res.status(404).json({ error: 'Заявката не е намерена.' });
  if (req.user.role !== 'admin' && item.userId !== req.user.id) return res.status(403).json({ error: 'Нямате достъп.' });

  if (req.user.role === 'admin' && !item.isOpened) {
    item.isOpened = true;
    await item.save();
  }
  res.json(item);
});

// Одобряване / отхвърляне (само админ)
router.patch('/:id/status', requireRole('admin'), async (req, res) => {
  const status = req.body.status;
  const adminComment = String(req.body.adminComment || '').trim().slice(0, 300);
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Невалиден статус.' });

  const item = await Request.findByPk(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Заявката не е намерена.' });

  item.status = status;
  item.adminComment = adminComment;
  item.isOpened = true;
  await item.save();
  res.json(await Request.findByPk(item.id, { include }));
});

module.exports = router;
