import { error } from '$helpers/response';
import { CategoryModel } from '$models/Category';
import { INft, NftModel } from '$models/Nft';
import { TransactionHistoryModel } from '$models/TransactionhistoryModel';
import { UserModel } from '$models/UserModel';
import { CommonStatus, ErrorCode } from '$types/enum';

export async function createNft(userId: string, params: INft) {
  if (params.categoryId) {
    const category = await CategoryModel.findOne({ _id: params.categoryId }, ['_id']).lean();
    if (!category) throw error(ErrorCode.Not_Found_Category);
  }

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

  const query = NftModel.find()
    .where('status')
    .equals(CommonStatus.ACTIVE)
    .where('sellingStatus')
    .equals(CommonStatus.ACTIVE);
  const countQuery = NftModel.find()
    .where('status')
    .equals(CommonStatus.ACTIVE)
    .where('sellingStatus')
    .equals(CommonStatus.ACTIVE);

  if (params.title) {
    query.where('title').regex(new RegExp(params.title, 'i'));
    countQuery.where('title').regex(new RegExp(params.title, 'i'));
  }

  if (params.categoryIds && params.categoryIds.length) {
    query.where('categoryId').in(params.categoryIds);
    countQuery.where('categoryId').in(params.categoryIds);
  }

  if (Number(params.priceFrom) && Number(params.priceFrom) !== 0) {
    query.where('price').gte(params.priceFrom);
    countQuery.where('price').gte(params.priceFrom);
  }

  if (Number(params.priceTo) && Number(params.priceTo) !== 0) {
    query.where('price').lte(params.priceTo);
    countQuery.where('price').lte(params.priceTo);
  }

  if (takeAfter && takeAfter !== 0) {
    query.where('createdAt').lt(takeAfter);
  }

  query.limit(pageSize).sort('-createdAt');
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

export async function listNftInWallet(userId: string, nftId: string) {
  const result = await NftModel.find({ owner: userId, status: CommonStatus.ACTIVE });
  return result;
}

/* -------------------------------------------------------------------------- */
/*                        udpate selling status to true                       */
/* -------------------------------------------------------------------------- */
export async function sellNft(userId: string, { nftId, price }: { nftId: string; price: number }) {
  const Nft = await NftModel.findOne({ _id: nftId, status: CommonStatus.ACTIVE });
  if (!Nft) throw error(ErrorCode.Not_Found_Nft, 400);
  if (Nft.owner !== userId) throw error(ErrorCode.You_Are_Not_Owner_Of_This_Nft, 400);
  if (Nft.sellingStatus) return;

  Nft.sellingStatus = true;
  Nft.price = price;
  Nft.soldAt = Date.now();
  await Nft.save();
  return Nft.toObject();
}

export async function buyNft(userId: string, nftId: string) {
  const Nft = await NftModel.findOne({
    _id: nftId,
    status: CommonStatus.ACTIVE,
  });

  if (!Nft) throw error(ErrorCode.Not_Found_Nft, 400);
  if (!Nft.sellingStatus) throw error(ErrorCode.Nft_Not_Selling, 400);
  if (Nft.owner === userId) {
    throw error(ErrorCode.You_Are_Owner_Of_This_Nft, 400);
  }

  const User = await UserModel.findOne({ _id: userId }, ['_id', 'walletAddress']).lean();

  const Transaction = new TransactionHistoryModel({
    nftId,
    seller: Nft.owner,
    buyer: User._id,
    price: Nft.price,
  });
  await Transaction.save();

  Nft.owner = User._id;
  Nft.ownerWallet = User.walletAddress;
  Nft.sellingStatus = false;
  Nft.soldAt = null;
  await Nft.save();

  return Nft.toObject();
}
