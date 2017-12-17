import { describe, it, before, beforeEach } from 'mocha';
import * as should from 'should';

import { StorageType } from '../src/enums';
import BrowserStorage from '../src/browser-storage';
import KeyValueStorage from '../src/keyvalue-storage';

describe('Cookie storage', () => {
	let storage: BrowserStorage.IBrowserStorage;

	before(() => {
		Object.defineProperty(global, 'document', {
			value: Object.create(null),
			configurable: false,
			enumerable: true,
			writable: true
		});
		Object.defineProperty(global.document, "cookie", (() => {
			let cookies: string[] = [];

			this.get = () => {
				return cookies.join("\r");
			};
			this.set = (value: string) => {
				cookies.push(value);
			};

			return this;
		})());

		storage = BrowserStorage.getStorage(StorageType.Cookie);
	});

	it('can get storage api', () => {
		// act
		let storage = BrowserStorage.getStorage(StorageType.Cookie);

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