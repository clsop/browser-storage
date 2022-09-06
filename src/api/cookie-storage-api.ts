import ApiObject from './api-object';
import BrowserApiError from '../exceptions/browser-api-error';

import CookieStorage from '../storage/cookie-storage';
import BrowserStorage from '../../typings/browser-storage';

export default class CookieStorageApi extends ApiObject {
	constructor() {
		super(null);
	}

	public use(): BrowserStorage.IBrowserStorage {
		if ("cookie" in document) {
			return new CookieStorage();
		}

		throw new BrowserApiError("no browser storage api available!");
	}
}