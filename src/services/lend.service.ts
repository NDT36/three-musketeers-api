import { error } from '$helpers/response';
import { LendModel } from '$models/LendModel';
import { SourceModel } from '$models/SourceModel';
import { TransactionModel } from '$models/TransactionModel';
import { CommonStatus, ErrorCode, TransactionType } from '$types/enum';
import mongoose, { Types } from 'mongoose';
import { getSourceBalance } from './transaction.service';

interface ICreatedLend {
  target: string;
  money: number;
  description: string;
  type: TransactionType.DEBT | TransactionType.LEND;
  sourceId: string;
  actionAt: string;
}
export async function createLend(userId: string, params: ICreatedLend) {
  const lend = new LendModel({ ...params, userId, total: params.money });

  if (params.sourceId) {
    const Source = await SourceModel.findOne({
      _id: params.sourceId,
      userId,
      status: CommonStatus.ACTIVE,
    });

    if (!Source) throw error(ErrorCode.Source_Not_Found);

    Source.balance = await getSourceBalance(params.sourceId);

    if (params.type === TransactionType.LEND) {
      Source.balance = Source.balance - params.money;
    }

    if (params.type === TransactionType.DEBT) {
      Source.balance = Source.balance + params.money;
    }

    await Source.save();
  }

  const rs = await lend.save();
  // TODO: handle lend/debt transaction
  const transaction = new TransactionModel({
    createdBy: userId,
    updateBy: userId,
    categoryId: null,
    users: [userId],
    groupId: null,
    type: params.type,
    description: params.description,
    actionAt: params.actionAt,
    money: params.type === TransactionType.DEBT ? params.money : -params.money,
    sourceId: params.sourceId || null,
    lendId: rs._id,
  });
  await transaction.save();

  return rs.toObject();
}

interface IUpdateLend {
  target: string;
  description: string;
  actionAt: number;
}
export async function updateLend(userId: string, lendId: string, params: IUpdateLend) {
  await LendModel.updateOne(
    {
      _id: new Types.ObjectId(lendId),
      userId: new Types.ObjectId(userId),
    },
    params
  );

  return;
}

interface ICollectLend {
  money: number;
  description: string;
  sourceId?: string;
  actionAt: number;
}
export async function collectLendOrDebt(userId: string, lendId: string, params: ICollectLend) {
  const lend = await LendModel.findOne({
    userId: new Types.ObjectId(userId),
    _id: new Types.ObjectId(lendId),
    status: CommonStatus.ACTIVE,
  });

  if (!lend) {
    throw error(ErrorCode.Lend_Not_Found);
  }

  if (params.sourceId) {
    const Source = await SourceModel.findOne({
      _id: params.sourceId,
      userId,
      status: CommonStatus.ACTIVE,
    });

    if (!Source) throw error(ErrorCode.Source_Not_Found);

    Source.balance = await getSourceBalance(params.sourceId);

    if (lend.type === TransactionType.LEND) {
      Source.balance = Source.balance + params.money;
    }

    if (lend.type === TransactionType.DEBT) {
      Source.balance = Source.balance - params.money;
    }

    await Source.save();
  }

  const transaction = new TransactionModel({
    createdBy: userId,
    updateBy: userId,
    categoryId: null,
    users: [userId],
    groupId: null,
    type: lend.type,
    description: params.description,
    actionAt: params.actionAt,
    money: lend.type === TransactionType.LEND ? -params.money : params.money,
    sourceId: params.sourceId,
    lendId: lend._id,
  });

  await transaction.save();

  lend.money = lend.money + params.money;
  lend.total = lend.total < lend.money ? lend.money : lend.total;

  await lend.save();
}

export async function listLend(userId: string, params) {
  const query = LendModel.find({
    userId: new Types.ObjectId(userId),
    status: CommonStatus.ACTIVE,
  });

  if (params.isComplete) {
    query.where({ money: { $lte: 0 } });
  } else {
    query.where({ money: { $gt: 0 } });
  }

  if (params.takeAfter) {
    query.where({ updateAt: { $lt: Number(params.takeAfter) } });
  }

  const results = await query.sort({ updateAt: -1 }).lean();

  return { results, pageSize: params.pageSize, hasMore: results.length === params.pageSize };
}

export async function detailsLend(userId: string, lendId: string) {
  const lend = await LendModel.findOne({
    _id: new Types.ObjectId(lendId),
    userId: new Types.ObjectId(userId),
    status: CommonStatus.ACTIVE,
  }).lean();

  if (lend) {
    const lendHistory = await TransactionModel.find({
      lendId: new Types.ObjectId(lendId),
      status: CommonStatus.ACTIVE,
    })
      .sort({ actionAt: -1, createdAt: -1 })
      .lean();

    Object.assign(lend, { history: lendHistory });
  }
  return lend;
}
