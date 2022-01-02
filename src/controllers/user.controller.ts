import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { getUserProfile, udpateUserProfile } from '$services/user.service';
import { updateProfileSchema } from '$validators/user';
const logger = log('userController');

export default function userController(app: Express) {
  app.get('/profile', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const profile = await getUserProfile(userId);
      return success(res, profile);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.put('/profile', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const body = req.body;

      validate(updateProfileSchema, body);
      await udpateUserProfile(userId, body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
