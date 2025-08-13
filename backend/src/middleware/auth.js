const STATIC_TOKEN = process.env.STATIC_TOKEN || 'test-token';

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (token !== STATIC_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
