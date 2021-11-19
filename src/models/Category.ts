import { CommonStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: Schema.Types.ObjectId | string;
  name: string;
  status: CommonStatus;
  updateAt: number;
  createdAt: number;
}

export const CategorySchema = new Schema({
  name: { type: String, required: true },
  status: { type: Number, default: CommonStatus.ACTIVE },
  updatedAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

CategorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
