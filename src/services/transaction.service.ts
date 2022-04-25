import { error } from '$helpers/response';
import { GroupModel } from '$models/GroupModel';
import { SourceModel } from '$models/SourceModel';
import { TransactionModel } from '$models/TransactionModel';
import { CommonStatus, ErrorCode, TransactionType } from '$types/enum';
import { Types } from 'mongoose';
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
  image?: string;
}
export async function updateTransaction(
  userId: string,
  transactionId: string,
  params: IUpdateTransaction
) {
  const transaction = await TransactionModel.findOne({ _id: transactionId });
  if (!transaction) throw error(ErrorCode.Transaction_Not_Found);

  if (transaction.groupId) {
    const group = await GroupModel.findOne({ _id: transaction.groupId }, '_id createdBy').lean();
    if (!group) throw error(ErrorCode.Group_Not_Found);

    if (![group.createdBy, transaction.createdBy].includes(userId)) {
      throw error(ErrorCode.Access_Denided, 400, {
        notes: 'Chỉ người tạo ra transaction này hoặc admin của group mới có quyền sửa.',
      });
    }
  } else {
    if (![transaction.createdBy].includes(userId)) {
      throw error(ErrorCode.Access_Denided, 400, {
        notes: 'Chỉ người tạo ra transaction này mới có quyền sửa.',
      });
    }
  }

  if (params.users) {
    params.users = assignCreator(userId, params.users);

    if (transaction.groupId) {
      const isValid = await checkMemberOfGroupValid(String(transaction.groupId), params.users);
      if (!isValid) throw error(ErrorCode.Target_User_Contain_Someone_Not_In_This_Group);
    }
  }
  Object.assign(transaction, params);

  return await transaction.save();
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
