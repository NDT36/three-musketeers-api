import log from '$helpers/log';
import { error } from '$helpers/response';
import { Request } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import { createCategory, listCategory, updateCategory } from '$services/category.service';
import { createCategorySchema, updateCategorySchema } from '$validators/category';
import { ErrorCode } from '$types/enum';
import AppRoute from '$helpers/route';

const Controller = new AppRoute('categoryController');

Controller.get('/category/list', [verifyAccessToken], async (req: Request) => {
  const profile = await listCategory(req.userId, req.query);
  return profile;
});

Controller.post('/category', [verifyAccessToken], async (req: Request) => {
  validate(createCategorySchema, req.body);
  const profile = await createCategory(req.userId, req.body);
  return profile;
});

Controller.put('/category/:categoryId', [verifyAccessToken], async (req: Request) => {
  if (!req.params.categoryId) {
    throw error(ErrorCode.Invalid_Input, 422, {
      notes: 'Missing categoryId in URL params',
    });
  }

  validate(updateCategorySchema, req.body);
  const profile = await updateCategory(req.userId, req.params.categoryId, req.body);
  return profile;
});
