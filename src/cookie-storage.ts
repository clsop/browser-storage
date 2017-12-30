import BaseStorage from './base-storage';
import { StorageType } from './enums';

export default class CookieStorage extends BaseStorage implements BrowserStorage.IBrowserStorage {
	private aKeys: number[];
	private cookies: Object;

	public readonly COOKIE_PART: string;

	constructor() {
		super(StorageType.Cookie);

		this.COOKIE_PART = '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';
		this.aKeys = [];
		this.cookies = {};

		this.initializeCookies();
	}

	private initializeCookies(): Object {
		for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
			aCouple = aCouples[nIdx].split(/\s*=\s*/);
			if (aCouple.length > 1) {
				this.cookies[iKey = decodeURI(aCouple[0])] = decodeURI(aCouple[1]);
				this.aKeys.push(iKey);
			}
		}

		return this.cookies;
	}

	private foundOrNot<V>(key: string, values: Array<BrowserStorage.KeyValueOrError<V>>): Array<BrowserStorage.KeyValueOrError<V>> {
		let value: V = this.cookies[key] ? this.cookies[key] : this.initializeCookies()[key];

		if (value !== undefined) {
			values.push({ key: key, value: value });
		} else {
			values.push({ key: key, error: `${StorageType[this.storageType]} storage: value with key "${key}" was not found!` });
		}

		return values;
	}

	public get<V extends Object | number | string>(key: string | Array<string>): Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>> {
		return new Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>>(
			(resolve: (value?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void,
				reject: (reason?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void) => {
				this.asArray<string>(key, (keys: Array<string>) => {
					let values: Array<BrowserStorage.KeyValueOrError<V>> = [];

					for (let index in keys) {
						this.foundOrNot<V>(keys[index], values);
					}

					if (values.filter((value) => value.error !== undefined).length === values.length) {
						reject(values);
					}

					resolve(values);
				}, (key: string) => {
					let value = this.foundOrNot<V>(key, [])[0];

					if (value.error !== undefined) {
						reject(value);
					} else {
						resolve(value);
					}
				});
			});
	}

	public set<V extends Object | number | string>(data: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>): Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>> {
		return new Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>>(
			(resolve: (value?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void,
				reject: (reason?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void) => {
				this.asArray<BrowserStorage.KeyValue<V>>(data, (keyValues: Array<BrowserStorage.KeyValue<V>>) => {
					for (let index in keyValues) {
						let key = keyValues[index].key;
						let value = keyValues[index].value;

						document.cookie = `${key}=${JSON.stringify(value)}${this.COOKIE_PART}`;
					}

					resolve(keyValues);
				}, (keyValue: BrowserStorage.KeyValue<V>) => {
					document.cookie = `${keyValue.key}=${JSON.stringify(keyValue.value)}${this.COOKIE_PART}`;

					resolve(keyValue);
				});
			});
	}

	public count(): Promise<BrowserStorage.ValueOrError<number>> {
		return new Promise<BrowserStorage.ValueOrError<number>>(
			(resolve: (value?: BrowserStorage.ValueOrError<number>) => void,
				reject: (reason?: BrowserStorage.ValueOrError<number>) => void) => {

			});
	}

	public remove(key: string | Array<string>): Promise<BrowserStorage.KeyValueOrError<void> | Array<BrowserStorage.KeyValueOrError<void>>> {
		return new Promise<BrowserStorage.KeyValueOrError<void> | Array<BrowserStorage.KeyValueOrError<void>>>(
			(resolve: (value?: BrowserStorage.KeyValueOrError<void> | Array<BrowserStorage.KeyValueOrError<void>>) => void,
				reject: (reason?: BrowserStorage.KeyValueOrError<void> | Array<BrowserStorage.KeyValueOrError<void>>) => void) => {

			});
	}

	public clear(): Promise<BrowserStorage.ValueOrError<void>> {
		return new Promise<BrowserStorage.ValueOrError<void>>(
			(resolve: (value?: BrowserStorage.ValueOrError<void>) => void,
				reject: (reason?: BrowserStorage.ValueOrError<void>) => void) => {

			});
	}
}