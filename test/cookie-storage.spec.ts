import 'should';
import * as sinon from 'sinon';
import { before, beforeEach, after, afterEach } from 'mocha';

import stubs from './stubs';
import { StorageType } from '../src/storage-type';
import { BrowserStorageFactory } from '../src/browser-storage-factory';
import KeyValueStorage from '../src/storage/keyvalue-storage';
import BrowserStorage from '../typings/browser-storage';

describe('Cookie storage', () => {
	const COOKIE_PART = "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";

	describe("cookie api tests", () => {
		before(() =>  {
			stubs.defineDocument();
		});

		after(() => {
			stubs.undefineDocument();
		});

		beforeEach(() => {
			stubs.defineCookie();
		});

		afterEach(() => {
			stubs.undefineCookie();
		});

		it("can get storage api", () => {
			// act
			let storage = BrowserStorageFactory.getStorage(StorageType.Cookie);

			// assert
			storage.should.not.be.null();
		});
	});

	describe("cookie set tests", () => {
		let storage: BrowserStorage.IBrowserStorage;
		let cookieFakes: any;

		before(() => {
			stubs.defineDocument();
			cookieFakes = stubs.defineCookie();
			storage = BrowserStorageFactory.getStorage(StorageType.Cookie);
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
		});

		afterEach(() => {
			cookieFakes.getStub.resetHistory();
			cookieFakes.setSpy.resetHistory();
		});

		it("can set a simple value", (done: Mocha.Done) => {
			// arrange
			let key = 'key';
			let value = 'value';

			// act
			storage.set<string>({ key: key, value: value })
				.then((data: BrowserStorage.KeyValueOrError<string>) => {
				// assert
				cookieFakes.setSpy.calledOnce.should.be.true();
				cookieFakes.setSpy
					.calledWithExactly(`${data.key}=${JSON.stringify(data.value)}${COOKIE_PART}`)
					.should.be.true();

				done();
			});
		});

		it("can set a simple values", (done: Mocha.Done) => {
			// arrange
			let keys = ['key1', 'key2'];
			let values = ['value1', 'value2'];

			// act
			storage.set<string>([{ key: keys[0], value: values[0] }, { key: keys[1], value: values[1] }])
				.then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
				// assert
				cookieFakes.setSpy.calledTwice.should.be.true();
				cookieFakes.setSpy
					.calledWithExactly(`${data[0].key}=${JSON.stringify(data[0].value)}${COOKIE_PART}`)
					.should.be.true();
				cookieFakes.setSpy
					.calledWithExactly(`${data[1].key}=${JSON.stringify(data[1].value)}${COOKIE_PART}`)
					.should.be.true();

				done();
			});
		});

		it("can set a complex value", (done: Mocha.Done) => {
			// arrange
			let key = 'key';
			let value = { test: "test", num: 2, decimal: 23.45 };

			// act
			storage.set<{ test: string, num: number, decimal: number }>({ key: key, value: value })
				.then((data: BrowserStorage.KeyValueOrError<{ test: string, num: number, decimal: number }>) => {
				// assert
				cookieFakes.setSpy.calledOnce.should.be.true();
				cookieFakes.setSpy
					.calledWithExactly(`${key}=${JSON.stringify(value)}${COOKIE_PART}`)
					.should.be.true();

				done();
			});
		});

		it("can set complex values", (done: Mocha.Done) => {
			// arrange
			let data = [{
				key: "key1", value: { ping: { on: false, time: 2 }, clock: { hour: 1, minute: 22, sec: 55 } }
			}, {
				key: "key2", value: { ping: { on: true, time: 3 }, clock: { hour: 3, minute: 2, sec: 34 } }
			}];

			// act
			storage.set<{ ping: { on: boolean, time: number }, clock: { hour: number, minute: number, sec: number } }>(data)
				.then((setData: Array<BrowserStorage.KeyValueOrError<{ ping: { on: boolean, time: number }, clock: { hour: number, minute: number, sec: number } }>>) => {
					// assert
					cookieFakes.setSpy.calledTwice.should.be.true();
					cookieFakes.setSpy
						.calledWithExactly(`${data[0].key}=${JSON.stringify(data[0].value)}${COOKIE_PART}`)
						.should.be.true();
					cookieFakes.setSpy
						.calledWithExactly(`${data[1].key}=${JSON.stringify(data[1].value)}${COOKIE_PART}`)
						.should.be.true();
					done();
				});
		});

		it.skip("will fail to set a value");

		it.skip("will fail to set some values");
	});

	describe("cookie get tests", () => {
		let storage: BrowserStorage.IBrowserStorage;

		before(() => {
			stubs.defineDocument();
			stubs.defineCookie();
			storage = BrowserStorageFactory.getStorage(StorageType.Cookie);
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
		});

		it.skip("can get a simple value");

		it.skip("can get simple values");

		it.skip("can get a complex value");

		it.skip("can get complex values");

		it.skip("will fail to get a value");

		it.skip("will fail to get some values");
	});

	describe("cookie remove tests", () => {
		let storage: BrowserStorage.IBrowserStorage;

		before(() => {
			stubs.defineDocument();
			stubs.defineCookie();
			storage = BrowserStorageFactory.getStorage(StorageType.Cookie);
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
		});

		it.skip("can remove a value");

		it.skip("can remove some values");

		it.skip("will fail to remove value");

		it.skip("will fail to remove values");
	});

	describe("cookie clear tests", () => {
		let storage: BrowserStorage.IBrowserStorage;

		before(() => {
			stubs.defineDocument();
			stubs.defineCookie();
			storage = BrowserStorageFactory.getStorage(StorageType.Cookie);
		});

		after(() => {
			stubs.undefineCookie();
			stubs.undefineDocument();
		});

		it.skip("can clear the storage");

		it.skip("will fail to clear the storage");
	});
});