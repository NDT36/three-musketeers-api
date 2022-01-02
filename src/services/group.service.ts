import { error } from '$helpers/response';
import { GroupModel } from '$models/GroupModel';
import { ErrorCode } from '$types/enum';

export async function listGroup(userId: string) {
  const group = await GroupModel.find({ members: { $in: [userId] } })
    .sort({ createdAt: -1 })
    .lean();

  return group;
}

interface ICreateGroup {
  name: string;
  avatar: string;
  description: string;
}
export async function createGroup(userId: string, params: ICreateGroup) {
  const groupDocument = new GroupModel({ ...params, createdBy: userId, members: [userId] });

  const result = await groupDocument.save();

  return result.toObject();
}

interface IUpdateGroup {
  name: string;
  avatar: string;
  description: string;
}
export async function updateGroup(userId: string, groupId: string, params: IUpdateGroup) {
  const group = await GroupModel.findOne({ _id: groupId });

  if (!group) throw error(ErrorCode.Group_Not_Found);

  if (String(group.createdBy) !== userId) throw error(ErrorCode.You_Are_Not_Creator_Of_This_Group);

  Object.assign(group, params);
  const result = await group.save();

  return result.toObject();
}

interface IAddMemberToGroup {
  userId: string;
  groupId: string;
}
export async function addMemberToGroup(adminId: string, { groupId, userId }: IAddMemberToGroup) {
  const group = await GroupModel.findOne({ _id: groupId }, '_id createdBy members');

  if (!group) throw error(ErrorCode.Group_Not_Found);

  if (String(group.createdBy) !== adminId) throw error(ErrorCode.You_Are_Not_Creator_Of_This_Group);

  if (group.members.includes(userId)) throw error(ErrorCode.Member_Duplicate);

  group.members.push(userId);

  await group.save();
  return;
}

interface IRemoveMemberFromGroup {
  userId: string;
  groupId: string;
}
export async function removeMemberFromGroup(
  adminId: string,
  { groupId, userId }: IRemoveMemberFromGroup
) {
  const group = await GroupModel.findOne({ _id: groupId }, '_id createdBy members');

  if (!group) throw error(ErrorCode.Group_Not_Found);

  if (String(group.createdBy) !== adminId) throw error(ErrorCode.You_Are_Not_Creator_Of_This_Group);

  if (!group.members.includes(userId)) return;
  if (adminId === userId) return;

  group.members = group.members.filter((item) => String(item) !== userId);

  await group.save();
  return;
}

export async function leaveGroup(userId: string, groupId: string) {
  const group = await GroupModel.findOne({ _id: groupId }, '_id createdBy members');

  if (!group) throw error(ErrorCode.Group_Not_Found);

  if (!group.members.includes(userId)) return;

  console.log(group.members);

  group.members = group.members.filter((item) => String(item) !== userId);

  await group.save();
  return;
}

export async function detailsGroup(userId: string, groupId: string) {
  const group = await GroupModel.findOne({ _id: groupId, members: { $in: [userId] } }).lean();

  if (!group) throw error(ErrorCode.Group_Not_Found);

  return group;
}

export async function checkMemberOfGroupValid(groupId: string, members: string[]) {
  const group = await GroupModel.findOne({ _id: groupId }, '_id members').lean();
  if (!group) throw error(ErrorCode.Group_Not_Found);

  const groupMembers = group.members.map((item) => String(item));

  const hasInvalidUser = members.some((userId) => !groupMembers.includes(userId));
  return !hasInvalidUser;
}
