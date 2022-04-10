import { CommonStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface ISource extends Document {
  _id: Schema.Types.ObjectId | string;
  userId: Schema.Types.ObjectId | string;
  balance: CommonStatus;
  name: string;
  status: CommonStatus;
  updateAt: number;
  createdAt: number;
}

export const SourceSchema = new Schema<ISource>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  status: { type: Number, default: CommonStatus.ACTIVE },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

SourceSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const SourceModel = mongoose.model<ISource>('Source', SourceSchema);
