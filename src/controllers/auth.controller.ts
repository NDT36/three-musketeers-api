import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { ErrorCode } from '$types/enum';
import { verifyAccessToken } from '$middlewares/auth';
import { validate } from '$helpers/validate';
import { loginSchema } from '$validators/auth';
const logger = log('authController');

export default function authController(app: Express) {
  app.use('/api/login', [], async (req: Request, res: Response) => {
    try {
      validate(loginSchema, req.body);

      return success(res);
    } catch (error) {
      logger.error(error);
      return fail(res, error);
    }
  });

  app.use('/api/register', [], async (req: Request, res: Response) => {});

  app.use('/api/forgotPassword', [], async (req: Request, res: Response) => {});

  app.use('/api/refresh-token', [], async (req: Request, res: Response) => {});
  app.use('/api/change-password', [verifyAccessToken], async (req: Request, res: Response) => {});
}
