import { Request } from 'express';
import { validate } from '$helpers/validate';
import { loginSchema, refreshTokenSchema, registerSchema } from '$validators/auth';
import { login, refreshToken, register } from '$services/auth.service';
import AppRoute from '$helpers/route';

const Controller = new AppRoute('authController');

Controller.post('/login', [], async (req: Request) => {
  validate(loginSchema, req.body);
  const results = await login(req.body);
  return results;
});

Controller.post('/register', [], async (req: Request) => {
  const body = req.body;

  validate(registerSchema, body);
  Object.assign(body, { email: body.name });

  const results = await register(body);
  return results;
});

Controller.post('/refresh-token', [], async (req: Request) => {
  validate(refreshTokenSchema, req.body);

  const results = await refreshToken(req.body.refreshToken);
  return results;
});
