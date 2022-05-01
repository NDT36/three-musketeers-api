import { CategoryType, CommonStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: Schema.Types.ObjectId | string;
  name: string;
  avatar: string;
  type: number;
  createdBy: mongoose.Types.ObjectId | string;
  updateAt: number;
  createdAt: number;
  status: number;
}

export const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  avatar: { type: String },
  createdBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  type: { type: Number, default: CategoryType.COMMON },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
  status: { type: Number, default: CommonStatus.ACTIVE },
});

CategorySchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
