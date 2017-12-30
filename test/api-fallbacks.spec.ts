import { describe, it, before } from 'mocha';
import * as sinon from 'sinon';

import BrowserStorage from '../src/browser-storage';
import CookieStorage from '../src/cookie-storage';
import KeyValueStorage from '../src/keyvalue-storage';

import { StorageType } from '../src/enums';

describe('Api fallbacks', () => {
	let defineCookie = () => {
		Object.defineProperty(document, 'cookie', {
			value: "",
			configurable: true
		});
	};
	let defineLocal = () => {
		Object.defineProperty(global.window, 'localStorage', {
			value: Object.create(null),
			configurable: true,
			enumerable: true,
			writable: true
		});
		Object.defineProperties(global.window.localStorage, {
			'getItem': {
				value: () => { },
				configurable: true,
				enumerable: true,
				writable: false
			},
			'setItem': {
				value: () => { },
				configurable: true,
				enumerable: true,
				writable: false
			},
			'removeItem': {
				value: () => { },
				configurable: true,
				enumerable: true,
				writable: false
			},
			'clear': {
				value: () => { },
				configurable: true,
				enumerable: true,
				writable: false
			}
		});
	};

	let removeCookie = () => {
		delete global.document.cookie;
	};
	let removeLocal = () => {
		delete global.window.localStorage;
	};

	before(() => {
		Object.defineProperty(global, 'window', {
			value: Object.create(null),
			configurable: false,
			enumerable: true,
			writable: false
		});
		Object.defineProperty(global, 'document', {
			value: Object.create(null),
			configurable: true,
			enumerable: true,
			writable: true
		});
	});

	it('localStorage to cookie', () => {
		// arrange
		defineCookie();

		// act
		let storage = BrowserStorage.getStorage(StorageType.Local);

		// assert
		storage.should.be.instanceof(CookieStorage);

		removeCookie();
	});

	it('sessionStorage to cookie', () => {
		// arrange
		defineCookie();

		// act
		let storage = BrowserStorage.getStorage(StorageType.Session);

		// assert
		storage.should.be.instanceof(CookieStorage);

		removeCookie();
	});

	it('indexedDB to localStorage', () => {
		// arrange
		defineLocal();

		// act
		let storage = BrowserStorage.getStorage(StorageType.IndexedDB);

		// assert
		// TODO: check keyvaluestorage type
		storage.should.be.instanceof(KeyValueStorage);

		removeLocal();
	});

	it('cookie to none', () => {
		// act, assert
		should.throws(() => {
			BrowserStorage.getStorage(StorageType.Cookie);
		});
	});
});