import { Request } from 'express';
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
import AppRoute from '$helpers/route';

const Controller = new AppRoute('groupController');

/**List group */
Controller.get('/group/list', [verifyAccessToken], async (req: Request) => {
  const groups = await listGroup(req.userId);
  return groups;
});

/**List group */
Controller.get('/group/:groupId/details', [verifyAccessToken], async (req: Request) => {
  const groups = await detailsGroup(req.userId, req.params.groupId);
  return groups;
});

/**Create group */
Controller.post('/group', [verifyAccessToken], async (req: Request) => {
  validate(createGroupSchema, req.body);
  await createGroup(req.userId, req.body);
});

/**Add member to group */
Controller.post('/group/add', [verifyAccessToken], async (req: Request) => {
  validate(addMemberGroupToSchema, req.body);
  await addMemberToGroup(req.userId, req.body);
});

/**Remove member to group */
Controller.post('/group/remove', [verifyAccessToken], async (req: Request) => {
  validate(removeMemberFromToSchema, req.body);
  await removeMemberFromGroup(req.userId, req.body);
});

Controller.post('/group/leave/:groupId', [verifyAccessToken], async (req: Request) => {
  await leaveGroup(req.userId, req.params.groupId);
});

Controller.put('/group/:groupId', [verifyAccessToken], async (req: Request) => {
  validate(updateGroupSchema, req.body);
  await updateGroup(req.userId, req.params.groupId, req.body);
});
