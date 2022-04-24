export enum ErrorCode {
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Missing_Access_Token_In_Header = 'Missing_Access_Token_In_Header',
  Token_Expired = 'Token_Expired',
  Refresh_Token_Expired = 'Refresh_Token_Expired',
  Email_Address_Not_Exist = 'Email_Address_Not_Exist',
  Email_Address_Already_Exist = 'Email_Address_Already_Exist',
  User_Blocked = 'User_Blocked',
  Password_Incorrect = 'Password_Incorrect',
  User_Not_Found = 'User_Not_Found',
  Group_Not_Found = 'Group_Not_Found',
  You_Are_Not_Member_Of_This_Group = 'You_Are_Not_Member_Of_This_Group',
  You_Are_Not_Creator_Of_This_Group = 'You_Are_Not_Creator_Of_This_Group',
  Member_Duplicate = 'Member_Duplicate',
  Target_User_Contain_Someone_Not_In_This_Group = 'Target_User_Contain_Someone_Not_In_This_Group',
  Transaction_Not_Found = 'Transaction_Not_Found',
  Category_Not_Found = 'Category_Not_Found',
  Access_Denided = 'Access_Denided',
  Category_Name_Already_Exist = 'Category_Name_Already_Exist',
  Source_Not_Found = 'Source_Not_Found',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum CommonStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum Token {
  SOLANA = 'SOLANA',
  USDT = 'USDT',
  RACEFI = 'RACEFI',
}

export enum TransactionType {
  EXPENSE = 1,
  INCOME = 2,
  LEND = 3,
  DEBT = 4,
  TRANSFER_MONEY = 5,
  UPDATE_BALANCE = 6,
}

export enum CategoryType {
  COMMON = 1,
  FOOD = 2,
  GIFT = 3,
  OTHER = 4,
}

export enum LoginSocialType {
  GOOGLE = 'Google',
  FACEBOOK = 'Facebook',
}
