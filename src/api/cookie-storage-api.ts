import ApiObject from './api-object';

import CookieStorage from '../cookie-storage';

export default class CookieStorageApi extends ApiObject {
	constructor() {
		super(null);
	}

	public use(): BrowserStorage.IBrowserStorage {
		if (document.cookie !== undefined) {
			return new CookieStorage();
		}

		throw "no browser storage api available!";
	}
}