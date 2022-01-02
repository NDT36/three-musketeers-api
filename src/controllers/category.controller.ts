import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { createCategory, listCategory, updateCategory } from '$services/category.service';
import { createCategorySchema, updateCategorySchema } from '$validators/category';
import { ErrorCode } from '$types/enum';
const logger = log('categoryController');

export default function categoryController(app: Express) {
  app.get('/category/list', [], async (req: Request, res: Response) => {
    try {
      const profile = await listCategory(req.query);
      return success(res, profile);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/category', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(createCategorySchema, req.body);
      const profile = await createCategory(req.userId, req.body);
      return success(res, profile);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.put('/category/:categoryId', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      if (!req.params.categoryId) {
        throw error(ErrorCode.Invalid_Input, 422, {
          notes: 'Missing categoryId in URL params',
        });
      }
      validate(updateCategorySchema, req.body);
      const profile = await updateCategory(req.userId, req.params.categoryId, req.body);
      return success(res, profile);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
