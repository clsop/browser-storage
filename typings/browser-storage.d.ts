declare namespace BrowserStorage {
	export interface IBrowserStorage {
		// get
		public get<V extends Object | number | string>(key: string | Array<string>): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;
		
		// set
		public set<V extends Object | number | string>(data: KeyValue<V> | Array<KeyValue<V>>): Promise<KeyValueOrError<V> | Array<KeyValueOrError<V>>>;

		// count
		public count(): Promise<ValueOrError<number>>;

		// delete
		public remove(key: string | Array<string>): Promise<KeyValueOrError<void> | Array<KeyValueOrError<void>>>;
		public clear(): Promise<ValueOrError<void>>;
	}

	export interface KeyValue<V> {
		key: string;
		value: V;
	}

	export interface KeyValueOrError<V> {
		key: string;
		value?: V;
		error?: string;
	}

	export interface ValueOrError<V> {
		value?: V;
		error?: string;
	}
}