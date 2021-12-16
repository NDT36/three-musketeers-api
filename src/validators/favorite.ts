import { FavoriteStatus } from '$types/enum';

export const likeOrDislikeSchema: AjvSchema = {
  type: 'object',
  required: ['status', 'targetId'],
  additionalProperties: false,
  properties: {
    status: {
      enum: [
        FavoriteStatus.LIKE,
        FavoriteStatus.DISLIKE,
        String(FavoriteStatus.LIKE),
        String(FavoriteStatus.DISLIKE),
      ],
    },
    targetId: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};
