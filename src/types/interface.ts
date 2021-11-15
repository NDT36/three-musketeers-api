export interface ILogin {
  email: string;
  password: string;
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
