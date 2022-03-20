import { CommonStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IAccumulate extends Document {
  _id: Schema.Types.ObjectId | string;
  userId: Schema.Types.ObjectId | string;
  total: number;
  balance: number;
  name: string;
  color: string;
  description: string;
  startDate: string;
  endDate: string;
  status: CommonStatus;
  updateAt: number;
  createdAt: number;
}

export const AccumulateSchema = new Schema<IAccumulate>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  total: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  description: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  color: { type: String },
  status: { type: Number, default: CommonStatus.ACTIVE },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

AccumulateSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const AccumulateModel = mongoose.model<IAccumulate>('Accumulate', AccumulateSchema);
