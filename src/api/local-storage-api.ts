import ApiObject from './api-object';

import CookieStorageApi from './cookie-storage-api';
import KeyValueStorage from '../keyvalue-storage';

export default class LocalStorageApi extends ApiObject {
	constructor() {
		super(new CookieStorageApi());
	}

	public use(): BrowserStorage.IBrowserStorage {
		if (localStorage !== undefined &&
			"setItem" in localStorage &&
			"getItem" in localStorage &&
			"removeItem" in localStorage &&
			"clear" in localStorage) {
			return new KeyValueStorage(localStorage);
		}

		return this.nextApi.use();
	}
}