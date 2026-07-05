export default function locale(req, res, next) {
  const lang = req.query.lang || req.headers['accept-language']?.split(',')[0] || 'en';
  req.locale = lang;
  next();
}
