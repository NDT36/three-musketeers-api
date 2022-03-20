import { NextFunction, Request, Response } from 'express';

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginBySocial {
  token: string;
  type: 'Google' | 'Facebook' | string;
}

export interface IRegister {
  email: string;
  password: string;
  name: string;
}

export interface IRouteHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}
