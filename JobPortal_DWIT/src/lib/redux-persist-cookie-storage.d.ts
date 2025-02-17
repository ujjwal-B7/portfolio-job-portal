// redux-persist-cookie-storage.d.ts

declare module "redux-persist-cookie-storage" {
  import { Storage } from "redux-persist";
  import { Cookies } from "js-cookie";

  interface CookieStorageOptions {
    expiration?: {
      default?: number;
      [key: string]: number | undefined;
    };
    path?: string;
    secure?: boolean;
  }

  export class CookieStorage implements Storage {
    constructor(cookies: Cookies, options?: CookieStorageOptions);
    getItem(
      key: string,
      callback: (error: any, result: string | null) => void
    ): void;
    setItem(key: string, value: string, callback: (error: any) => void): void;
    removeItem(key: string, callback: (error: any) => void): void;
  }
}
