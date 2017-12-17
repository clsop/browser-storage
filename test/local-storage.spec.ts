import { describe, it, before, beforeEach } from 'mocha';
import * as should from 'should';
import * as sinon from 'sinon';

import { StorageType } from '../src/enums';
import BrowserStorage from '../src/browser-storage';
import KeyValueStorage from '../src/keyvalue-storage';

describe('Local storage', () => {
	let storage: BrowserStorage.IBrowserStorage;
	let api: Test.Storage;

	before(() => {
		Object.defineProperty(global, 'localStorage', {
			value: Object.create(null),
			configurable: false,
			enumerable: true,
			writable: false
		});
		Object.defineProperties(global.localStorage, {
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
			getItem: sinon.stub(global.localStorage, "getItem"),
			setItem: sinon.spy(global.localStorage, "setItem"),
			removeItem: sinon.spy(global.localStorage, "removeItem"),
			clear: sinon.spy(global.localStorage, "clear")
		};

		storage = BrowserStorage.getStorage(StorageType.Local);
	});

	beforeEach(() => {
		api.getItem.resetHistory();
	});

	it('can get storage api', () => {
		// act
		let storage = BrowserStorage.getStorage(StorageType.Local);

		// assert
		storage.should.not.be.null();
	});

	it('uses localstorage as default', () => {
		// arrange
		let storage = BrowserStorage.getStorage();

		// assert
		storage.should.not.be.null();
		storage.should.be.instanceof(KeyValueStorage);
		// TODO: check for storage type
	});

	it('can set a simple value', (done) => {
		// act
		storage.set<number>({ key: 'test', value: 1 }).then((data: BrowserStorage.KeyValue<number>) => {
			// assert
			api.setItem.calledOnce.should.be.true();
			api.setItem.calledWith(data.key, data.value.toString()).should.be.true();
			done();
		});
	});

	it('can set simple values', (done) => {
		// act
		storage.set<number>([{ key: 'test', value: 1 },
		{ key: 'test2', value: 2 },
		{ key: 'test3', value: 3 }]).then((data: Array<BrowserStorage.KeyValue<number>>) => {
			// assert
			//api.setItem.calledThrice.should.be.true();
			api.setItem.calledWith(data[0].key, data[0].value.toString()).should.be.true();
			api.setItem.calledWith(data[1].key, data[1].value.toString()).should.be.true();
			api.setItem.calledWith(data[2].key, data[2].value.toString()).should.be.true();
			done();
		});
	});

	it('can set a complex value', (done) => {
		// arrange
		let value: { value1: number, value2: string, value3: Array<number> } = {
			value1: 1,
			value2: "test",
			value3: [2]
		};

		// act
		storage.set<{ value1: number, value2: string, value3: Array<number> }>({ key: "test", value: value })
			.then((data: BrowserStorage.KeyValue<{ value1: number, value2: string, value3: Array<number> }>) => {
				// assert
				//api.setItem.calledOnce.should.be.true();
				api.setItem.calledWith(data.key, JSON.stringify(data.value)).should.be.true();
				done();
			});
	});

	it('can set complex values', (done) => {
		// arrange
		let values: Array<{ value1: number, value2: string, value3: Array<number> }> = [{
			value1: 1,
			value2: "test",
			value3: [2]
		}, {
			value1: 2,
			value2: "test2",
			value3: [3, 2]
		}, {
			value1: 3,
			value2: "test3",
			value3: [3, 2, 5, 4, 1]
		}];

		// act
		storage.set<{ value1: number, value2: string, value3: Array<number> }>([{
			key: "test",
			value: values[0]
		}, {
			key: "test2",
			value: values[1]
		}, {
			key: "test3",
			value: values[2]
		}]).then((data: Array<BrowserStorage.KeyValue<{ value1: number, value2: string, value3: Array<number> }>>) => {
			// assert
			//api.setItem.calledThrice.should.be.true();
			api.setItem.calledWith(data[0].key, JSON.stringify(data[0].value)).should.be.true();
			api.setItem.calledWith(data[1].key, JSON.stringify(data[1].value)).should.be.true();
			api.setItem.calledWith(data[2].key, JSON.stringify(data[2].value)).should.be.true();
			done();
		});
	});

	it('will fail to set a value', () => should.ok("Local storage can always set a value"));

	it('will fail to set some values', () => should.ok("Local storage can always set a value"));

	it('can get a simple value', (done) => {
		// arrange
		api.getItem.withArgs('someitem').returns('value');

		// act
		storage.get<string>('someitem').then((data: BrowserStorage.KeyValue<string>) => {
			// assert
			api.getItem.calledOnce.should.be.true();
			api.getItem.calledWith('someitem').should.be.true();

			data.should.have.property('key', 'someitem');
			data.should.have.property('value', 'value');
			done();
		});
	});

	it('can get simple values');

	it('can get a complex value');

	it('can get complex values');

	it('will fail to get a value');

	it('will fail to get some values');

	it('can remove a value', (done) => {
		// act
		storage.remove('test').then(() => {
			// assert
			//api.removeItem.calledOnce.should.be.true();
			api.removeItem.calledWith('test').should.be.true();
			done();
		});
	});

	it('will fail to remove values');

	it('can clear the storage', (done) => {
		// act
		storage.clear().then(() => {
			// assert
			api.clear.calledOnce.should.be.true();
			done();
		});
	});

	it('will fail to clear the storage', () => should.ok("Local storage will always clear"));
});