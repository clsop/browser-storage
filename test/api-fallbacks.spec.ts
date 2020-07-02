import 'should';
import { describe } from 'mocha';
import { suite, test } from 'mocha-typescript';

import stubs from './stubs';
import { BrowserStorage } from '../src/browser-storage';
import CookieStorage from '../src/storage/cookie-storage';
import KeyValueStorage from '../src/storage/keyvalue-storage';
import IndexedDbStorage from '../src/storage/indexeddb-storage';

import { StorageType } from '../src/storage-type';

describe('Api fallbacks', () => {
	@suite("local storage api tests")
	class LocalStorageApiTests {
		public static before() {
			stubs.defineWindow();
			stubs.defineDocument();
			stubs.defineCookie();
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
			stubs.undefineWindow();
		}

		@test("localStorage fallback to cookie")
		public localStorageToCookie() {
			// act
			let storage = BrowserStorage.getStorage(StorageType.Local);

			// assert
			storage.should.be.instanceof(CookieStorage);
		}
	}

	@suite("session storage api tests")
	class SessionStorageApiTests {
		public static before() {
			stubs.defineWindow();
			stubs.defineDocument();
			stubs.defineCookie();
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
			stubs.undefineWindow();
		}

		@test("sessionStorage fallback to cookie")
		public sessionStorageToCookie() {
			// act
			let storage = BrowserStorage.getStorage(StorageType.Session);

			// assert
			storage.should.be.instanceof(CookieStorage);
		}
	}

	@suite("indexedDb storage api tests")
	class IndexedDbStorageApiTests {
		public static before() {
			stubs.defineWindow();
			stubs.defineDocument();
			stubs.defineStorage();
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
			stubs.undefineStorage();
		}

		// @test("indexedDb fallback to localStorage")
		// public IndexDbStorageToLocalStorage() {
		// 	// act
		// 	let storage = BrowserStorage.getStorage(StorageType.IndexedDB);

		// 	// assert
		// 	// TODO: check keyvaluestorage type
		// 	storage.should.be.instanceof(KeyValueStorage);
		// }
	}

	@suite("cookie storage api tests")
	class CookieStorageApiTests {
		public static before() {
			stubs.defineWindow();
			stubs.defineDocument();
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
		}

		@test("cookie fallback to error")
		public CookieStorageToError() {
			// arrange
			let expectation = () => {
				BrowserStorage.getStorage(StorageType.Cookie);
			};

			// act, assert
			expectation.should.throw(Error);
		}
	}
});