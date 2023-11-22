export interface IErrorInfo {
  type: string;
  message: string;
}

// export interface ILoginInfo {
//   token
// }

export enum EERRORCODE {
  DISABLE_ACCOUNT = 20007,
  USER_NOT_FOUND = 20008,
  USER_PASSWORD_ERRO = 20009,
  MOBILE_ERROR = 20010
}

export interface IQrCodeObj {
  name: string;
  account: string;
  identifier: string;
  date: number;
  system: string;
}
