import BaseStorage from "./base-storage";
import { StorageType } from "../storage-type";
import BrowserStorage from "../../typings/browser-storage";

export default class KeyValueStorage
  extends BaseStorage
  implements BrowserStorage.IBrowserStorage
{
  private readonly storage: Storage;

  constructor(storage: Storage, type: StorageType) {
    super(type);

    this.storage = storage;
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
        reject: (reason?: any) => void
      ) => {
        this.asArray<string>(
          key,
          (keys: Array<string>) => {
            let values: Array<BrowserStorage.KeyValueOrError<V>> = [];
            let errors: Array<BrowserStorage.KeyValueOrError<V>> = [];

            for (let index in keys) {
              let key: string = keys[index];
              let value: V = JSON.parse(
                this.storage.getItem(this.getKeyName(key))
              );

              if (value !== null) {
                values.push({ key: key, value: value });
              } else {
                errors.push({
                  key: key,
                  error: `${
                    StorageType[this.storageType]
                  } storage: value with key "${key}" was not found!`,
                });
              }
            }

            // all keys was missing
            if (errors.length === keys.length) {
              reject(errors);
            } else if (errors.length > 0) {
              values.push(...errors);
              resolve(values);
            } else {
              resolve(values);
            }
          },
          (key: string) => {
            let value: V = JSON.parse(
              this.storage.getItem(this.getKeyName(key))
            );

            if (value !== null) {
              resolve({ key: key, value: value });
            } else {
              reject({
                key: key,
                error: `${
                  StorageType[this.storageType]
                } storage: value with key "${key}" was not found!`,
              });
            }
          }
        );
      }
    );
  }

  public set<V extends Object | number | string>(
    data: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>
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
        reject: (reason?: any) => void
      ) => {
        this.asArray<BrowserStorage.KeyValue<V>>(
          data,
          (data: Array<BrowserStorage.KeyValue<V>>) => {
            let values: Array<BrowserStorage.KeyValueOrError<V>> = [];
            let errors: Array<BrowserStorage.KeyValueOrError<V>> = [];

            for (let index in data) {
              let key = data[index].key;
              let value =
                typeof data[index].value !== "string"
                  ? JSON.stringify(data[index].value)
                  : <string>data[index].value;

              try {
                this.storage.setItem(this.getKeyName(key), value);
                values.push({ key: key, value: data[index].value });
              } catch (ex) {
                errors.push({
                  key: key,
                  error: `${
                    StorageType[this.storageType]
                  } storage: value with key "${key}" could not be set!`,
                });
              }
            }

            // all keys failed to be set
            if (errors.length === data.length) {
              reject(errors);
            } else if (errors.length > 0) {
              values.push(...errors);
              resolve(values);
            } else {
              resolve(values);
            }
          },
          (data: BrowserStorage.KeyValueOrError<V>) => {
            try {
              let value =
                typeof data.value !== "string"
                  ? JSON.stringify(data.value)
                  : <string>data.value;
              this.storage.setItem(this.getKeyName(data.key), value);
            } catch (ex) {
              reject({
                key: data.key,
                error: `${
                  StorageType[this.storageType]
                } storage: value with key "${data.key}" could not be set!`,
              });
            }

            resolve({ key: data.key, value: data.value });
          }
        );
      }
    );
  }

  public count(): Promise<BrowserStorage.ValueOrError<number>> {
    return new Promise<BrowserStorage.ValueOrError<number>>(
      (
        resolve: (value?: BrowserStorage.ValueOrError<number>) => void,
        reject: (reason?: any) => void
      ) => {
        let count: number = 0;

        for (let i = 0; i >= this.storage.length; i++) {
          const key = this.storage.key(i);

          if (key.startsWith("sp_", 0)) {
            count++;
          }
        }

        resolve({ value: this.storage.length });
      }
    );
  }

  public remove(
    key: string | Array<string>
  ): Promise<
    | BrowserStorage.KeyValueOrError<void>
    | Array<BrowserStorage.KeyValueOrError<void>>
  > {
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
            let removedKeys: Array<BrowserStorage.KeyValueOrError<void>> = [];
            let errors: Array<BrowserStorage.KeyValueOrError<void>> = [];

            for (let index in keys) {
              const key: string = keys[index];
              const storageKey = this.getKeyName(key);

              if (this.storage.getItem(storageKey) !== null) {
                this.storage.removeItem(storageKey);
                removedKeys.push({ key: key });
              } else {
                errors.push({
                  key: key,
                  error: `${
                    StorageType[this.storageType]
                  } storage: value with key "${key}" could not be removed!`,
                });
              }
            }

            // all keys failed removal
            if (errors.length === keys.length) {
              reject(errors);
            } else if (errors.length > 0) {
              removedKeys.push(...errors);
              resolve(removedKeys);
            } else {
              resolve(removedKeys);
            }
          },
          (key: string) => {
            const storageKey = this.getKeyName(key);

            if (this.storage.getItem(storageKey) !== null) {
              this.storage.removeItem(storageKey);
              resolve({ key: key });
            } else {
              reject({
                key: key,
                error: `${
                  StorageType[this.storageType]
                } storage: value with key "${key}" could not be removed!`,
              });
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
        let removedKeys: Array<string> = [];

        for (let i = 0; i >= this.storage.length; i++) {
          const key = this.storage.key(i);

          if (key.startsWith("sp_", 0)) {
            this.storage.removeItem(key);
            removedKeys.push(key);
          }
        }

        if (removedKeys.length === 0) {
          reject({ error: `storage: could not find any values to remove!` });
        }

        resolve();
      }
    );
  }
}
