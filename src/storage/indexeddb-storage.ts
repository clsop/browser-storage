import BaseStorage from './base-storage';
import { StorageType } from '../storage-type';

export default class IndexedDBStorage extends BaseStorage implements BrowserStorage.IBrowserStorage {
	private indexedDB: IDBFactory;

	constructor(indexedDB: IDBFactory) {
		super(StorageType.IndexedDB);

		this.indexedDB = indexedDB;
	}

	public get<V extends Object | number | string>(key: string | Array<string>): Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>> {
		return new Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>>(
			(resolve: (value?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void,
				reject: (reason?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void) => {

			});
	}

	public set<V extends Object | number | string>(data: BrowserStorage.KeyValue<V> | Array<BrowserStorage.KeyValue<V>>): Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>> {
		return new Promise<BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>>(
			(resolve: (value?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void,
				reject: (reason?: BrowserStorage.KeyValueOrError<V> | Array<BrowserStorage.KeyValueOrError<V>>) => void) => {

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