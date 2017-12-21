import ApiObject from './api-object';

import { StorageType } from '../enums';
import KeyValueStorage from '../keyvalue-storage';
import CookieStorageApi from './cookie-storage-api';

export default class SessionStorageApi extends ApiObject {
	constructor() {
		super(new CookieStorageApi());
	}

	public use(): BrowserStorage.IBrowserStorage {
		if (window.sessionStorage !== undefined &&
			"setItem" in window.sessionStorage &&
			"getItem" in window.sessionStorage &&
			"removeItem" in window.sessionStorage &&
			"clear" in window.sessionStorage) {
			return new KeyValueStorage(window.sessionStorage, StorageType.Session);
		}

		return this.nextApi.use();
	}
}