import { compareSync, hashSync } from 'bcryptjs';
import { error } from '$helpers/response';
import { ILogin, IChangePassword, IRegister } from '$types/interface';
import { ErrorCode, TokenType, UserStatus } from '$types/enum';
import { UserModel } from '$models/UserModel';
import { JwtPayload, sign, verify, VerifyOptions } from 'jsonwebtoken';
import config from '$config';
import log from '$helpers/log';
const logger = log('User model');

/**
 * Login by email & password
 * @returns accressToken and refreshToken
 */
export async function login(params: ILogin) {
  const { email, password } = params;

  const User = await UserModel.findOne({ email }, ['_id', 'email', 'password', 'status', 'refreshToken']);
  const userObject = User.toObject();

  if (!userObject) throw error(ErrorCode.Email_Address_Not_Exist);
  if (userObject.status === UserStatus.INACTIVE) throw error(ErrorCode.User_Blocked);

  const isCorrectPassword = compareSync(password, userObject.password);
  if (!isCorrectPassword) throw error(ErrorCode.Password_Incorrect);

  const token = generateToken({ _id: String(userObject._id), refreshToken: userObject.refreshToken });

  /* -------------------------------------------------------------------------- */
  /*                      Update refresh token to database                      */
  /* -------------------------------------------------------------------------- */
  User.refreshToken = token.refreshToken;
  await User.save();

  return token;
}

export async function register(params: IRegister) {
  const { email, password, walletAddress } = params;
  const oldUser = await UserModel.findOne({ email }, ['_id']).lean();

  if (oldUser) throw error(ErrorCode.Email_Address_Already_Exist);

  const passwordHash = hashSync(password, config.AUTH.SALT_ROUND);

  /* -------------------------------------------------------------------------- */
  /*                               Create new user                              */
  /* -------------------------------------------------------------------------- */
  const User = new UserModel({ email, password: passwordHash, walletAddress });
  const result = (await User.save()).toObject();
  const token = generateToken({ _id: String(result._id), refreshToken: '' });

  /* -------------------------------------------------------------------------- */
  /*                      Update refresh token to database                      */
  /* -------------------------------------------------------------------------- */
  User.refreshToken = token.refreshToken;
  await User.save();

  return token;
}

export async function refreshToken(refreshToken: string) {
  try {
    const payload = verify(refreshToken, config.AUTH.SECRET, { algorithm: 'HS256' } as VerifyOptions) as JwtPayload;
    if (payload.type !== TokenType.REFRESH_TOKEN) {
      throw error(ErrorCode.Refresh_Token_Expired, 401, { note: 'Token type invalid!' });
    }

    const user = await UserModel.findOne({ _id: payload._id }, ['_id', 'status', 'refreshToken']).lean();
    if (!user) throw error(ErrorCode.User_Not_Found, 401);
    if (user.status === UserStatus.INACTIVE) throw error(ErrorCode.User_Blocked);

    /* -------------------------------------------------------------------------- */
    /*      Refresh token validate. But does not match with user.refreshToken     */
    /* -------------------------------------------------------------------------- */
    if (user.refreshToken !== refreshToken) {
      throw error(ErrorCode.Refresh_Token_Expired, 401, { note: 'Force logout! Please login again!' });
    }

    return generateToken({ _id: payload._id, refreshToken });
  } catch (err) {
    logger.error(err);
    throw error(ErrorCode.Refresh_Token_Expired, 401, { note: 'Refresh token expired!' });
  }
}

export async function changePassword(userId: string, params: IChangePassword) {
  const { oldPassword, newPassword } = params;

  const User = await UserModel.findOne({ _id: userId }, ['_id', 'password']);
  const userObject = User.toObject();
  const isCorrectPassword = compareSync(oldPassword, userObject.password);
  if (!isCorrectPassword) throw error(ErrorCode.Password_Incorrect);

  const passwordHash = hashSync(newPassword, config.AUTH.SALT_ROUND);
  User.password = passwordHash;
  await User.save();
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
    const payload = verify(refreshToken, config.AUTH.SECRET, { algorithm: 'HS256' } as VerifyOptions) as JwtPayload;
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
