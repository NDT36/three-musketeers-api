import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { validate } from '$helpers/validate';
import { loginSchema, refreshTokenSchema, registerSchema } from '$validators/auth';
import { login, refreshToken, register } from '$services/auth.service';
const logger = log('authController');

export default function authController(app: Express) {
  app.post('/login', [], async (req: Request, res: Response) => {
    try {
      validate(loginSchema, req.body);
      const results = await login(req.body);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/register', [], async (req: Request, res: Response) => {
    try {
      validate(registerSchema, req.body);

      req.body.name = req.body.email;

      const results = await register(req.body);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/refresh-token', [], async (req: Request, res: Response) => {
    try {
      validate(refreshTokenSchema, req.body);

      const results = await refreshToken(req.body.refreshToken);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
