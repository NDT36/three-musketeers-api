import config from '$config';
import log from '$helpers/log';
import { error, fail } from '$helpers/response';
import { UserModel } from '$models/UserModel';
import { ErrorCode, TokenType, UserStatus } from '$types/enum';
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
      throw error(ErrorCode.Missing_Access_Token_In_Header, 401, {
        note: 'This API needs authorization!',
      });
    }

    verifyAsync(token, config.AUTH.SECRET, { algorithm: 'HS256' } as VerifyOptions)
      .then(async (decoded: any) => {
        /* -------------------------------------------------------------------------- */
        /*                                Assign userId                               */
        /* -------------------------------------------------------------------------- */
        if (decoded.type === TokenType.ACCESS_TOKEN) {
          Object.assign(req, { userId: decoded._id });
          /* -------------------------------------------------------------------------- */
          /*                   Check user status before authorization                   */
          /* -------------------------------------------------------------------------- */
          const User = await UserModel.findOne({ _id: decoded._id }, ['_id', 'status']).lean();
          if (User.status === UserStatus.INACTIVE) {
            return fail(
              res,
              error(ErrorCode.User_Blocked, 401, { note: 'User account blocked!' }),
              401
            );
          }
          return next();
        }

        throw error(ErrorCode.Token_Expired, 401, { note: 'Invalid access token type!' });
      })
      .catch(() => {
        const err = error(ErrorCode.Token_Expired, 401, { note: 'Invalid access token!' });
        return fail(res, err, 401);
      });
  } catch (err) {
    logger.error(err);
    return fail(res, err, 401);
  }
}

/* -------------------------------------------------------------------------- */
/*                             Secret from config                             */
/* -------------------------------------------------------------------------- */
export function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'] || '';
  token = token.replace('Bearer ', '');

  /**
   * Kiểm tra xem token client gửi lên code okela không
   * Nếu oke thì assign payload vào biến request.
   */
  try {
    if (token !== config.AUTH.ADMIN_TOKEN) {
      return fail(
        res,
        error(ErrorCode.Wrong_Admin_Token, 401, { note: 'Admin token invalid!' }),
        401
      );
    }
    return next();
  } catch (err) {
    logger.error(err);
    return fail(res, err, 401);
  }
}
