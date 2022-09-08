declare namespace BrowserStorage {
	type SameSite  = "lax" | "strict" | "none";

	class BrowserStorageFactory {
		public static getStorage(type?: StorageType): IBrowserStorage;
	}

	interface IBrowserStorage {
		// get
		get<V extends Object | number | string>(key: string | Array<string>): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;

		// set
		set<V extends Object | number | string, O extends IOptions>(data: KeyValue<V> | Array<KeyValue<V>>, options?: O): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;

		// count
		count(): Promise<ValueOrError<number>>;

		// delete
		remove(key: string | Array<string>): Promise<KeyValueOrError<void> | Array<KeyValueOrError<void>>>;
		clear(): Promise<ValueOrError<void>>;
	}

	interface IOptions {
	}

	interface ICookieOptions extends IOptions {
		path?: string;
		domain?: string;
		maxAge?: number;
		expires?: string;
		secure?: boolean;
		sameSite?: SameSite;
		persist?: boolean;
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