function getKeys(env?: string): Keys {
  let res: {
    default: Keys;
  };
  if (env === 'production') {
    res = require('./prod');
  } else {
    res = require('./dev');
  }
  return res.default;
}

const keys: Keys = getKeys(process.env.NODE_ENV);

export default keys;

export interface Keys {
  mongoURI: string;
  cookieKey: string;
  jwtHttpOnlyKey: string;
  jwtKey: string;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
}
