import log from '$helpers/log';
import { error, fail, success } from '$helpers/response';
import { Express, Request, Response } from 'express';
import { validate } from '$helpers/validate';
import { verifyAccessToken } from '$middlewares/auth.middleware';
import {
  addMemberToGroup,
  createGroup,
  detailsGroup,
  leaveGroup,
  listGroup,
  removeMemberFromGroup,
  updateGroup,
} from '$services/group.service';
import {
  addMemberGroupToSchema,
  createGroupSchema,
  removeMemberFromToSchema,
  updateGroupSchema,
} from '$validators/group';
const logger = log('groupController');

export default function groupController(app: Express) {
  /**List group */
  app.get('/group/list', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const groups = await listGroup(req.userId);
      return success(res, groups);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  /**List group */
  app.get('/group/:groupId/details', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      const groups = await detailsGroup(req.userId, req.params.groupId);
      return success(res, groups);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  /**Create group */
  app.post('/group', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(createGroupSchema, req.body);
      await createGroup(req.userId, req.body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  /**Add member to group */
  app.post('/group/add', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(addMemberGroupToSchema, req.body);
      await addMemberToGroup(req.userId, req.body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  /**Remove member to group */
  app.post('/group/remove', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(removeMemberFromToSchema, req.body);
      await removeMemberFromGroup(req.userId, req.body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.post('/group/leave/:groupId', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      await leaveGroup(req.userId, req.params.groupId);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });

  app.put('/group/:groupId', [verifyAccessToken], async (req: Request, res: Response) => {
    try {
      validate(updateGroupSchema, req.body);
      await updateGroup(req.userId, req.params.groupId, req.body);
      return success(res);
    } catch (err) {
      logger.error(err);
      return fail(res, err);
    }
  });
}
