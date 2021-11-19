import { CommonStatus } from '$types/enum';

export const createCatgorySchema: AjvSchema = {
  type: 'object',
  required: ['name'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
  },
};

export const updateCatgorySchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    status: {
      enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE],
    },
  },
};
