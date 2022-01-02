import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import {
  createTransaction,
  getDetailTransaction,
  getListTransactionOfGroup,
  getListTransactionOfUser,
  updateTransaction,
} from '$services/transaction.service';
import { createTransactionSchema, updateTransactionSchema } from '$validators/transaction';
import { ErrorCode } from '$types/enum';
const logger = log('transactionController');

export default function transactionController(app: Express) {
  app.get('/transaction/user', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const { results, ...payload } = await getListTransactionOfUser(req.userId, req.query as any);
      return success(res, results, payload);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.get(
    '/transaction/group/:groupId',
    [verifyAccessToken],
    async (req: Request, res: Response) => {
      try {
        const groupId = req.params.groupId;

        const { results, ...payload } = await getListTransactionOfGroup(
          req.userId,
          groupId,
          req.query as any
        );
        return success(res, results, payload);
      } catch (err) {
        logger.error(err);
        return fail(res, err);
      }
    }
  );

  app.get(
    '/transaction/:transactionId',
    [verifyAccessToken],
    async (req: Request, res: Response) => {
      try {
        const result = await getDetailTransaction(req.params.transactionId);
        return success(res, result);
      } catch (err) {
        logger.error(err);
        return fail(res, err);
      }
    }
  );

  app.post('/transaction', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(createTransactionSchema, req.body);
      const result = await createTransaction(req.userId, req.body);
      return success(res, result);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.put(
    '/transaction/:transactionId',
    [verifyAccessToken],
    async (req: Request, res: Response) => {
      try {
        const transactionId = req.params.transactionId;
        if (!transactionId) {
          throw error(ErrorCode.Invalid_Input, 422, {
            notes: 'Missing transactionId in query URL',
          });
        }

        validate(updateTransactionSchema, req.body);
        const result = await updateTransaction(req.userId, transactionId, req.body);
        return success(res, result);
      } catch (err) {
        logger.error(err);
        return fail(res, err);
      }
    }
  );
}
