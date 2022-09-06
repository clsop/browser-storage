declare namespace BrowserStorage {
	class BrowserStorageFactory {
		public static getStorage(type?: StorageType): IBrowserStorage;
	}

	interface IBrowserStorage {
		// get
		get<V extends Object | number | string>(key: string | Array<string>): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;

		// set
		set<V extends Object | number | string>(data: KeyValue<V> | Array<KeyValue<V>>): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;

		// count
		count(): Promise<ValueOrError<number>>;

		// delete
		remove(key: string | Array<string>): Promise<KeyValueOrError<void> | Array<KeyValueOrError<void>>>;
		clear(): Promise<ValueOrError<void>>;
	}

	enum StorageType {
		Cookie = 0,
		Local,
		Session,
		IndexedDB
	}

	interface KeyValue<V> {
		key: string;
		value: V;
	}

	interface KeyValueOrError<V> {
		key: string;
		value?: V;
		error?: string;
	}

	interface ValueOrError<V> {
		value?: V;
		error?: string;
	}
}

export default BrowserStorage;