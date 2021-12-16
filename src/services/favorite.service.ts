import { error } from '$helpers/response';
import { FavoriteModel } from '$models/FavoriteModel';
import { NftModel } from '$models/Nft';
import { ErrorCode, FavoriteStatus } from '$types/enum';

export async function likeNft(userId: string, targetId: string) {
  const Nft = await NftModel.findOne({ _id: targetId });

  if (!Nft) throw error(ErrorCode.Not_Found_Nft);

  const oldFavorite = await FavoriteModel.findOne({ userId, targetId }, '_id status');

  // Chưa tồn tại thì tạo mới.
  if (!oldFavorite) {
    const Favorite = new FavoriteModel({
      userId,
      targetId,
      status: FavoriteStatus.LIKE,
    });

    await Favorite.save();
  }

  // Đã tồn tại thì update sang trạng thái LIKE
  if (oldFavorite) {
    oldFavorite.status = FavoriteStatus.LIKE;

    await oldFavorite.save();
  }

  // Đếm lại total like, trả ra cho frontend
  const totalLike = await FavoriteModel.count({ targetId, status: FavoriteStatus.LIKE });
  const totalDislike = await FavoriteModel.count({ targetId, status: FavoriteStatus.DISLIKE });

  Nft.totalLike = totalLike;
  Nft.totalDislike = totalDislike;
  await Nft.save();

  return { totalLike, totalDislike };
}

export async function dislikeNft(userId: string, targetId: string) {
  const Nft = await NftModel.findOne({ _id: targetId });

  if (!Nft) throw error(ErrorCode.Not_Found_Nft);

  const oldFavorite = await FavoriteModel.findOne({ userId, targetId }, '_id status');

  // Chưa tồn tại thì tạo mới.
  if (!oldFavorite) {
    const Favorite = new FavoriteModel({
      userId,
      targetId,
      status: FavoriteStatus.DISLIKE,
    });

    await Favorite.save();
  }

  // Đã tồn tại thì update sang trạng thái LIKE
  if (oldFavorite) {
    oldFavorite.status = FavoriteStatus.DISLIKE;

    await oldFavorite.save();
  }

  const totalLike = await FavoriteModel.count({ targetId, status: FavoriteStatus.LIKE });
  const totalDislike = await FavoriteModel.count({ targetId, status: FavoriteStatus.DISLIKE });

  Nft.totalLike = totalLike;
  Nft.totalDislike = totalDislike;
  await Nft.save();

  return { totalLike, totalDislike };
}
