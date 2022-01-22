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
import AppRoute from '$helpers/route';
const Controller = new AppRoute('transactionController');

Controller.get('/transaction/user', [verifyAccessToken], async (req: Request) => {
  const { results, ...payload } = await getListTransactionOfUser(req.userId, req.query as any);
  return { results, payload };
});

Controller.get('/transaction/group/:groupId', [verifyAccessToken], async (req: Request) => {
  const groupId = req.params.groupId;

  const { results, ...payload } = await getListTransactionOfGroup(
    req.userId,
    groupId,
    req.query as any
  );
  return { results, payload };
});

Controller.get('/transaction/:transactionId', [verifyAccessToken], async (req: Request) => {
  const result = await getDetailTransaction(req.params.transactionId);
  return result;
});

Controller.post('/transaction', [verifyAccessToken], async (req: Request) => {
  validate(createTransactionSchema, req.body);
  const result = await createTransaction(req.userId, req.body);
  return result;
});

Controller.put('/transaction/:transactionId', [verifyAccessToken], async (req: Request) => {
  const transactionId = req.params.transactionId;
  if (!transactionId) {
    throw error(ErrorCode.Invalid_Input, 422, {
      notes: 'Missing transactionId in query URL',
    });
  }

  validate(updateTransactionSchema, req.body);
  const result = await updateTransaction(req.userId, transactionId, req.body);
  return result;
});
