export default {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  jwtHttpOnlyKey: process.env.JWT_SECRET_HTTP,
  jwtKey: process.env.JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: 'https://app.takeoff.soutendijk.com/api/auth/google/callback',
};






