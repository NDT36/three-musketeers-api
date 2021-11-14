import config from '$config';
import log from '$helpers/log';
import { error, fail } from '$helpers/response';
import { ErrorCode, TokenType } from '$types/enum';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { promisify } from 'util';
const verifyAsync = promisify(verify) as any;
const logger = log('authMiddlewares');

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  console.log('Hi');

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

    verifyAsync(token, config.AUTH.SECRET)
      .then(async (decoded: any) => {
        console.log(decoded);
        if (decoded.type === TokenType.ACCESS_TOKEN) {
          return next();
        }

        throw error(ErrorCode.Token_Expired, 401, { note: 'Invalid access token!' });
      })
      .catch((error) => {
        throw error(ErrorCode.Token_Expired, 401, { note: 'Invalid access token!' });
      });
  } catch (error) {
    logger.error(error);
    return fail(res, error, 401);
  }
}

export function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
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

    verifyAsync(token, config.AUTH.SECRET)
      .then(async (decoded: any) => {
        console.log(decoded);
        if (decoded.type === TokenType.REFRESH_TOKEN) {
          return next();
        }

        throw error(ErrorCode.Token_Expired, 401, { note: 'Invalid refresh token!' });
      })
      .catch((error) => {
        throw error(ErrorCode.Token_Expired, 401, { note: 'Invalid refresh token!' });
      });
  } catch (error) {
    logger.error(error);
    return fail(res, error, 401);
  }
}
