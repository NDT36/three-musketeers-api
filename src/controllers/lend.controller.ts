import log from '$helpers/log';
import { error } from '$helpers/response';
import { Request } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { ErrorCode } from '$types/enum';
import AppRoute from '$helpers/route';
import {
  collectLendOrDebt,
  createLend,
  detailsLend,
  listLend,
  updateLend,
} from '$services/lend.service';
import { collectLendOrDebtSchema, createLendSchema, updateLendSchema } from '$validators/lend';

const Controller = new AppRoute('lendController');

Controller.get('/lend/list', [verifyAccessToken], async (req: Request) => {
  const params = req.query as { [key: string]: string | number };
  params.pageSize = Number(params.pageSize) || 10;

  const { results, ...payload } = await listLend(req.userId, params);
  return { results, payload };
});

Controller.get('/lend/:lendId', [verifyAccessToken], async (req: Request) => {
  const results = await detailsLend(req.userId, req.params.lendId);
  return results;
});

Controller.post('/lend', [verifyAccessToken], async (req: Request) => {
  validate(createLendSchema, req.body);
  const results = await createLend(req.userId, req.body);
  return results;
});

Controller.put('/lend/:lendId', [verifyAccessToken], async (req: Request) => {
  validate(updateLendSchema, req.body);
  const results = await updateLend(req.userId, req.params.lendId, req.body);
  return results;
});

Controller.put('/lend/collect/:lendId', [verifyAccessToken], async (req: Request) => {
  validate(collectLendOrDebtSchema, req.body);
  const results = await collectLendOrDebt(req.userId, req.params.lendId, req.body);
  return results;
});
