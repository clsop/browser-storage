import 'should';
import * as sinon from 'sinon';
import { before, beforeEach, after, afterEach } from 'mocha';
import { suite, test } from '@testdeck/mocha';

import stubs from './stubs';
import { StorageType } from '../src/storage-type';
import { BrowserStorageFactory } from '../src/browser-storage-factory';
import KeyValueStorage from '../src/storage/keyvalue-storage';
import BrowserStorage from '../typings/browser-storage';
import should from 'should';

const COOKIE_PART = "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
type TestObj = { test: string, num: number, decimal: number };
type CookieFakes = { getStub: sinon.SinonStub<[], any>, setStub: sinon.SinonStub<[v: any], void> };

@suite("Cookie storage: cookie api tests")
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
	public canGetApiTest() {
		// act
		let storage = BrowserStorageFactory.getStorage(StorageType.Cookie);

		// assert
		storage.should.not.be.null();
	}
}

@suite("Cookie storage: cookie set tests")
class CookieSetTests {
	private static storage: BrowserStorage.IBrowserStorage;
	private static cookieFakes: CookieFakes;

	public static before() {
		stubs.defineDocument();
		CookieSetTests.cookieFakes = stubs.defineCookie();
		CookieSetTests.storage = BrowserStorageFactory.getStorage(StorageType.Cookie);
	}

	public static after() {
		stubs.undefineCookie();
		stubs.undefineDocument();
	}

	public after() {
		CookieSetTests.cookieFakes.getStub.resetHistory();
		CookieSetTests.cookieFakes.setStub.resetHistory();
	}

	@test("can set a simple value")
	public async canSetSimpleValueTest(): Promise<any> {
		// arrange
		let key = 'key';
		let value = 'value';

		// act
		let data = await CookieSetTests.storage.set<string>({ key: key, value: value }) as BrowserStorage.KeyValueOrError<string>;

		// assert
		CookieSetTests.cookieFakes.setStub.calledOnce.should.be.true();
		CookieSetTests.cookieFakes.setStub.calledWithExactly(`${data.key}=${JSON.stringify(data.value)}${COOKIE_PART}`)
			.should.be.true();
	}

	@test("can set simple values")
	public async canSetSimpleValuesTest(): Promise<any> {
		// arrange
		let keys = ['key1', 'key2'];
		let values = ['value1', 'value2'];

		// act
		let data = await CookieSetTests.storage.set<string>([{ key: keys[0], value: values[0] }, { key: keys[1], value: values[1] }]) as Array<BrowserStorage.KeyValueOrError<string>>;
			
		// assert
		CookieSetTests.cookieFakes.setStub.calledTwice.should.be.true();
		CookieSetTests.cookieFakes.setStub
			.calledWithExactly(`${data[0].key}=${JSON.stringify(data[0].value)}${COOKIE_PART}`)
			.should.be.true();
		CookieSetTests.cookieFakes.setStub
			.calledWithExactly(`${data[1].key}=${JSON.stringify(data[1].value)}${COOKIE_PART}`)
			.should.be.true();
	}

	@test("can set a complex value")
	public async canSetComplexValueTest(): Promise<any> {
		// arrange
		let key = 'key';
		let value = { test: "test", num: 2, decimal: 23.45 };

		// act
		let data = await CookieSetTests.storage.set<TestObj>({ key: key, value: value }) as BrowserStorage.KeyValueOrError<TestObj>;

		// assert
		CookieSetTests.cookieFakes.setStub.calledOnce.should.be.true();
		CookieSetTests.cookieFakes.setStub
			.calledWithExactly(`${data.key}=${JSON.stringify(data.value)}${COOKIE_PART}`)
			.should.be.true();
	}

	@test("can set complex values")
	public async canSetComplexValues(): Promise<any> {
		// arrange
		let values: Array<{ key: string, value: TestObj }> = [{
			key: "key1", value: { test: "test", num: 2, decimal: 24.32 }
		}, {
			key: "key2", value: { test: "test2", num: 4, decimal: 46.23 }
		}];

		// act
		let data = await CookieSetTests.storage.set<TestObj>(values) as Array<BrowserStorage.KeyValueOrError<TestObj>>;
		
		// assert
		CookieSetTests.cookieFakes.setStub.calledTwice.should.be.true();
		CookieSetTests.cookieFakes.setStub
			.calledWithExactly(`${data[0].key}=${JSON.stringify(data[0].value)}${COOKIE_PART}`)
			.should.be.true();
		CookieSetTests.cookieFakes.setStub
			.calledWithExactly(`${data[1].key}=${JSON.stringify(data[1].value)}${COOKIE_PART}`)
			.should.be.true();
	}

	@test("will fail to set a value")
	public async willFailSetValue(): Promise<any> {
		// arrange
		const key = 'key';
		const value = 'value';
		const exception = { key: key, error: ""} as BrowserStorage.KeyValueOrError<string>;
		CookieSetTests.cookieFakes.setStub.throws(exception);

		// act
		try {
			let data = await CookieSetTests.storage.set<string>({ key: key, value: value }) as BrowserStorage.KeyValueOrError<string>;
			should(data).fail();
		} catch (error) {
			// assert
			CookieSetTests.cookieFakes.setStub.calledOnce.should.be.true();
			CookieSetTests.cookieFakes.setStub.threw(exception);
		}
	}

	@test.pending("will fail to set some values")
	public async willFailSetValues(): Promise<any> {
	}
}

describe('Cookie storage', () => {
	const COOKIE_PART = "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";

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
});