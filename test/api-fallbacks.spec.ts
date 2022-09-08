import 'should';
import { suite, test } from '@testdeck/mocha';

import stubs from './stubs';
import { BrowserStorageFactory } from '../src/browser-storage-factory';
import CookieStorage from '../src/storage/cookie-storage';
import KeyValueStorage from '../src/storage/keyvalue-storage';
import IndexedDbStorage from '../src/storage/indexeddb-storage';

import { StorageType } from '../src/storage-type';

@suite("Api fallbacks: local storage api tests")
class LocalStorageApiTests {
	public before() {
		stubs.defineWindow();
		stubs.defineDocument();
		stubs.defineCookie();
	}

	public after() {
		stubs.undefineCookie();
		stubs.undefineDocument();
		stubs.undefineWindow();
	}

	@test("localStorage fallback to cookie")
	public fallbackToCookieTest() {
		// act
		let storage = BrowserStorageFactory.getStorage(StorageType.Local);

		// assert
		storage.should.be.instanceof(CookieStorage);
	}
}

@suite("Api fallbacks: session storage api tests")
class SessionStorageApiTests {
	public before() {
		stubs.defineWindow();
		stubs.defineDocument();
		stubs.defineCookie();
	}

	public after() {
		stubs.undefineCookie();
		stubs.undefineDocument();
		stubs.undefineWindow();
	}

	@test("sessionStorage fallback to cookie")
	public fallbackToCookieTest() {
		// act
		let storage = BrowserStorageFactory.getStorage(StorageType.Session);

		// assert
		storage.should.be.instanceof(CookieStorage);
	}
}

@suite("Api fallbacks: cookie storage api tests")
class CookieStorageApiTests {
	public before() {
		stubs.defineWindow();
		stubs.defineDocument();
	}

	public after() {
		stubs.undefineDocument();
		stubs.undefineWindow();
	}

	@test("cookie fallback to error")
	public fallbackToErrorTest() {
		// arrange
		let expectation = () => {
			BrowserStorageFactory.getStorage(StorageType.Cookie);
		};

		// act, assert
		expectation.should.throw(Error);
	}
}

@suite("Api fallbacks: indexedDb api tests")
class IndexedDBApiTests {
	public before() {
		stubs.defineWindow();
		stubs.defineDocument();
		stubs.defineStorage();
	}

	public after() {
		stubs.undefineDocument();
		stubs.undefineStorage();
		stubs.undefineWindow();
	}

	@test.pending("indexedDb fallback to localStorage")
	public fallbackToLocalStorageTest() {
		// act
		let storage = BrowserStorageFactory.getStorage(StorageType.IndexedDB);

		// assert
		// TODO: check keyvaluestorage type
		storage.should.be.instanceof(KeyValueStorage);
	}
}