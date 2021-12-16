import log from '$helpers/log';
import { fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { validate } from '$helpers/validate';
import { likeOrDislikeSchema } from '$validators/favorite';
import { FavoriteStatus } from '$types/enum';
import { dislikeNft, likeNft } from '$services/favorite.service';
const logger = log('favoriteController');

export default function favoriteController(app: Express) {
  app.post('/api/favorite', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(likeOrDislikeSchema, req.body);

      const { status, targetId } = req.body;

      if (status == FavoriteStatus.LIKE) {
        const result = await likeNft(req.userId, targetId);
        return success(res, result);
      }

      if (status == FavoriteStatus.DISLIKE) {
        const result = await dislikeNft(req.userId, targetId);
        return success(res, result);
      }
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
