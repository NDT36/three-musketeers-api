import { CommonStatus, TransactionType } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  _id: Schema.Types.ObjectId | string;
  users: Array<Schema.Types.ObjectId | string>;
  money: number;
  type: number;
  categoryId: string | null;
  sourceId: string | null;
  targetSourceId: string | null;
  description: string;
  status: number;
  groupId?: Schema.Types.ObjectId | string;
  actionAt: number;
  isIgnore: boolean;
  lendId?: mongoose.Types.ObjectId;

  createdBy: Schema.Types.ObjectId | string;
  updateAt: number;
  updateBy: number;
  createdAt: number;
}

export const TransactionSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  money: { type: Number, required: true },
  type: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  // Nguồn tiền
  sourceId: { type: Schema.Types.ObjectId, ref: 'Source' },
  targetSourceId: { type: Schema.Types.ObjectId, ref: 'Source' },
  description: { type: String },
  isIgnore: { default: false, type: Schema.Types.Boolean },
  status: { type: Number, default: CommonStatus.ACTIVE },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  actionAt: { type: Number, default: Date.now },
  lendId: { type: mongoose.Types.ObjectId, ref: 'Lend' },

  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updateBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

TransactionSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
