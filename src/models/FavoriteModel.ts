import { FavoriteStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  _id: Schema.Types.ObjectId | string;
  name: string;
  status: FavoriteStatus;
  updateAt: number;
  createdAt: number;
}

export const FavoriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  targetId: { type: Schema.Types.ObjectId, required: true, ref: 'Nft' },
  status: { type: Number, default: FavoriteStatus.LIKE },
  updatedAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

FavoriteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
