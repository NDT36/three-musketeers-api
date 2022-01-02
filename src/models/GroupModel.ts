import { CommonStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  _id: Schema.Types.ObjectId | string;
  name: string;
  avatar: string;
  description: string;
  createdBy: Schema.Types.ObjectId | string;
  updateAt: number;
  createdAt: number;
  members: Array<Schema.Types.ObjectId | string>;
  status: CommonStatus;
}

export const GroupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  avatar: { type: String },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
  status: { type: Number, default: CommonStatus.ACTIVE },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

GroupSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
