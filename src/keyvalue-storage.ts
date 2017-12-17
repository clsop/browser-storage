import BaseStorage from './base-storage';

export default class KeyValueStorage extends BaseStorage implements BrowserStorage.IBrowserStorage {
	private readonly storage: Storage;

	constructor(storage: Storage) {
		super();

		this.storage = storage;
	}

	private resolveValue<V extends Object | number | string>(rawValue: any): V {
		let value: V = null;

		try {
			value = JSON.parse(rawValue);
		} catch (ex) {
			value = rawValue;
		}

		return value;
	}

	public get<V extends Object | number | string>(key: string | Array<string>): Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>> {
		return new Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>>(
			(resolve: (value?: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>) => void,
				reject: (reason?: any) => void) => {
				this.asArray<string>(key, (keys: Array<string>) => {
					let values: Array<BrowserStorage.KeyValue<V>> = [];
					let errors: Array<BrowserStorage.Error> = [];

					for (let index in keys) {
						let key: string = keys[index];
						let value: V = this.resolveValue<V>(this.storage.getItem(key));

						if (!value) {
							errors.push({ key: key, error: `Local storage: value with key "${key}" was not found!` });
						} else {
							values.push({ key: key, value: value });
						}
					}

					// all keys was missing
					if (errors.length === keys.length) {
						reject(errors);
					} else {
						resolve(values);
					}
				}, (key: string) => {
					let value: V = this.resolveValue<V>(this.storage.getItem(key));

					if (!value) {
						reject({ key: key, error: `Local storage: value with key "${key}" was not found!` });
					} else {
						resolve({ key: key, value: value });
					}
				});
			});
	}

	public set<V extends Object | number | string>(data: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>): Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>> {
		return new Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>>(
			(resolve: (value?: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>) => void,
				reject: (reason?: any) => void) => {
				this.asArray<BrowserStorage.KeyValue<V>>(data, (data: Array<BrowserStorage.KeyValue<V>>) => {
					let values: Array<BrowserStorage.KeyValue<V>> = [];

					for (let index in data) {
						let key = data[index].key;
						let value = data[index].value;

						this.storage.setItem(key, JSON.stringify(value));
						values.push({ key: key, value: value });
					}
					
					resolve(values);
				}, (data: BrowserStorage.KeyValue<V>) => {
					this.storage.setItem(data.key, JSON.stringify(data.value));

					resolve({ key: data.key, value: data.value });
				});
			});
	}

	public count(): Promise<number> {
		return new Promise<number>(
			(resolve: (value?: number) => void, reject: (reason?: any) => void) => {
				resolve(this.storage.length);
			});
	}

	public remove(key: string | Array<string>): Promise<string | Array<string>> {
		return new Promise<string | Array<string>>(
			(resolve: (value?: string | Array<string>) => void,
				reject: (reason?: any) => void) => {
				this.asArray<string>(key, (keys: Array<string>) => {
					let removedKeys: Array<string> = [];
					let errors: Array<BrowserStorage.Error> = [];

					for (let index in keys) {
						let key: string = keys[index];

						if (this.storage.getItem(key) !== null) {
							errors.push({ key: key, error: `Local storage: value with key "${key}" could not be removed!` });
						} else {
							this.storage.removeItem(key);	
							removedKeys.push(key);
						}
					}

					// all keys failed removal
					if (errors.length === keys.length) {
						reject(errors);
					} else {
						resolve(removedKeys);	
					}
				}, (key: string) => {
					if (this.storage.getItem(key) !== null) {
						this.storage.removeItem(key);
						resolve(key);
					} else {
						reject({ key: key, error: `Local storage: value with key "${key}" could not be removed!` });
					}
					
				});
			});
	}

	public clear(): Promise<void> {
		return new Promise<void>(
			(resolve: (value?: void) => void,
				reject: (reason?: any) => void) => {
				this.storage.clear();
				resolve();
			});
	}
}