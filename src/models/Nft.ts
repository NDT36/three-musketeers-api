import { CommonStatus, IsPublicProfile, UserStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface INft extends Document {
  _id: Schema.Types.ObjectId | string;
  userId: string;
  ownerWallet: string;
  creatoraWallet: string;
  owner: string;
  /**title. Maxlength: 20 */
  title: string;
  /**shortDescription. Maxlength: 64 */
  shortDescription: string;
  /**description. Maxlength: 10000 */
  description: string;
  /**staticPreview. Maxlength: 10000 */
  staticPreview: string;
  /**animatePreview. Maxlength: 10000 */
  animatePreview: string;
  /**artworkFile. Maxlength: 10000 */
  artworkFile: string;
  /**Min 0: max 50 */
  royaltiesPercent: number;
  /**Not require */
  externalUrl: string;
  /**Not require */
  license: string;
  /**Not require */
  website: string;
  /**Not require, default: 0 */
  isNsfw: CommonStatus;
  /**Not require */
  tags: Schema.Types.ObjectId[];
  /**Not require */
  collections: Schema.Types.ObjectId[];
  /**Not require */
  traits: { key: string; value: string }[];
  updateAt: number;
  createdAt: number;
  status: number;
}

export const NftSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  owner: { type: String },
  ownerWallet: { type: String },
  creator: { type: String },
  creatoraWallet: { type: String },
  title: { type: String, length: 20, required: true },
  shortDescription: { type: String, length: 64, required: true },
  description: { type: String, required: true },
  staticPreview: { type: String, required: true },
  animatePreview: { type: String, required: true },
  artworkFile: { type: String, required: true },
  royaltiesPercent: { type: Number, min: 0, max: 50, default: 0, required: true },
  externalUrl: { type: String },
  license: { type: String },
  website: { type: String },
  isNsfw: { type: Number, default: CommonStatus.INACTIVE },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  traits: [{ key: String, value: String }],
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
  status: { type: Number, default: CommonStatus.ACTIVE },
});

NftSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const NftModel = mongoose.model<INft>('Nft', NftSchema);
