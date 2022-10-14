declare namespace BrowserStorage {
	type SameSite  = "lax" | "strict" | "none";
	type Storage = IBrowserStorage | ICookieStorage;

	class BrowserStorageFactory {
		public static getStorage(type?: StorageType): Storage;
	}

	interface IBaseBrowserStorage {
		// get
		get<V extends Object | number | string>(key: string | Array<string>): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;

		// count
		count(): Promise<ValueOrError<number>>;

		// delete
		remove(key: string | Array<string>): Promise<KeyValueOrError<void> | Array<KeyValueOrError<void>>>;
		clear(): Promise<ValueOrError<void>>;
	}

	interface IBrowserStorage extends IBaseBrowserStorage {
		// set
		set<V extends Object | number | string>(data: KeyValue<V> | Array<KeyValue<V>>): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;
	}

	interface ICookieStorage extends IBaseBrowserStorage {
		// set
		set<V extends Object | number | string, ICookieOptions>(data: KeyValue<V> | Array<KeyValue<V>>, options?: ICookieOptions): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;
	}

	interface IApiOptions<T> {
		create(value: T): string;
	}

	interface ICookieOptions {
		path?: string;
		domain?: string;
		maxAge?: number;
		expires?: Date;
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