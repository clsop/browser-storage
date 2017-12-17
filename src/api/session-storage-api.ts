import ApiObject from './api-object';

import KeyValueStorage from '../keyvalue-storage';
import CookieStorageApi from './cookie-storage-api';

export default class SessionStorageApi extends ApiObject {
	constructor() {
		super(new CookieStorageApi());
	}

	public use(): BrowserStorage.IBrowserStorage {
		if (sessionStorage !== undefined &&
			"setItem" in sessionStorage &&
			"getItem" in sessionStorage &&
			"removeItem" in sessionStorage &&
			"clear" in sessionStorage) {
			return new KeyValueStorage(sessionStorage);
		}

		return this.nextApi.use();
	}
}