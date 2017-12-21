import ApiObject from './api-object';

import { StorageType } from '../enums';
import CookieStorageApi from './cookie-storage-api';
import KeyValueStorage from '../keyvalue-storage';

export default class LocalStorageApi extends ApiObject {
	constructor() {
		super(new CookieStorageApi());
	}

	public use(): BrowserStorage.IBrowserStorage {
		if (window.localStorage !== undefined &&
			"setItem" in window.localStorage &&
			"getItem" in window.localStorage &&
			"removeItem" in window.localStorage &&
			"clear" in window.localStorage) {
			return new KeyValueStorage(window.localStorage, StorageType.Local);
		}

		return this.nextApi.use();
	}
}