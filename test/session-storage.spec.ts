import { describe, it, before, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as should from 'should';

import { StorageType } from '../src/enums';
import BrowserStorage from '../src/browser-storage';
import KeyValueStorage from '../src/keyvalue-storage';

describe('Session storage', () => {
	let storage: BrowserStorage.IBrowserStorage;
	let api: Test.Storage;

	before(() => {
		Object.defineProperty(global, 'sessionStorage', {
			value: Object.create(null),
			configurable: false,
			enumerable: true,
			writable: false
		});
		Object.defineProperties(global.sessionStorage, {
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

		api = {
			getItem: sinon.stub(global.sessionStorage, "getItem"),
			setItem: sinon.spy(global.sessionStorage, "setItem"),
			removeItem: sinon.spy(global.sessionStorage, "removeItem"),
			clear: sinon.spy(global.sessionStorage, "clear")
		};

		storage = BrowserStorage.getStorage(StorageType.Session);
	});

	it('can get storage api', () => {
		// act
		let storage = BrowserStorage.getStorage(StorageType.Session);

		// assert
		storage.should.not.be.null();
	});

	it('can set a simple value');

	it('can set simple values');

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