export const loginSchema: AjvSchema = {
  type: 'object',
  required: ['email', 'password', 'walletAddress'],
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
    walletAddress: {
      type: 'string',
      minLength: 44,
      maxLength: 44,
    },
  },
};

export const registerSchema: AjvSchema = {
  type: 'object',
  required: ['email', 'password', 'walletAddress'],
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
    walletAddress: {
      type: 'string',
      minLength: 44,
      maxLength: 44,
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

export const changePasswordSchema: AjvSchema = {
  type: 'object',
  required: ['oldPassword', 'newPassword'],
  additionalProperties: false,
  properties: {
    oldPassword: {
      type: 'string',
      minLength: 6,
      maxLength: 32,
    },
    newPassword: {
      type: 'string',
      maxLength: 32,
    },
  },
};

export const requestLinkForgotPasswordSchema: AjvSchema = {
  type: 'object',
  required: ['email'],
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
};
