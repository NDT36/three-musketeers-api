import { TransactionHistoryModel } from '$models/TransactionhistoryModel';
import { UserModel } from '$models/UserModel';
import { IUpdateProfile } from '$types/interface';
import mongoose from 'mongoose';

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

export async function hisotryTransaction(userId: string, params) {
  const query = TransactionHistoryModel.aggregate();

  if (params.type === 'sell') {
    query.match({ seller: new mongoose.Types.ObjectId(userId) });
  }

  if (params.type === 'buy') {
    query.match({ buyer: new mongoose.Types.ObjectId(userId) });
  }

  if (!['buy', 'sell'].includes(params.type)) {
    query.match({
      $or: [
        { buyer: new mongoose.Types.ObjectId(userId) },
        { seller: new mongoose.Types.ObjectId(userId) },
      ],
    });
  }

  const usersProject = {
    password: 0,
    refreshToken: 0,
    createdAt: 0,
    __v: 0,
  };

  query
    .lookup({
      from: 'nfts',
      foreignField: '_id',
      localField: 'nftId',
      as: 'nft',
    })
    .unwind('$nft');

  query
    .lookup({
      from: 'users',
      foreignField: '_id',
      localField: 'seller',
      as: 'seller',
    })
    .unwind('$seller');

  query
    .lookup({
      from: 'users',
      foreignField: '_id',
      localField: 'buyer',
      as: 'buyer',
    })
    .unwind('$buyer');

  return await query.project({
    price: 1,
    seller: {
      email: 1,
      walletAddress: 1,
      avatar: 1,
      cover: 1,
      name: 1,
    },
    buyer: {
      email: 1,
      walletAddress: 1,
      avatar: 1,
      cover: 1,
      name: 1,
    },
    status: 1,
    createdAt: 1,
    nft: {
      title: 1,
      shortDescription: 1,
      description: 1,
      image: 1,
      status: 1,
      owner: 1,
      ownerWallet: 1,
      creator: 1,
      sellingStatus: 1,
      price: 1,
      soldAt: 1,
    },
  });
}
