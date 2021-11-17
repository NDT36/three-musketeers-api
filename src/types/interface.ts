export interface ILogin {
  email: string;
  password: string;
  walletAddress: string;
}

export interface IRegister {
  email: string;
  password: string;
  walletAddress: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfile {
  isPublic?: number;
  name?: string;
  bio?: string;
  location?: string;
  twitter?: string;
  website?: string;
  avatar?: string;
  cover?: string;
}
