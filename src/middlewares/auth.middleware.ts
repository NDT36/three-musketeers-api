import config from '$config';
import log from '$helpers/log';
import { error, fail } from '$helpers/response';
import { ErrorCode, TokenType } from '$types/enum';
import { NextFunction, Request, Response } from 'express';
import { verify, VerifyOptions } from 'jsonwebtoken';
import { promisify } from 'util';
const verifyAsync = promisify(verify) as any;
const logger = log('authMiddlewares');

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'] || '';
  token = token.replace('Bearer ', '');

  /**
   * Kiểm tra xem token client gửi lên code okela không
   * Nếu oke thì assign payload vào biến request.
   */
  try {
    if (!token) {
      throw error(ErrorCode.Missing_Access_Token_In_Header, 401, { note: 'This API needs authorization!' });
    }

    verifyAsync(token, config.AUTH.SECRET, { algorithm: 'HS256' } as VerifyOptions)
      .then(async (decoded: any) => {
        /* -------------------------------------------------------------------------- */
        /*                                Assign userId                               */
        /* -------------------------------------------------------------------------- */
        if (decoded.type === TokenType.ACCESS_TOKEN) {
          Object.assign(req, { userId: decoded._id });
          return next();
        }

        throw error(ErrorCode.Token_Expired, 401, { note: 'Invalid access token!' });
      })
      .catch(() => {
        throw error(ErrorCode.Token_Expired, 401, { note: 'Invalid access token!' });
      });
  } catch (err) {
    logger.error(err);
    return fail(res, err, 401);
  }
}
