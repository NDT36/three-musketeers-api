import { error } from '$helpers/response';
import { UserModel } from '$models/UserModel';
import { ErrorCode } from '$types/enum';

export async function getUserProfile(userId: string) {
  const user = await UserModel.findOne({ _id: userId }).lean();

  if (!user) throw error(ErrorCode.User_Not_Found);

  delete user.password;
  delete user.refreshToken;
  return user;
}

interface IupdateProfile {
  name?: string;
  avatar?: string;
}
export async function udpateUserProfile(userId: string, params: IupdateProfile) {
  const user = await UserModel.findOne({ _id: userId });

  if (!user) throw error(ErrorCode.User_Not_Found);

  Object.assign(user, params);
  await user.save();
  return;
}
