import { UserStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId | string;
  email: string;
  password: string;
  status: UserStatus;
  refreshToken: string;
  updateAt: number;
  createdAt: number;
  /* -------------------------------------------------------------------------- */
  /*                                   Profile                                  */
  /* -------------------------------------------------------------------------- */
  isPublic: number;
  name?: string;
  avatar?: string;
}

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Number, default: UserStatus.ACTIVE, required: true },
  refreshToken: { type: String },
  updateAt: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
  name: { type: String },
  avatar: { type: String },
});

UserSchema.pre('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
