import { CommonStatus } from '$types/enum';

export const createSourceSchema: AjvSchema = {
  type: 'object',
  required: ['name', 'balance'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    balance: {
      type: 'number',
      minimum: 0,
    },
    color: {
      type: 'string',
      maxLength: 30,
    },
    description: {
      type: 'string',
      maxLength: 255,
    },
  },
};

export const updateSourceSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    color: {
      type: 'string',
      maxLength: 30,
    },
    description: {
      type: 'string',
      maxLength: 255,
    },
    status: {
      enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE],
    },
  },
};
