import { Request } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import AppRoute from '$helpers/route';
import { createSource, detailsSource, listSource, updateSource } from '$services/source.service';
import { createSourceSchema, updateSourceSchema } from '$validators/source';
import { error } from '$helpers/response';
import { ErrorCode } from '$types/enum';

const Controller = new AppRoute('sourceController');

Controller.get('/sources', [verifyAccessToken], async (req: Request) => {
  const profile = await listSource(req.userId);
  return profile;
});

Controller.get('/source/:id', [verifyAccessToken], async (req: Request) => {
  const profile = await detailsSource(req.userId, req.params.id);
  return profile;
});

Controller.post('/source', [verifyAccessToken], async (req: Request) => {
  validate(createSourceSchema, req.body);
  const profile = await createSource(req.userId, req.body);
  return profile;
});

Controller.put('/source/:sourceId', [verifyAccessToken], async (req: Request) => {
  const sourceId = req.params.sourceId;
  if (!sourceId) {
    throw error(ErrorCode.Invalid_Input, 422, { notes: 'Missing sourceId in URL params' });
  }

  validate(updateSourceSchema, req.body);

  await updateSource(req.userId, sourceId, req.body);
});
