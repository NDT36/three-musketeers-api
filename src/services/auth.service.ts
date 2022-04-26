import { compareSync, hashSync } from 'bcryptjs';
import { error } from '$helpers/response';
import { ILogin, ILoginBySocial, IRegister } from '$types/interface';
import { ErrorCode, LoginSocialType, TokenType, UserStatus } from '$types/enum';
import { UserModel } from '$models/UserModel';
import { JwtPayload, sign, verify, VerifyOptions } from 'jsonwebtoken';
import config from '$config';
import log from '$helpers/log';
import { verifyIdToken } from '$helpers/firebase/firebase';
import { createSource } from './source.service';
const logger = log('User model');

/**
 * Login by email & password
 * @returns accressToken and refreshToken
 */
export async function login(params: ILogin) {
  const { email, password } = params;

  const User = await UserModel.findOne({ email }, [
    '_id',
    'email',
    'password',
    'status',
    'refreshToken',
  ]);

  if (!User) throw error(ErrorCode.Email_Address_Not_Exist);

  if (User.status === UserStatus.INACTIVE) throw error(ErrorCode.User_Blocked);

  const isCorrectPassword = compareSync(password, User.password);
  if (!isCorrectPassword) throw error(ErrorCode.Password_Incorrect);

  const token = generateToken({
    _id: String(User._id),
    refreshToken: User.refreshToken,
  });

  /* -------------------------------------------------------------------------- */
  /*                      Update refresh token to database                      */
  /* -------------------------------------------------------------------------- */
  User.refreshToken = token.refreshToken;
  await User.save();

  return token;
}

export async function loginBySocial(params: ILoginBySocial) {
  if (params.type === LoginSocialType.GOOGLE) {
    const profile = await verifyIdToken(params.token);
    const googleUID = profile.uid;
    const picture = profile.picture;

    const user = await UserModel.findOne({ googleUID }, [
      '_id',
      'status',
      'avatar',
      'refreshToken',
    ]);

    if (!user) {
      const { email, name } = profile;

      /* -------------------------------------------------------------------------- */
      /*                               Create new user                              */
      /* -------------------------------------------------------------------------- */
      const userModel = new UserModel({ email, avatar: picture, name, googleUID });
      const result = (await userModel.save()).toObject();
      const token = generateToken({ _id: String(result._id), refreshToken: '' });

      /* -------------------------------------------------------------------------- */
      /*                      Update refresh token to database                      */
      /* -------------------------------------------------------------------------- */
      userModel.refreshToken = token.refreshToken;
      const user = await userModel.save();

      await createSource(String(user._id), { balance: 0, name: 'Cash' });
      return token;
    }

    if (user.status === UserStatus.INACTIVE) throw error(ErrorCode.User_Blocked);

    const token = generateToken({
      _id: String(user._id),
      refreshToken: user.refreshToken,
    });

    /* -------------------------------------------------------------------------- */
    /*                      Update refresh token to database                      */
    /* -------------------------------------------------------------------------- */
    Object.assign(user, { refreshToken: token.refreshToken, avatar: picture });

    await user.save();

    return token;
  }

  throw error(ErrorCode.Invalid_Input, 422, 'Wrong social type');
}

export async function refreshToken(refreshToken: string) {
  try {
    const payload = verify(refreshToken, config.AUTH.SECRET, {
      algorithm: 'HS256',
    } as VerifyOptions) as JwtPayload;

    if (payload.type !== TokenType.REFRESH_TOKEN) {
      throw error(ErrorCode.Refresh_Token_Expired, 401, { note: 'Token type invalid!' });
    }

    const user = await UserModel.findOne({ _id: payload._id }, [
      '_id',
      'status',
      'refreshToken',
    ]).lean();
    if (!user) throw error(ErrorCode.User_Not_Found, 401);
    if (user.status === UserStatus.INACTIVE) throw error(ErrorCode.User_Blocked);

    /* -------------------------------------------------------------------------- */
    /*      Refresh token validate. But does not match with user.refreshToken     */
    /* -------------------------------------------------------------------------- */
    if (user.refreshToken !== refreshToken) {
      throw error(ErrorCode.Refresh_Token_Expired, 401, {
        note: 'Force logout! Please login again!',
      });
    }

    return generateToken({ _id: payload._id, refreshToken });
  } catch (err) {
    logger.error(err);
    throw error(ErrorCode.Refresh_Token_Expired, 401, { note: 'Refresh token expired!' });
  }
}

/**
 * create token & refresh token
 */
export function generateToken({ _id, refreshToken }: { _id: string; refreshToken: string }) {
  const results = {} as { accessToken: string; refreshToken: string };

  Object.assign(results, { accessToken: generateAccessToken({ _id }) });

  /* -------------------------------------------------------------------------- */
  /*                   Create new one if refreshToken expires                   */
  /* -------------------------------------------------------------------------- */
  try {
    const payload = verify(refreshToken, config.AUTH.SECRET, {
      algorithm: 'HS256',
    } as VerifyOptions) as JwtPayload;
    if (payload.type !== TokenType.REFRESH_TOKEN) throw error(ErrorCode.Refresh_Token_Expired);
    Object.assign(results, { refreshToken });
  } catch (err) {
    Object.assign(results, { refreshToken: createCmsRefreshToken({ _id }) });
  }

  return results;
}

export function generateAccessToken({ _id }) {
  return sign({ _id, type: TokenType.ACCESS_TOKEN }, config.AUTH.SECRET, {
    algorithm: 'HS256',
    expiresIn: config.AUTH.TOKEN_TTL,
  });
}

export function createCmsRefreshToken({ _id }) {
  return sign({ _id, type: TokenType.REFRESH_TOKEN }, config.AUTH.SECRET, {
    algorithm: 'HS256',
    expiresIn: config.AUTH.REFRES_TOKEN_TTL,
  });
}
