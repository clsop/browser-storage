import ApiObject from './api-object';

import IndexedDBStorage from '../storage/indexeddb-storage';
import LocalStorageApi from './local-storage-api';
import BrowserStorage from '../../typings/browser-storage';

export default class SessionStorageApi extends ApiObject {
	constructor() {
		super(new LocalStorageApi());
	}

	public use(): BrowserStorage.IBrowserStorage {
		if ("indexedDB" in window) {
			return new IndexedDBStorage(window.indexedDB);
		}

		return this.nextApi.use();
	}
}