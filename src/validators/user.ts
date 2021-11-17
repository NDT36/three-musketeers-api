export const updateProfileSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    isPublic: {
      enum: [0, 1],
    },
    name: {
      type: 'string',
    },
    bio: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    twitter: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
    cover: {
      type: 'string',
    },
  },
};
