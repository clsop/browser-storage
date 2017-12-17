import ApiObject from './api-object';

import IndexedDBStorage from '../indexeddb-storage';
import LocalStorageApi from './local-storage-api';

export default class SessionStorageApi extends ApiObject {
	constructor() {
		super(new LocalStorageApi());
	}

	public use(): BrowserStorage.IBrowserStorage {
		if (indexedDB !== undefined) {
			return new IndexedDBStorage(indexedDB);
		}

		return this.nextApi.use();
	}
}