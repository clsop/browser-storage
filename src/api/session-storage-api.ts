import ApiObject from './api-object';

import { StorageType } from '../storage-type';
import KeyValueStorage from '../storage/keyvalue-storage';
import CookieStorageApi from './cookie-storage-api';
import BrowserStorage from '../../typings/browser-storage';

export default class SessionStorageApi extends ApiObject {
	constructor() {
		super(new CookieStorageApi());
	}

	public use(): BrowserStorage.IBrowserStorage {
		if ("sessionStorage" in window &&
			"setItem" in window.sessionStorage &&
			"getItem" in window.sessionStorage &&
			"removeItem" in window.sessionStorage &&
			"clear" in window.sessionStorage) {
			return new KeyValueStorage(window.sessionStorage, StorageType.Session);
		}

		return this.nextApi.use();
	}
}