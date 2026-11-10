const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken, requireAuth } = require('../auth');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

// Регистрация на учител (ролята винаги е teacher – не се приема от клиента)
router.post('/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2 || name.length > 100) return res.status(400).json({ error: 'Въведете валидно име.' });
  if (!EMAIL_RE.test(email) || email.length > 150) return res.status(400).json({ error: 'Невалиден имейл.' });
  if (password.length < 8 || password.length > 72) return res.status(400).json({ error: 'Паролата трябва да е между 8 и 72 символа.' });

  if (await User.findOne({ where: { email } })) return res.status(409).json({ error: 'Имейлът вече е регистриран.' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: 'teacher' });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await User.findOne({ where: { email } }); // параметризирана заявка през ORM
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: 'Грешен имейл или парола.' });

  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(401).json({ error: 'Потребителят не съществува.' });
  res.json({ user: publicUser(user) });
});

module.exports = router;
