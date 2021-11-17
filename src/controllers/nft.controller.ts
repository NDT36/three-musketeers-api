import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { validate } from '$helpers/validate';
import { createNftSchema } from '$validators/nft';
import { createNft, detailNft, listedNft, searchNft } from '$services/nft.service';
import { ErrorCode } from '$types/enum';
import mongoose from 'mongoose';
const logger = log('nftController');

export default function nftController(app: Express) {
  /* -------------------------------------------------------------------------- */
  /*                                 Create Nft                                 */
  /* -------------------------------------------------------------------------- */
  app.post('/api/nft', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(createNftSchema, req.body);
      const results = await createNft(req.userId, req.body);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.get('/api/nft/search', [], async (req: Request, res: Response) => {
    try {
      const { data, hasMore, pageSize, totalItems } = await searchNft(req.query);
      return success(res, data, 200, { hasMore, pageSize, totalItems });
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.get('/api/nft/listed', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const results = await listedNft(req.userId);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.get('/api/nft/details/:nftId', [], async (req: Request, res: Response) => {
    try {
      const nftId = req.params.nftId as string;
      if (!mongoose.isValidObjectId(nftId)) {
        throw error(ErrorCode.Invalid_Input, 422, { note: 'Missing nftId/Invalid object id' });
      }
      const results = await detailNft(nftId);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
