// HTTP Basic Authentication middleware for the Web Admin Dashboard
const adminBasicAuth = (req, res, next) => {
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
    return res.status(401).send('Authentication required to access Admin Dashboard.');
  }

  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  if (user === adminUser && pass === adminPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
  return res.status(401).send('Invalid credentials. Access Denied.');
};

module.exports = adminBasicAuth;
