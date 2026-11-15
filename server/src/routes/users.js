const express = require('express');
const { User } = require('../models');
const { requireAuth, requireRole } = require('../auth');

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

const toJson = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt });

router.get('/', async (req, res) => {
  const users = await User.findAll({ order: [['name', 'ASC']] });
  res.json(users.map(toJson));
});

// Правене / премахване на администратор
router.patch('/:id/role', async (req, res) => {
  const role = req.body.role;
  if (!['admin', 'teacher'].includes(role)) return res.status(400).json({ error: 'Невалидна роля.' });

  const id = Number(req.params.id);
  // Така винаги остава поне един администратор – този, който прави промяната
  if (id === req.user.id) return res.status(400).json({ error: 'Не можете да променяте собствената си роля.' });

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'Потребителят не е намерен.' });

  user.role = role;
  await user.save();
  res.json(toJson(user));
});

module.exports = router;
