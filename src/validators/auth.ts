import { LoginSocialType } from '$types/enum';

export const loginSchema: AjvSchema = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 32,
    },
  },
};

export const loginSocialSchema: AjvSchema = {
  type: 'object',
  required: ['token', 'type'],
  additionalProperties: false,
  properties: {
    token: {
      type: 'string',
      minLength: 1,
      maxLength: 3000,
    },
    type: {
      type: 'string',
      enum: [LoginSocialType.GOOGLE],
    },
  },
};

export const refreshTokenSchema: AjvSchema = {
  type: 'object',
  required: ['refreshToken'],
  additionalProperties: false,
  properties: {
    refreshToken: {
      type: 'string',
      minLength: 1,
    },
  },
};
