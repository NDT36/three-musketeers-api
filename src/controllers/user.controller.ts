import { Request } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { getUserProfile, udpateUserProfile } from '$services/user.service';
import { updateProfileSchema } from '$validators/user';
import AppRoute from '$helpers/route';

const Controller = new AppRoute('userController');

Controller.get('/profile', [verifyAccessToken], async (req: Request) => {
  const userId = req.userId;
  const profile = await getUserProfile(userId);
  return profile;
});

Controller.put('/profile', [verifyAccessToken], async (req: Request) => {
  const userId = req.userId;
  const body = req.body;

  validate(updateProfileSchema, body);
  await udpateUserProfile(userId, body);
});
