declare namespace BrowserStorage {
	export interface IBrowserStorage {
		// get
		public get<V extends Object | number | string>(key: string | Array<string>): Promise<KeyValue<V> | Array<KeyValue<V>>>;
		
		// set
		public set<V extends Object | number | string>(data: KeyValue<V> | Array<KeyValue<V>>): Promise<KeyValue<V> | Array<KeyValue<V>>>;

		// count
		public count(): Promise<number>;

		// delete
		public remove(key: string | Array<string>): Promise<string | Array<string>>;
		public clear(): Promise<void>;
	}

	export interface Error {
		key: string;
		error: string;
	}

	export interface KeyValue<V> {
		key: string;
		value: V;
	}
}