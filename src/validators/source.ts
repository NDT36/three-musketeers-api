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
    status: {
      enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE],
    },
  },
};
