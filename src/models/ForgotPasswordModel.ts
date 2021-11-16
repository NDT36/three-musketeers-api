import { ForgotPasswordStatus } from '$types/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IForgotPassword extends Document {
  _id: Schema.Types.ObjectId | string;
  email: string;
  token: string;
  status: ForgotPasswordStatus;
  retryCount: number;
  expiredAt: number;
  useAt: number;
  lastRetryAt: number;
  createdAt: number;
}

export const ForgotPasswodSchema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  status: { type: Number, default: ForgotPasswordStatus.ACTIVE, required: true },
  retryCount: { type: Number, default: 0, required: true },
  expiredAt: { type: Number, required: true },
  useAt: { type: Number },
  lastRetryAt: { type: Number },
  createdAt: { type: Number, default: Date.now },
});

export const ForgotPasswodModel = mongoose.model<IForgotPassword>(
  'ForgotPassword',
  ForgotPasswodSchema
);
