import { IsPublicProfile, UserStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId | string;
  email: string;
  password: string;
  status: UserStatus;
  walletAddress: string;
  refreshToken: string;
  updateAt: number;
  createdAt: number;
  /* -------------------------------------------------------------------------- */
  /*                                   Profile                                  */
  /* -------------------------------------------------------------------------- */
  isPublic: number;
  name?: string;
  bio?: string;
  location?: string;
  twitter?: string;
  website?: string;
  avatar?: string;
  cover?: string;
}

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Number, default: UserStatus.ACTIVE, required: true },
  walletAddress: { type: String },
  refreshToken: { type: String },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
  isPublic: { type: Number, default: IsPublicProfile.NOT_PUBLIC, required: true },
  name: { type: String },
  bio: { type: String },
  localtion: { type: String },
  twitter: { type: String },
  website: { type: String },
  avatar: { type: String },
  cover: { type: String },
});

UserSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
