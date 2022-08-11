import 'should';
import { describe, before, after } from 'mocha';

import stubs from './stubs';
import { BrowserStorage } from '../src/browser-storage';
import CookieStorage from '../src/storage/cookie-storage';
import KeyValueStorage from '../src/storage/keyvalue-storage';
import IndexedDbStorage from '../src/storage/indexeddb-storage';

import { StorageType } from '../src/storage-type';

describe('Api fallbacks', () => {
	describe("local storage api tests", () => {
		before(() => {
			stubs.defineWindow();
			stubs.defineDocument();
			stubs.defineCookie();
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
			stubs.undefineWindow();
		});

		it("localStorage fallback to cookie", () => {
			// act
			let storage = BrowserStorage.getStorage(StorageType.Local);

			// assert
			storage.should.be.instanceof(CookieStorage);
		});
	});

	describe("session storage api tests", () => {
		before(() => {
			stubs.defineWindow();
			stubs.defineDocument();
			stubs.defineCookie();
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
			stubs.undefineWindow();
		});

		it("sessionStorage fallback to cookie", () => {
			// act
			let storage = BrowserStorage.getStorage(StorageType.Session);

			// assert
			storage.should.be.instanceof(CookieStorage);
		});
	});

	describe("indexedDb storage api tests", () => {
		before(() => {
			stubs.defineWindow();
			stubs.defineDocument();
			stubs.defineStorage();
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
			stubs.undefineStorage();
		});

		// @test("indexedDb fallback to localStorage")
		// public IndexDbStorageToLocalStorage() {
		// 	// act
		// 	let storage = BrowserStorage.getStorage(StorageType.IndexedDB);

		// 	// assert
		// 	// TODO: check keyvaluestorage type
		// 	storage.should.be.instanceof(KeyValueStorage);
		// }
	});

	describe("cookie storage api tests", () => {
		before(() => {
			stubs.defineWindow();
			stubs.defineDocument();
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
		});

		it("cookie fallback to error", () => {
			// arrange
			let expectation = () => {
				BrowserStorage.getStorage(StorageType.Cookie);
			};

			// act, assert
			expectation.should.throw(Error);
		});
	});
});