import BaseStorage from './base-storage';

export default class IndexedDBStorage extends BaseStorage implements BrowserStorage.IBrowserStorage {
	private indexedDB: IDBFactory;

	constructor(indexedDB: IDBFactory) {
		super();

		this.indexedDB = indexedDB;
	}

	public get<V extends Object | number | string>(key: string | Array<string>): Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>> {
		return new Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>>(
			(resolve: (value?: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>) => void,
				reject: (reason?: any) => void) => {

			});
	}

	public set<V extends Object | number | string>(data: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>): Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>> {
		return new Promise<BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>>(
			(resolve: (value?: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>) => void,
				reject: (reason?: any) => void) => {

			});
	}

	public count(): Promise<number> {
		return new Promise<number>(
			(resolve: (value?: number) => void,
				reject: (reason?: any) => void) => {

			});
	}

	public remove(key: string | Array<string>): Promise<string | Array<string>> {
		return new Promise<string | Array<string>>(
			(resolve: (value?: string | Array<string>) => void,
				reject: (reason?: any) => void) => {

			});
	}

	public clear(): Promise<void> {
		return new Promise<void>(
			(resolve: (value?: void) => void,
				reject: (reason?: any) => void) => {

			});
	}
}