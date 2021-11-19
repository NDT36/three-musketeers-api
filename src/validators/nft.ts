export const createNftSchema: AjvSchema = {
  type: 'object',
  required: ['title', 'shortDescription', 'description', 'image', 'price'],
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
    price: {
      type: 'number',
      minimum: 0,
    },
    categoryId: {
      type: 'string',
      minLength: 1,
    },
  },
};

export const sellSchema: AjvSchema = {
  type: 'object',
  required: ['price'],
  additionalProperties: false,
  properties: {
    price: {
      type: 'number',
      minimum: 0,
    },
  },
};
