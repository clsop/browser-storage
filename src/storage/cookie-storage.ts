import BaseStorage from "./base-storage";
import { StorageType } from "../storage-type";
import BrowserStorage from "../../typings/browser-storage";
import CookieOptions from "../cookie-options";

type CookieObject = {
  [property: string]: string;
};
type Cookies = {
  [cookieKey: string]: CookieObject;
};

export default class CookieStorage
  extends BaseStorage
  implements BrowserStorage.ICookieStorage
{
  private readonly keySplit: RegExp;
  private cookies: Cookies;

  constructor() {
    super(StorageType.Cookie);

    this.keySplit = /\s*=\s*/;
    this.cookies = {};

    this.initializeCookies();
  }

  private initializeCookies(): Cookies {
    const rawCookies = document.cookie.split("\r");

    if (rawCookies.length > 0 && rawCookies[0] !== "") {
      for (let i = 0; i < rawCookies.length; i++) {
        const rawCookie = rawCookies[i];
        let cookie: CookieObject = {};
        const aCouples = rawCookie.split(/bs_\s*;\s*/);

        for (let aCouple, iKey, nIdx = 0; nIdx < aCouples.length; nIdx++) {
          aCouple = aCouples[nIdx].split(this.keySplit);
          const key = aCouple[0].substring(3);

          if (aCouple.length > 1) {
            cookie[(iKey = decodeURI(key))] = decodeURI(aCouple[1]);
          }
        }

        const key = aCouples[0].split(this.keySplit)[0].substring(3);
        this.cookies[key] = cookie;
      }
    }

    return this.cookies;
  }

  private foundOrNot<V>(
    key: string,
    values: Array<BrowserStorage.KeyValueOrError<V>>
  ): Array<BrowserStorage.KeyValueOrError<V>> {
    let cookie: CookieObject = this.cookies[key]
      ? this.cookies[key]
      : this.initializeCookies()[key];

    if (cookie && key in cookie) {
      values.push({ key: key, value: JSON.parse(cookie[key]) });
    } else {
      values.push({
        key: key,
        error: `${
          StorageType[this.storageType]
        } storage: value with key "${key}" was not found!`,
      });
    }

    return values;
  }

  private enumerateCookies(predicate: (key: string, value: any) => void): void {
    const rawCookies = document.cookie.split("\r");

    if (rawCookies.length > 0 && rawCookies[0] !== "") {
      for (let i = 0; i < rawCookies.length; i++) {
        const rawCookie = rawCookies[i];
        const aCouples = rawCookie.split(this.keySplit);

        if (aCouples.length > 1 && aCouples[0].startsWith("bs_")) {
          predicate(aCouples[0], typeof aCouples[1] === "string" ? aCouples[1] : JSON.parse(aCouples[1]));
        }
      }
    }
  }

  public get<V extends Object | number | string>(
    key: string | Array<string>
  ): Promise<
    BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>
  > {
    return new Promise<
      | BrowserStorage.KeyValueOrError<V>
      | Array<BrowserStorage.KeyValueOrError<V>>
    >(
      (
        resolve: (
          value?:
            | BrowserStorage.KeyValueOrError<V>
            | Array<BrowserStorage.KeyValueOrError<V>>
        ) => void,
        reject: (
          reason?:
            | BrowserStorage.KeyValueOrError<V>
            | Array<BrowserStorage.KeyValueOrError<V>>
        ) => void
      ) => {
        this.asArray<string>(
          key,
          (keys: Array<string>) => {
            let values: Array<BrowserStorage.KeyValueOrError<V>> = [];

            for (let index in keys) {
              this.foundOrNot<V>(keys[index], values);
            }

            if (
              values.filter((value) => value.error !== undefined).length ===
              values.length
            ) {
              reject(values);
            }

            resolve(values);
          },
          (key: string) => {
            let value = this.foundOrNot<V>(key, [])[0];

            if (value.error !== undefined) {
              reject(value);
            } else {
              resolve(value);
            }
          }
        );
      }
    );
  }

  public set<
    V extends Object | number | string,
    O extends BrowserStorage.ICookieOptions
  >(
    data: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>,
    options?: O
  ): Promise<
    BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>
  > {
    var cookieOptions = new CookieOptions<V>(options);

    return new Promise<
      | BrowserStorage.KeyValueOrError<V>
      | Array<BrowserStorage.KeyValueOrError<V>>
    >(
      (
        resolve: (
          value?:
            | BrowserStorage.KeyValueOrError<V>
            | Array<BrowserStorage.KeyValueOrError<V>>
        ) => void,
        reject: (
          reason?:
            | BrowserStorage.KeyValueOrError<V>
            | Array<BrowserStorage.KeyValueOrError<V>>
        ) => void
      ) => {
        this.asArray<BrowserStorage.KeyValue<V>>(
          data,
          (keyValues: Array<BrowserStorage.KeyValue<V>>) => {
            for (let index in keyValues) {
              let keyValue = keyValues[index];
              keyValue.key = this.getKeyName(keyValue.key);
              document.cookie = cookieOptions.create(keyValue);
            }

            resolve(keyValues);
          },
          (keyValue: BrowserStorage.KeyValue<V>) => {
            let keyValueCopy = Object.assign({}, keyValue);
            keyValueCopy.key = this.getKeyName(keyValue.key);
            document.cookie = cookieOptions.create(keyValueCopy);

            resolve(keyValue);
          }
        );
      }
    );
  }

  public count(): Promise<BrowserStorage.ValueOrError<number>> {
    return new Promise<BrowserStorage.ValueOrError<number>>(
      (
        resolve: (value?: BrowserStorage.ValueOrError<number>) => void,
        reject: (reason?: BrowserStorage.ValueOrError<number>) => void
      ) => {
        let count: number = 0;
        this.enumerateCookies((key, value) => count++);
        resolve({ value: count });
      }
    );
  }

  public remove(
    key: string | Array<string>
  ): Promise<
    | BrowserStorage.KeyValueOrError<void>
    | Array<BrowserStorage.KeyValueOrError<void>>
  > {
    var cookieOptions = new CookieOptions<void>({
      maxAge: 0,
    });

    return new Promise<
      | BrowserStorage.KeyValueOrError<void>
      | Array<BrowserStorage.KeyValueOrError<void>>
    >(
      (
        resolve: (
          value?:
            | BrowserStorage.KeyValueOrError<void>
            | Array<BrowserStorage.KeyValueOrError<void>>
        ) => void,
        reject: (
          reason?:
            | BrowserStorage.KeyValueOrError<void>
            | Array<BrowserStorage.KeyValueOrError<void>>
        ) => void
      ) => {
        this.asArray<string>(
          key,
          (keys: Array<string>) => {
            let keyValues: Array<BrowserStorage.KeyValueOrError<void>> = [];

            for (let index in keys) {
              this.foundOrNot<void>(keys[index], keyValues);

              if (keyValues.length > 0) {
                for (let valuePair of keyValues) {
                  const keyValue: BrowserStorage.KeyValueOrError<void> = {
                    key: valuePair.key,
                    value: valuePair.value,
                  };

                  if (!keyValue.error) {
                    document.cookie = cookieOptions.create({
                      key: keyValue.key,
                      value: keyValue.value,
                    });
                  }
                }
              }
            }

            resolve(keyValues);
          },
          (key: string) => {
            const valuePair = this.foundOrNot<void>(key, [])[0];

            if (!valuePair.error) {
              document.cookie = cookieOptions.create({
                key: valuePair.key,
                value: valuePair.value,
              });
              resolve(valuePair);
            } else {
              reject(valuePair);
            }
          }
        );
      }
    );
  }

  public clear(): Promise<BrowserStorage.ValueOrError<void>> {
    return new Promise<BrowserStorage.ValueOrError<void>>(
      (
        resolve: (value?: BrowserStorage.ValueOrError<void>) => void,
        reject: (reason?: BrowserStorage.ValueOrError<void>) => void
      ) => {
        const cookieOptions = new CookieOptions<any>({ maxAge: 0 });
        this.enumerateCookies(
          (key, value) =>
            (document.cookie = cookieOptions.create({ key: key, value: value }))
        );
        resolve();
      }
    );
  }
}
