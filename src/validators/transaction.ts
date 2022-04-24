import { TransactionType } from '$types/enum';

export const createTransactionSchema: AjvSchema = {
  type: 'object',
  required: ['categoryId', 'users', 'description', 'money'],
  additionalProperties: false,
  properties: {
    categoryId: {
      type: ['string', 'null'],
      minLength: 1,
    },
    description: {
      type: 'string',
      minLength: 0,
      maxLength: 100,
    },
    actionAt: {
      type: 'number',
    },
    groupId: {
      type: ['string', 'null'],
      minLength: 1,
    },
    sourceId: {
      type: ['string', 'null'],
      minLength: 1,
    },
    targetSourceId: {
      type: ['string', 'null'],
      minLength: 1,
    },
    type: {
      type: 'number',
      enum: [
        TransactionType.EXPENSE,
        TransactionType.INCOME,
        TransactionType.LEND,
        TransactionType.UPDATE_BALANCE,
        TransactionType.TRANSFER_MONEY,
      ],
    },
    money: {
      type: 'integer',
    },
    users: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
      },
    },
  },
};

export const updateTransactionSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    categoryId: {
      type: 'string',
      minLength: 1,
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    image: {
      type: 'string',
    },
    actionAt: {
      type: 'number',
    },
    money: {
      type: 'integer',
      minimum: 0,
    },
    users: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
      },
    },
  },
};
