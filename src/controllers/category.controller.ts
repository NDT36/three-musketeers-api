import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { verifyAdminToken } from '$middlewares/auth.middleware';
import { validate } from '$helpers/validate';
import { isEmpty } from 'lodash';
import { createCatgorySchema, updateCatgorySchema } from '$validators/category';
import { createCategory, listCategory, updateCategory } from '$services/category.service';
import mongoose from 'mongoose';
import { ErrorCode } from '$types/enum';
const logger = log('categoryController');

export default function categoryController(app: Express) {
  app.get('/api/category', [], async (req: Request, res: Response) => {
    try {
      const results = await listCategory(req.query);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/api/category', [verifyAdminToken], async (req: Request, res: Response) => {
    try {
      validate(createCatgorySchema, req.body);
      if (isEmpty(req.body)) return success(res);

      const results = await createCategory(req.body);
      return success(res, results);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.put('/api/category/:categoryId', [verifyAdminToken], async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.categoryId;
      if (!mongoose.isValidObjectId(categoryId)) {
        throw error(ErrorCode.Invalid_Input, 422, { note: 'Wrong categoryId' });
      }

      validate(updateCatgorySchema, req.body);
      if (isEmpty(req.body)) return success(res);

      await updateCategory(categoryId, req.body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
