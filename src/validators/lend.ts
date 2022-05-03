import { CommonStatus, TransactionType } from '$types/enum';

export const createLendSchema: AjvSchema = {
  type: 'object',
  required: ['target', 'money', 'description', 'type', 'actionAt', 'sourceId'],
  additionalProperties: false,
  properties: {
    target: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    money: {
      type: 'integer',
    },
    description: {
      type: ['string', 'null'],
      maxLength: 255,
    },
    type: {
      enum: [TransactionType.DEBT, TransactionType.LEND],
    },
    actionAt: {
      type: 'number',
      minimum: 0,
    },
    sourceId: {
      type: ['string', 'null'],
      minLength: 1,
    },
  },
};

export const updateLendSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    target: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    description: {
      type: ['string', 'null'],
      maxLength: 255,
    },
    actionAt: {
      type: 'number',
      minimum: 0,
    },
    status: {
      enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE],
    },
  },
};

export const collectLendOrDebtSchema: AjvSchema = {
  type: 'object',
  required: ['sourceId', 'description', 'actionAt', 'money'],
  additionalProperties: false,
  properties: {
    sourceId: {
      type: ['string', 'null'],
      minLength: 1,
    },
    description: {
      type: ['string', 'null'],
      maxLength: 255,
    },
    actionAt: {
      type: 'number',
      minimum: 0,
    },
    money: {
      type: 'integer',
    },
  },
};
