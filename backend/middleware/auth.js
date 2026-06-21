function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();  // user is logged in — let the request continue to the actual route handler
}

module.exports = requireAuth;