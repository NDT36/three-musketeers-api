import { CommonStatus, Token } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface INft extends Document {
  _id: Schema.Types.ObjectId | string;
  userId: string;
  categoryId: string;
  ownerWallet: string;
  creatoraWallet: string;
  isListed: Boolean;
  owner: string | Schema.Types.ObjectId;
  /**title. Maxlength: 20 */
  title: string;
  /**shortDescription. Maxlength: 64 */
  shortDescription: string;
  /**description. Maxlength: 10000 */
  description: string;
  /**image. Maxlength: 10000 */
  image: string;
  updateAt: number;
  createdAt: number;
  soldAt: number;
  status: number;
  sellingStatus: boolean;
  price: number;
  totalLike: number;
  totalDislike: number;
  viewCount: number;
  token: Token;
  skin: string;
  color: string;
}

export const NftSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  title: { type: String, length: 20, required: true },
  shortDescription: { type: String, length: 64, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: Number, default: CommonStatus.ACTIVE },

  owner: { type: String },
  ownerWallet: { type: String },
  creator: { type: String },
  creatorWallet: { type: String },
  sellingStatus: { type: Boolean, default: false },
  soldAt: { type: Number },
  price: { type: Number },
  totalLike: { type: Number, default: 0, required: true },
  totalDislike: { type: Number, default: 0, required: true },
  viewCount: { type: Number, default: 0, required: true },
  token: { type: String },
  skin: { type: String },
  color: { type: String },
  updatedAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
});

NftSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const NftModel = mongoose.model<INft>('Nft', NftSchema);
