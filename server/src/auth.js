const jwt = require('jsonwebtoken');
<<<<<<< HEAD
=======
const { User } = require('./models');
>>>>>>> multiple-admins

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '8h' });
}

<<<<<<< HEAD
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Необходимо е вписване.' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Невалидна или изтекла сесия.' });
  }
=======
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Необходимо е вписване.' });

  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch {
    return res.status(401).json({ error: 'Невалидна или изтекла сесия.' });
  }

  // Ролята се чете от базата, за да влиза в сила веднага след промяна
  const user = await User.findByPk(payload.id);
  if (!user) return res.status(401).json({ error: 'Потребителят не съществува.' });
  req.user = { id: user.id, role: user.role };
  next();
>>>>>>> multiple-admins
}

const requireRole = (role) => (req, res, next) =>
  req.user.role === role ? next() : res.status(403).json({ error: 'Нямате достъп.' });

module.exports = { signToken, requireAuth, requireRole };
