export const createGroupSchema: AjvSchema = {
  type: 'object',
  required: ['name', 'description'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    description: {
      type: 'string',
      minLength: 1,
    },
    avatar: {
      type: 'string',
    },
  },
};

export const updateGroupSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    description: {
      type: 'string',
      minLength: 1,
    },
    avatar: {
      type: 'string',
    },
  },
};

export const addMemberGroupToSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    userId: {
      type: 'string',
      minLength: 1,
    },
  },
};

export const removeMemberFromToSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    userId: {
      type: 'string',
      minLength: 1,
    },
  },
};
