import { CategoryType, CommonStatus } from '$types/enum';

export const createCategorySchema: AjvSchema = {
  type: 'object',
  required: ['name', 'avatar'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    avatar: {
      type: 'string',
    },
    type: {
      type: 'number',
      enum: [CategoryType.COMMON, CategoryType.FOOD, CategoryType.GIFT, CategoryType.OTHER],
    },
  },
};

export const updateCategorySchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    avatar: {
      type: 'string',
    },
    status: {
      type: 'number',
      enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE],
    },
    type: {
      type: 'number',
      enum: [CategoryType.COMMON, CategoryType.FOOD, CategoryType.GIFT, CategoryType.OTHER],
    },
  },
};
