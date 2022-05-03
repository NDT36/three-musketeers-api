import { CommonStatus } from '$types/enum';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILendHistory extends Document {
  _id: mongoose.Types.ObjectId;
  lendId: mongoose.Types.ObjectId;
  money: number;
  remainAmount: number;
  status: CommonStatus;
  description: string;
  updateAt: number;
  createdAt: number;
}

export const LendHistorySchema = new Schema({
  lendId: { type: mongoose.Types.ObjectId, required: true, ref: 'Lend' },
  money: { type: Number, required: true },
  remainAmount: { type: Number, required: true },
  status: { type: Number, default: CommonStatus.ACTIVE },
  description: { type: String, required: true },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

LendHistorySchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const LendHistoryModel = mongoose.model<ILendHistory>('LendHistory', LendHistorySchema);
