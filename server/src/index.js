require('express-async-errors');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

// Ограничаване на опити за вписване (защита от brute force)
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
<<<<<<< HEAD
=======
app.use('/api/users', require('./routes/users'));
>>>>>>> multiple-admins

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Вътрешна грешка на сървъра.' });
});

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@school.bg').toLowerCase();
  if (await User.findOne({ where: { email } })) return;
  await User.create({
    name: process.env.ADMIN_NAME || 'Директор',
    email,
    passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin1234', 12),
    role: 'admin',
  });
  console.log(`Създаден администратор: ${email}`);
}

const PORT = process.env.PORT || 5000;
sequelize.sync().then(seedAdmin).then(() => {
  app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
});

