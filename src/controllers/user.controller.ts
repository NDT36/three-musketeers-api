import log from '$helpers/log';
import { fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { validate } from '$helpers/validate';
import { updateProfileSchema } from '$validators/user';
import { isEmpty } from 'lodash';
import { getUserProfile, updateUserProfile } from '$services/user.service';
const logger = log('userController');

export default function userController(app: Express) {
  app.put('/api/profile', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(updateProfileSchema, req.body);
      if (isEmpty(req.body)) return success(res);

      await updateUserProfile(req.userId, req.body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.get('/api/profile', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const results = await getUserProfile(req.userId);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
