import { INft, NftModel } from '$models/Nft';
import { UserModel } from '$models/UserModel';
import { CommonStatus } from '$types/enum';

export async function createNft(userId: string, params: INft) {
  const User = await UserModel.findOne({ _id: userId }, ['_id', 'walletAddress']).lean();
  const Nft = new NftModel({
    userId,
    owner: User._id,
    ownerWallet: User.walletAddress,
    creator: User._id,
    creatorWallet: User.walletAddress,
    ...params,
  });
  const results = await Nft.save();
  return results.toObject();
}

export async function searchNft(params) {
  // Số item load trong 1 lần;
  const pageSize = Number(params.pageSize) || 10;
  // Lấy sau khoảng thời gian này(theo ngày tạo) createdAt < takeAfter;
  const takeAfter = Number(params.takeAfter);

  const query = NftModel.find().where('status').equals(CommonStatus.ACTIVE);
  const countQuery = NftModel.find().where('status').equals(CommonStatus.ACTIVE);

  if (params.title) {
    query.where('title').regex(new RegExp(params.title, 'i'));
    countQuery.where('title').regex(new RegExp(params.title, 'i'));
  }

  if (takeAfter && takeAfter !== 0) {
    query.where('createdAt').lt(takeAfter);
  }

  query.sort('-createdAt');
  const data = await query.lean().exec();
  const totalItems = await countQuery.lean().count();
  return { data, hasMore: !!data.length, pageSize, totalItems };
}

export async function detailNft(nftId: string) {
  const result = await NftModel.findOne({ _id: nftId, status: CommonStatus.ACTIVE });

  return result;
}

export async function listNftSelling(userId: string) {
  const result = await NftModel.find({
    owner: userId,
    status: CommonStatus.ACTIVE,
    sellingStatus: true,
  });
  return result;
}

export async function listMyNft(userId: string) {
  const result = await NftModel.find({
    owner: userId,
    status: CommonStatus.ACTIVE,
  });
  return result;
}

export async function listNftInWallet(userId: string) {
  const result = await NftModel.find({ owner: userId, status: CommonStatus.ACTIVE });
  return result;
}
