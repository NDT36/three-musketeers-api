import { CommonStatus } from '$types/enum';

export const createNftSchema: AjvSchema = {
  type: 'object',
  required: [
    'title',
    'shortDescription',
    'description',
    'staticPreview',
    'animatePreview',
    'artworkFile',
    'royaltiesPercent',
  ],
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 20,
    },
    shortDescription: {
      type: 'string',
      minLength: 1,
      maxLength: 64,
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
    staticPreview: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
    animatePreview: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
    artworkFile: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
    royaltiesPercent: {
      type: 'number',
      minimum: 0,
      maximum: 50,
    },
    externalUrl: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
    license: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
    website: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    isNsfw: {
      enum: [
        CommonStatus.ACTIVE,
        CommonStatus.INACTIVE,
        String(CommonStatus.ACTIVE),
        String(CommonStatus.INACTIVE),
      ],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
        maxLength: 1000,
      },
    },
    collections: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
        maxLength: 1000,
      },
    },
    traits: {
      type: 'array',
      items: {
        type: 'object',
        required: ['key', 'value'],
        additionalProperties: true,
        properties: {
          key: { type: 'string', minLength: 1, maxLength: 1000 },
          value: { type: 'string', minLength: 1, maxLength: 1000 },
        },
      },
    },
  },
};
