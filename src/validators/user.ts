export const updateProfileSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    isPublic: {
      enum: [0, 1, '0', '1'],
    },
    name: {
      type: 'string',
      maxLength: 255,
    },
    bio: {
      type: 'string',
      maxLength: 500,
    },
    location: {
      type: 'string',
      maxLength: 500,
    },
    twitter: {
      type: 'string',
      maxLength: 255,
    },
    website: {
      type: 'string',
      maxLength: 255,
    },
    avatar: {
      type: 'string',
      maxLength: 500,
    },
    cover: {
      type: 'string',
      maxLength: 500,
    },
  },
};
