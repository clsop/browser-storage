import 'should';
import * as sinon from 'sinon';
import { suite, test } from 'mocha-typescript';

import stubs from './stubs';
import { StorageType } from '../src/storage-type';
import { BrowserStorage } from '../src/browser-storage';
import KeyValueStorage from '../src/storage/keyvalue-storage';

describe('Cookie storage', () => {
	const COOKIE_PART = "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";

	@suite("cookie api tests")
	class CookieApiTests {
		public static before() {
			stubs.defineDocument();
		}

		public static after() {
			stubs.undefineDocument();
		}

		public before() {
			stubs.defineCookie();
		}

		public after() {
			stubs.undefineCookie();
		}

		@test("can get storage api")
		public canGetApi() {
			// act
			let storage = BrowserStorage.getStorage(StorageType.Cookie);

			// assert
			storage.should.not.be.null();
		}
	}

	@suite("cookie set tests")
	class CookieSetTests {
		private static storage: BrowserStorage.IBrowserStorage;
		private static cookieFakes: any;

		public static before() {
			stubs.defineDocument();
			CookieSetTests.cookieFakes = stubs.defineCookie();
			CookieSetTests.storage = BrowserStorage.getStorage(StorageType.Cookie);
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
		}

		public after() {
			CookieSetTests.cookieFakes.getStub.resetHistory();
			CookieSetTests.cookieFakes.setSpy.resetHistory();
		}

		@test("can set a simple value")
		public canSetValue(done: MochaDone) {
			// arrange
			let key = 'key';
			let value = 'value';

			// act
			CookieSetTests.storage.set<string>({ key: key, value: value })
				.then((data: BrowserStorage.KeyValueOrError<string>) => {
				// assert
				CookieSetTests.cookieFakes.setSpy.calledOnce.should.be.true();
				CookieSetTests.cookieFakes.setSpy
					.calledWithExactly(`${data.key}=${JSON.stringify(data.value)}${COOKIE_PART}`)
					.should.be.true();

				done();
			});
		}

		@test("can set a simple values")
		public canSetValues(done: MochaDone) {
			// arrange
			let keys = ['key1', 'key2'];
			let values = ['value1', 'value2'];

			// act
			CookieSetTests.storage.set<string>([{ key: keys[0], value: values[0] }, { key: keys[1], value: values[1] }])
				.then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
				// assert
				CookieSetTests.cookieFakes.setSpy.calledTwice.should.be.true();
				CookieSetTests.cookieFakes.setSpy
					.calledWithExactly(`${data[0].key}=${JSON.stringify(data[0].value)}${COOKIE_PART}`)
					.should.be.true();
				CookieSetTests.cookieFakes.setSpy
					.calledWithExactly(`${data[1].key}=${JSON.stringify(data[1].value)}${COOKIE_PART}`)
					.should.be.true();

				done();
			});
		}

		@test("can set a complex value")
		public canSetComplexValue(done: MochaDone) {
			// arrange
			let key = 'key';
			let value = { test: "test", num: 2, decimal: 23.45 };

			// act
			CookieSetTests.storage.set<{ test: string, num: number, decimal: number }>({ key: key, value: value })
				.then((data: BrowserStorage.KeyValueOrError<{ test: string, num: number, decimal: number }>) => {
				// assert
				CookieSetTests.cookieFakes.setSpy.calledOnce.should.be.true();
				CookieSetTests.cookieFakes.setSpy
					.calledWithExactly(`${key}=${JSON.stringify(value)}${COOKIE_PART}`)
					.should.be.true();

				done();
			});
		}

		@test("can set complex values")
		public canSetComplexValues(done: MochaDone) {
			// arrange
			let data = [{
				key: "key1", value: { ping: { on: false, time: 2 }, clock: { hour: 1, minute: 22, sec: 55 } }
			}, {
				key: "key2", value: { ping: { on: true, time: 3 }, clock: { hour: 3, minute: 2, sec: 34 } }
			}];

			// act
			CookieSetTests.storage.set<{ ping: { on: boolean, time: number }, clock: { hour: number, minute: number, sec: number } }>(data)
				.then((setData: Array<BrowserStorage.KeyValueOrError<{ ping: { on: boolean, time: number }, clock: { hour: number, minute: number, sec: number } }>>) => {
					// assert
					CookieSetTests.cookieFakes.setSpy.calledTwice.should.be.true();
					CookieSetTests.cookieFakes.setSpy
						.calledWithExactly(`${data[0].key}=${JSON.stringify(data[0].value)}${COOKIE_PART}`)
						.should.be.true();
					CookieSetTests.cookieFakes.setSpy
						.calledWithExactly(`${data[1].key}=${JSON.stringify(data[1].value)}${COOKIE_PART}`)
						.should.be.true();
					done();
				});
		}

		//@test("will fail to set a value")
		@test.skip()
		public willFailSetValue(done: MochaDone) {
		}

		//@test("will fail to set some values")
		@test.skip()
		public willFailSetValues(done: MochaDone) {
		}
	}

	@suite("cookie get tests")
	class CookieGetTests {
		private static storage: BrowserStorage.IBrowserStorage;

		public static before() {
			stubs.defineDocument();
			stubs.defineCookie();
			CookieGetTests.storage = BrowserStorage.getStorage(StorageType.Cookie);
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
		}

		public before() {
		}

		public after() {
		}

		//@test("can get a simple value")
		@test.skip()
		public canGetValue(done: MochaDone) {
		}

		//@test("can get simple values")
		@test.skip()
		public canGetValues(done: MochaDone) {
		}

		//@test("can get a complex value")
		@test.skip()
		public canGetComplexValue(done: MochaDone) {
		}

		//@test("can get complex values")
		@test.skip()
		public canGetComplexValues(done: MochaDone) {
		}

		//@test("will fail to get a value")
		@test.skip()
		public willFailGetValue(done: MochaDone) {
		}

		//@test("will fail to get some values")
		@test.skip()
		public willFailGetComplexValues(done: MochaDone) {
		}
	}

	@suite("cookie remove tests")
	class CookieRemoveTests {
		private static storage: BrowserStorage.IBrowserStorage;

		public static before() {
			stubs.defineDocument();
			stubs.defineCookie();
			CookieRemoveTests.storage = BrowserStorage.getStorage(StorageType.Cookie);
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
		}

		//@test("can remove a value")
		@test.skip()
		public canRemoveValue(done: MochaDone) {
		}

		//@test("can remove some values")
		@test.skip()
		public canRemoveValues(done: MochaDone) {
		}

		//@test("will fail to remove value")
		@test.skip()
		public willFailRemoveValue(done: MochaDone) {
		}

		//@test("will fail to remove values")
		@test.skip()
		public willFailRemoveValues(done: MochaDone) {
		}
	}

	@suite("cookie clear tests")
	class CookieClearTests {
		private static storage: BrowserStorage.IBrowserStorage;

		public static before() {
			stubs.defineDocument();
			stubs.defineCookie();
			CookieClearTests.storage = BrowserStorage.getStorage(StorageType.Cookie);
		}

		public static after() {
			stubs.undefineCookie();
			stubs.undefineDocument();
		}

		//@test("can clear the storage")
		@test.skip()
		public canClear(done: MochaDone) {
		}

		//@test("will fail to clear the storage")
		@test.skip()
		public willFailClear(done: MochaDone) {
		}
	}
});