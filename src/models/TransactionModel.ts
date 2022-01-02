import { CommonStatus, TransactionType } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  _id: Schema.Types.ObjectId | string;
  users: Array<Schema.Types.ObjectId | string>;
  createdBy: Schema.Types.ObjectId | string;
  groupId?: Schema.Types.ObjectId | string;
  categoryId: string;
  type: number;
  image: string;
  description: string;
  actionAt: string;
  updateAt: number;
  lastUpdateBy: number;
  createdAt: number;
  status: number;
  money: number;
}

export const TransactionSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  lastUpdateBy: { type: Schema.Types.ObjectId, ref: 'User' },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  type: { type: Number, default: TransactionType.EXPENSE },
  description: { type: String, required: true },
  image: { type: String },
  actionAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
  status: { type: Number, default: CommonStatus.ACTIVE },
  money: { type: Number, required: true },
});

TransactionSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
