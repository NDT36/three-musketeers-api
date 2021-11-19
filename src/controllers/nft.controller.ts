import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { validate } from '$helpers/validate';
import { createNftSchema, sellSchema } from '$validators/nft';
import {
  buyNft,
  createNft,
  detailNft,
  listMyNft,
  listNftSelling,
  searchNft,
  sellNft,
} from '$services/nft.service';
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
      if (req.body.categoryId && !mongoose.isValidObjectId(req.body.categoryId)) {
        throw error(ErrorCode.Invalid_Input, 422, { note: 'Wrong categoryId' });
      }
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

  app.get('/api/nft/selling', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const results = await listNftSelling(req.userId);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.get('/api/nft/me', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const results = await listMyNft(req.userId);
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

  app.post('/api/nft/buy/:nftId', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const nftId = req.params.nftId as string;
      if (!mongoose.isValidObjectId(nftId)) {
        throw error(ErrorCode.Invalid_Input, 422, { note: 'Missing nftId/Invalid object id' });
      }
      const results = await buyNft(req.userId, nftId);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/api/nft/sell/:nftId', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const nftId = req.params.nftId as string;
      if (!mongoose.isValidObjectId(nftId)) {
        throw error(ErrorCode.Invalid_Input, 422, { note: 'Missing nftId/Invalid object id' });
      }
      validate(sellSchema, req.body);
      if (req.body.price <= 0) {
        throw error(ErrorCode.Invalid_Input, 422, { note: 'price must be greater than 0' });
      }

      const results = await sellNft(req.userId, { nftId, price: req.body.price });
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
