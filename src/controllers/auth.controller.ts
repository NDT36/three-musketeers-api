import { Request } from 'express';
import { validate } from '$helpers/validate';
import { loginSchema, loginSocialSchema, refreshTokenSchema } from '$validators/auth';
import { login, loginBySocial, refreshToken } from '$services/auth.service';
import AppRoute from '$helpers/route';

const Controller = new AppRoute('authController');

Controller.post('/login', [], async (req: Request) => {
  validate(loginSchema, req.body);
  const results = await login(req.body);
  return results;
});

Controller.post('/login-social', [], async (req: Request) => {
  validate(loginSocialSchema, req.body);
  const results = await loginBySocial(req.body);
  return results;
});

Controller.post('/refresh-token', [], async (req: Request) => {
  validate(refreshTokenSchema, req.body);

  const results = await refreshToken(req.body.refreshToken);
  delete results.refreshToken;
  return results;
});
