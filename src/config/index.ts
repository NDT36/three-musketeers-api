export default {
  SERVER: {
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
  },
  MONGO: {
    URI: process.env.MONGO_URI,
  },
  AUTH: {
    SECRET: process.env.AUTH_SECRET,
    SALT_ROUND: Number(process.env.SALT_ROUND),
    TOKEN_TTL: process.env.TOKEN_TTL,
    REFRES_TOKEN_TTL: process.env.REFRES_TOKEN_TTL,
    FORGOT_PASSWORD_LINK_TTL: Number(process.env.FORGOT_PASSWORD_LINK_TTL),
  },
};
