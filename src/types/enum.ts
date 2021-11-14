export enum ErrorCode {
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Missing_Access_Token_In_Header = 'Missing_Access_Token_In_Header',
  Token_Expired = 'Token_Expired',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}
