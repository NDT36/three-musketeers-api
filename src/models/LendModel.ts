import { CommonStatus, LendType } from '$types/enum';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILend extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  target: string;
  money: number;
  total: number;
  status: CommonStatus;
  description: string;
  updateAt: number;
  type: number;
  createdAt: number;
}

export const LendSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  target: { type: String, required: true },
  money: { type: Number, required: true },
  total: { type: Number, required: true },
  type: { type: Number, required: true, default: LendType.LEND },
  status: { type: Number, default: CommonStatus.ACTIVE },
  description: { type: String, required: true },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

LendSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const LendModel = mongoose.model<ILend>('Lend', LendSchema);
