import { UserModel } from '$models/UserModel';
import { IUpdateProfile } from '$types/interface';

export async function updateUserProfile(userId: string, params: IUpdateProfile) {
  const User = await UserModel.findOne({ _id: userId });
  Object.assign(User, params);
  await User.save();
}

export async function getUserProfile(userId: string) {
  const User = await UserModel.findOne({ _id: userId }, [
    '_id',
    'email',
    'status',
    'walletAddress',
    'isPublic',
    'updateAt',
    'createdAt',
    'avatar',
    'bio',
    'cover',
    'name',
    'twitter',
    'website',
  ]).lean();
  return User;
}
