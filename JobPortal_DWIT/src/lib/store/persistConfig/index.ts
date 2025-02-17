import { CookieStorage } from "redux-persist-cookie-storage";
import Cookies from "js-cookie";

class CustomCookieStorage extends CookieStorage {
  setItem(key: string, value: string) {
    const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";
    const domain = isProduction ? ".deerwalktrainingcenter.com" : "localhost";

    Cookies.set(key, value, {
      expires: 10, // 10 days
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      domain: domain,
    });
    return Promise.resolve(value);
  }
}

export const persistConfig: any = {
  timeout: 100,
  key: "root",
  storage: new CustomCookieStorage(Cookies),
  whitelist: ["authenticated"],
};
