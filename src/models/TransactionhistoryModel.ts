import { TransactionHistoryStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransactionHistory extends Document {
  _id: Schema.Types.ObjectId | string;
  price: number;
  nftId: Schema.Types.ObjectId | string;
  seller: Schema.Types.ObjectId | string;
  buyer: Schema.Types.ObjectId | string;
  status: TransactionHistoryStatus;
  createdAt: number;
}

export const TransactionHistorySchema = new Schema({
  price: { type: Number, required: true, min: 0 },
  nftId: { type: Schema.Types.ObjectId, required: true, ref: 'Nft' },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  buyer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  status: { type: Number, default: TransactionHistoryStatus.ACTIVE, required: true },
  createdAt: { type: Number, default: Date.now },
});

export const TransactionHistoryModel = mongoose.model<ITransactionHistory>(
  'TransactionHistory',
  TransactionHistorySchema
);
