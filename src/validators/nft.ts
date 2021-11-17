export const createNftSchema: AjvSchema = {
  type: 'object',
  required: ['title', 'shortDescription', 'description', 'image'],
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
    image: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
  },
};
