import { describe, it, before, beforeEach, afterEach } from 'mocha';
import * as should from 'should';
import * as sinon from 'sinon';

import { StorageType } from '../src/enums';
import BrowserStorage from '../src/browser-storage';
import KeyValueStorage from '../src/keyvalue-storage';

describe('Cookie storage', () => {
	let storage: BrowserStorage.IBrowserStorage;
	let api: Test.Cookie;
	const COOKIE_PART = "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";

	before(() => {
		Object.defineProperty(global, "document", {
			value: Object.create(null),
			configurable: false,
			writable: true,
			enumerable: true
		});
		Object.defineProperty(document, "cookie", (() => {
			let cookies: string[] = [];

			this.get = () => cookies.join("\r");
			this.set = (value: string) => cookies.push(value);
			this.configurable = false;
    		this.enumerable = true;

			api = {
				get: sinon.stub(this, 'get'),
				set: sinon.spy(this, 'set')
			};
			api.get.returns('');

			return this;
		})());
		storage = BrowserStorage.getStorage(StorageType.Cookie);
	});

	beforeEach(() => {
		api.get.resetHistory();
		api.set.reset();
	});

	it('can get storage api', () => {
		// act
		let storage = BrowserStorage.getStorage(StorageType.Cookie);

		// assert
		storage.should.not.be.null();
	});

	it('can set a simple value', (done) => {
		// arrange
		let key = 'key';
		let value = 'value';
		api.get.returns(`${key}=${value}`);

		storage.set<string>({ key: key, value: value }).then((data: BrowserStorage.KeyValueOrError<string>) => {
			// assert
 			api.set.calledOnce.should.be.true();
			api.set.calledWith(`${data.key}=${JSON.stringify(data.value)}${COOKIE_PART}`).should.be.true();

			done();
		});
	});

	it('can set simple values', (done) => {
		// arrange
		let keys = ['key1', 'key2'];
		let values = ['value1', 'value2'];
		api.get.returns(`${keys[0]}=${values[0]}`);

		storage.set<string>([{ key: keys[0], value: values[0] }, { key: keys[1], value: values[1] }]).then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
			// assert
 			api.set.calledTwice.should.be.true();
			api.set.calledWith(`${data[0].key}=${JSON.stringify(data[0].value)}${COOKIE_PART}`).should.be.true();
			api.set.calledWith(`${data[1].key}=${JSON.stringify(data[1].value)}${COOKIE_PART}`).should.be.true();

			done();
		});
	});

	it('can set a complex value');

	it('can set complex values');

	it('will fail to set a value');

	it('will fail to set some values');

	it('can get a simple value');

	it('can get simple values');

	it('can get a complex value');

	it('can get complex values');

	it('will fail to get a value');

	it('will fail to get some values');

	it('can remove a value');

	it('will fail to remove values');

	it('can clear the storage');

	it('will fail to clear the storage');
});