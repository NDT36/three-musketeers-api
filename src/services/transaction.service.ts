import { error } from '$helpers/response';
import { CategoryModel } from '$models/CategoryModel';
import { GroupModel } from '$models/GroupModel';
import { SourceModel } from '$models/SourceModel';
import { TransactionModel } from '$models/TransactionModel';
import { CommonStatus, ErrorCode, TransactionType } from '$types/enum';
import mongoose, { Types } from 'mongoose';
import { checkMemberOfGroupValid } from './group.service';

interface ICreateTransaction {
  /**CategoryId equal 0 mean "others" */
  categoryId: string;
  users: Array<string>;
  groupId?: string;
  type?: TransactionType;
  description: string;
  actionAt: number;
  money: number;
  image?: string;
  sourceId: string | null;
  targetSourceId: string | null;
}
export async function createTransaction(userId: string, params: ICreateTransaction) {
  // params.users = assignCreator(userId, params.users);

  if (!params.groupId) params.users = [userId];

  if (params.groupId) {
    const isValid = await checkMemberOfGroupValid(params.groupId, params.users);
    if (!isValid) throw error(ErrorCode.Target_User_Contain_Someone_Not_In_This_Group);
  }

  if (params.sourceId) {
    const Source = await SourceModel.findOne({
      _id: params.sourceId,
      userId,
      status: CommonStatus.ACTIVE,
    });

    if (!Source) throw error(ErrorCode.Source_Not_Found);

    Source.balance = await getSourceBalance(params.sourceId);

    if (params.type === TransactionType.EXPENSE) {
      Source.balance = Source.balance + params.money;
    }

    if (params.type === TransactionType.INCOME) {
      Source.balance = Source.balance + params.money;
    }

    if (params.type === TransactionType.LEND) {
      Source.balance = Source.balance + params.money;
    }

    if (params.type === TransactionType.UPDATE_BALANCE) {
      Source.balance = Source.balance + params.money;
    }

    if (params.type === TransactionType.TRANSFER_MONEY) {
      Source.balance = Source.balance - params.money;
      const TargetSource = await SourceModel.findOne({
        _id: params.targetSourceId,
        userId,
        status: CommonStatus.ACTIVE,
      });

      if (!TargetSource) throw error(ErrorCode.Source_Not_Found, 400, 'Target source not found');

      TargetSource.balance = await getSourceBalance(params.targetSourceId);
      TargetSource.balance = TargetSource.balance + params.money;

      params.money = -params.money;

      await TargetSource.save();
    }

    await Source.save();
  }

  const transaction = new TransactionModel({
    createdBy: userId,
    updateBy: userId,
    ...params,
  });

  const result = await transaction.save();
  return result.toObject();
}

/**Make sure creator has a sit  */
function assignCreator(userId: string, users: string[]) {
  if (users.includes(userId)) return users;

  return [...users, userId];
}

interface IUpdateTransaction {
  users?: string[];
  categoryId?: string;
  description?: string;
  actionAt?: number;
  status?: CommonStatus;
  money?: number;
  sourceId?: string;
}
export async function updateTransaction(
  userId: string,
  transactionId: string,
  params: IUpdateTransaction
) {
  const transaction = await TransactionModel.findOne({ _id: transactionId });
  if (!transaction) throw error(ErrorCode.Transaction_Not_Found);

  // Check permissions if group transaction
  if (transaction.groupId) {
    const group = await GroupModel.findOne({ _id: transaction.groupId }, '_id createdBy').lean();
    if (!group) throw error(ErrorCode.Group_Not_Found);

    if (![group.createdBy, transaction.createdBy].includes(userId)) {
      throw error(ErrorCode.Access_Denided, 400, {
        notes: 'Chỉ người tạo ra transaction này hoặc admin của group mới có quyền sửa.',
      });
    }
  } else {
    if (![String(transaction.createdBy)].includes(userId)) {
      throw error(ErrorCode.Access_Denided, 400, {
        notes: 'Chỉ người tạo ra transaction này mới có quyền sửa.',
      });
    }
  }

  if (!transaction.groupId) params.users = [userId];
  if (params.users && params.users.length) {
    params.users = assignCreator(userId, params.users);

    if (transaction.groupId) {
      const isValid = await checkMemberOfGroupValid(String(transaction.groupId), params.users);
      if (!isValid) throw error(ErrorCode.Target_User_Contain_Someone_Not_In_This_Group);
    }
  }

  if (params.categoryId) {
    const Category = await CategoryModel.findOne({
      _id: params.categoryId,
    }).lean();
    if (!Category) throw error(ErrorCode.Category_Not_Found);
  }

  Object.assign(transaction, params);

  await transaction.save();

  if (transaction.sourceId) {
    const Source = await SourceModel.findOne({
      _id: transaction.sourceId,
      userId,
    });
    if (!Source) throw error(ErrorCode.Source_Not_Found);
    Source.balance = await getSourceBalance(transaction.sourceId);
    await Source.save();
  }

  if (params.sourceId && params.sourceId !== transaction.sourceId) {
    const TargetSource = await SourceModel.findOne({
      _id: params.sourceId,
      userId,
      status: CommonStatus.ACTIVE,
    });
    if (!TargetSource) throw error(ErrorCode.Source_Not_Found);
    TargetSource.balance = await getSourceBalance(params.sourceId);
    await TargetSource.save();
  }

  return;
}

export async function getDetailTransaction(transactionId: string) {
  const transaction = await TransactionModel.findOne({ _id: transactionId }).lean();

  return transaction;
}

interface IListTransaction {
  startTime: number;
  endTime: number;
  pageSize: number;
  pageIndex: number;
  skip?: number;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}
export async function getListTransactionOfUser(userId: string, params: IListTransaction) {
  params.pageSize = Number(params.pageSize) || 10;
  params.pageIndex = Number(params.pageIndex) || 1;
  params.skip = (params.pageIndex - 1) * params.pageSize;

  const query = TransactionModel.find({
    users: { $in: [userId] },
    status: CommonStatus.ACTIVE,
    type: { $nin: [TransactionType.TRANSFER_MONEY] },
  });

  const countQuery = TransactionModel.count({
    users: { $in: [userId] },
    status: CommonStatus.ACTIVE,
    type: { $nin: [TransactionType.TRANSFER_MONEY] },
  });

  if (params.categoryId) {
    query.where({ categoryId: params.categoryId });
    countQuery.where({ categoryId: params.categoryId });
  }

  if (params.startTime) {
    query.where({ actionAt: { $gte: params.startTime } });
    countQuery.where({ actionAt: { $gte: params.startTime } });
  }

  if (params.endTime) {
    query.where({ actionAt: { $lte: params.endTime } });
    countQuery.where({ actionAt: { $lte: params.endTime } });
  }

  if (params.startDate) {
    query.where({ actionAt: { $gte: new Date(params.startDate).getTime() } });
    countQuery.where({ actionAt: { $gte: new Date(params.startDate).getTime() } });
  }

  if (params.endDate) {
    query.where({
      actionAt: { $lt: new Date(params.endDate).getTime() + 1000 * 60 * 60 * 24 },
    });
    countQuery.where({
      actionAt: { $lt: new Date(params.endDate).getTime() + 1000 * 60 * 60 * 24 },
    });
  }

  const results = await query
    .skip(params.skip)
    .limit(params.pageSize)
    .sort({ actionAt: -1, createdAt: -1 })
    .lean();

  const totalItems = await countQuery.lean();

  return { results, totalItems, pageIndex: params.pageIndex, pageSize: params.pageSize };
}

export async function getListTransactionOfGroup(
  userId: string,
  groupId: string,
  params: IListTransaction
) {
  const isMemberOfGroup = await GroupModel.findOne(
    { groupId, members: { $in: [userId] } },
    '_id'
  ).lean();

  if (!isMemberOfGroup) throw error(ErrorCode.You_Are_Not_Member_Of_This_Group);

  params.pageSize = Number(params.pageSize) || 10;
  params.pageIndex = Number(params.pageIndex) || 1;
  params.skip = (params.pageIndex - 1) * params.pageSize;

  const query = TransactionModel.find({
    groupId: groupId,
    status: CommonStatus.ACTIVE,
  });

  const countQuery = TransactionModel.count({
    groupId: groupId,
    status: CommonStatus.ACTIVE,
  });

  if (params.categoryId) {
    query.where({ categoryId: params.categoryId });
    countQuery.where({ categoryId: params.categoryId });
  }

  if (params.startTime) {
    query.where({ actionAt: { $gte: params.startTime } });
    countQuery.where({ actionAt: { $gte: params.startTime } });
  }

  if (params.endTime) {
    query.where({ actionAt: { $lte: params.endTime } });
    countQuery.where({ actionAt: { $lte: params.endTime } });
  }

  const results = await query
    .skip(params.skip)
    .limit(params.pageSize)
    .sort({ actionAt: -1, createdAt: -1 })
    .lean();

  const totalItems = await countQuery.lean();

  return { results, totalItems, pageIndex: params.pageIndex, pageSize: params.pageSize };
}

export async function getSourceBalance(sourceId: string) {
  const source = await SourceModel.findOne({ _id: sourceId });

  const balance = await TransactionModel.aggregate([
    { $match: { sourceId: new Types.ObjectId(sourceId) } },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$money',
        },
      },
    },
  ]);

  const transfer = await TransactionModel.aggregate([
    {
      $match: {
        targetSourceId: new Types.ObjectId(sourceId),
        type: TransactionType.TRANSFER_MONEY,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$money',
        },
      },
    },
  ]);

  return (
    source.initialBalance +
    (Number(balance?.[0]?.['total']) || 0) +
    Math.abs(Number(transfer?.[0]?.['total'] || 0))
  );
}

export async function getTransactionStatistics(userId: string, startTime: number, endTime: number) {
  const earned = TransactionModel.aggregate()
    .match({
      actionAt: { $gte: startTime, $lt: endTime },
      type: { $nin: [TransactionType.TRANSFER_MONEY] },
      createdBy: new Types.ObjectId(userId),
      isIgnore: { $ne: Boolean(CommonStatus.ACTIVE) },
      money: { $gte: 0 },
    })
    .addFields({
      convertedActionDate: { $toDate: '$actionAt' },
    })
    .group({
      _id: {
        $dateToString: { format: '%Y-%m-%d', date: '$convertedActionDate', timezone: '+07:00' },
      },
      amount: { $sum: '$money' },
      count: { $sum: 1 },
    });

  const spent = TransactionModel.aggregate()
    .match({
      actionAt: { $gte: startTime, $lt: endTime },
      type: { $nin: [TransactionType.TRANSFER_MONEY] },
      createdBy: new Types.ObjectId(userId),
      isIgnore: { $ne: Boolean(CommonStatus.ACTIVE) },
      money: { $lt: 0 },
    })
    .addFields({
      convertedActionDate: { $toDate: '$actionAt' },
    })
    .group({
      _id: {
        $dateToString: { format: '%Y-%m-%d', date: '$convertedActionDate', timezone: '+07:00' },
      },
      amount: { $sum: '$money' },
      count: { $sum: 1 },
    });

  const earnedRs = await earned.exec();
  const spentRs = await spent.exec();

  return { earned: earnedRs, spent: spentRs };
}
