import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { validate } from '$helpers/validate';
import { changePasswordSchema, loginSchema, refreshTokenSchema, registerSchema } from '$validators/auth';
import { changePassword, login, refreshToken, register } from '$services/auth.service';
import { ErrorCode } from '$types/enum';
const logger = log('authController');

export default function authController(app: Express) {
  app.post('/api/login', [], async (req: Request, res: Response) => {
    try {
      validate(loginSchema, req.body);
      const results = await login(req.body);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/api/register', [], async (req: Request, res: Response) => {
    try {
      validate(registerSchema, req.body);

      const results = await register(req.body);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/api/refresh-token', [], async (req: Request, res: Response) => {
    try {
      validate(refreshTokenSchema, req.body);

      const results = await refreshToken(req.body.refreshToken);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/api/change-password', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const body = req.body;
      validate(changePasswordSchema, body);

      if (body.oldPassword === body.newPassword) {
        throw error(ErrorCode.Invalid_Input, 422, { payload: 'Same password' });
      }

      await changePassword(req.userId, body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/api/forgot-password', [], async (req: Request, res: Response) => {});
}
