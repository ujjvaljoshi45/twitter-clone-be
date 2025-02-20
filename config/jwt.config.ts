export default {
  secret: process.env.JWT_SECRET || 'hihi',
  signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' },
};
