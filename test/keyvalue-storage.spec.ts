import 'should';
import * as sinon from 'sinon';
import { describe } from 'mocha';

import stubs from './stubs';
import { StorageType } from '../src/storage-type';
import { BrowserStorage } from '../src/browser-storage';
import KeyValueStorage from '../src/storage/keyvalue-storage';

// session and local storage has similar api
describe('KeyValue storage (localStorage and sessionStorage)', () => {
	@suite("key/value api tests")
	class KeyValueApiTests {
		public static before() {
			stubs.defineWindow();
		}

		public static after() {
			stubs.undefineWindow();
		}

		public before() {
			stubs.defineStorage();
		}

		public after() {
			stubs.undefineStorage();
		}

		@test("can get storage api")
		public canGetApi() {
			// act
			let localStorage = BrowserStorage.getStorage(StorageType.Local);
			let sessionStorage = BrowserStorage.getStorage(StorageType.Session);

			// assert
			localStorage.should.not.be.null();
			sessionStorage.should.not.be.null();
		}

		@test("uses localstorage as default")
		public useLocalStorageDefault() {
			// arrange
			let storage = BrowserStorage.getStorage();

			// assert
			storage.should.not.be.null();
			storage.should.be.instanceof(KeyValueStorage);
			//storage["storage"].should.be.instanceof(window.localStorage);
		}
	}

	@suite("key/value set tests")
	class KeyValueSetTests {
		private storage: BrowserStorage.IBrowserStorage;

		public static before() {
			stubs.defineWindow();
		}

		public static after() {
			stubs.undefineWindow();
		}

		public before() {
			stubs.defineStorage();
			this.storage = BrowserStorage.getStorage(StorageType.Local);
		}

		public after() {
			stubs.undefineStorage();
		}

		@test("can set a simple value")
		public canSetValue(done: MochaDone) {
			// arrange
			let key = "key";
			let value = "value";
			let setSpy = sinon.spy(window.localStorage, "setItem");

			// act
			this.storage.set<string>({ key: key, value: value }).then((data: BrowserStorage.KeyValue<string>) => {
				// assert
				setSpy.calledOnce.should.be.true();
				setSpy.calledWith(key, value).should.be.true();
				done();
			});
		}

		@test("can set simple values")
		public canSetValues(done: MochaDone) {
			// arrange
			let data = [{ key: 'test', value: 1 },
				{ key: 'test2', value: 2 },
				{ key: 'test3', value: 3 }];
			let setSpy = sinon.spy(window.localStorage, "setItem");

			// act
			this.storage.set<number>(data).then((values: Array<BrowserStorage.KeyValue<number>>) => {
				// assert
				setSpy.calledThrice.should.be.true();
				setSpy.calledWith(data[0].key, data[0].value.toString()).should.be.true();
				setSpy.calledWith(data[1].key, data[1].value.toString()).should.be.true();
				setSpy.calledWith(data[2].key, data[2].value.toString()).should.be.true();
				done();
			});
		}
	}

	// it('can set a complex value', (done: MochaDone) => {
	// 	// arrange
	// 	let value: { value1: number, value2: string, value3: Array<number> } = {
	// 		value1: 1,
	// 		value2: "test",
	// 		value3: [2]
	// 	};

	// 	// act
	// 	storage.set<{ value1: number, value2: string, value3: Array<number> }>({ key: "test", value: value })
	// 		.then((data: BrowserStorage.KeyValue<{ value1: number, value2: string, value3: Array<number> }>) => {
	// 			// assert
	// 			api.setItem.calledOnce.should.be.true();
	// 			api.setItem.calledWith(data.key, JSON.stringify(data.value)).should.be.true();

	// 			done();
	// 		});
	// });

	// it('can set complex values', (done: MochaDone) => {
	// 	// arrange
	// 	let values: Array<{ value1: number, value2: string, value3: Array<number> }> = [{
	// 		value1: 1,
	// 		value2: "test",
	// 		value3: [2]
	// 	}, {
	// 		value1: 2,
	// 		value2: "test2",
	// 		value3: [3, 2]
	// 	}, {
	// 		value1: 3,
	// 		value2: "test3",
	// 		value3: [3, 2, 5, 4, 1]
	// 	}];

	// 	// act
	// 	storage.set<{ value1: number, value2: string, value3: Array<number> }>([{
	// 		key: "test",
	// 		value: values[0]
	// 	}, {
	// 		key: "test2",
	// 		value: values[1]
	// 	}, {
	// 		key: "test3",
	// 		value: values[2]
	// 	}]).then((data: Array<BrowserStorage.KeyValue<{ value1: number, value2: string, value3: Array<number> }>>) => {
	// 		// assert
	// 		api.setItem.calledThrice.should.be.true();
	// 		api.setItem.calledWith(data[0].key, JSON.stringify(data[0].value)).should.be.true();
	// 		api.setItem.calledWith(data[1].key, JSON.stringify(data[1].value)).should.be.true();
	// 		api.setItem.calledWith(data[2].key, JSON.stringify(data[2].value)).should.be.true();

	// 		done();
	// 	});
	// });

	// // "KeyValue storage can always set a value"
	// it('will fail to set a value', () => {});

	// // "KeyValue storage can always set a value"
	// it('will fail to set some values', () => {});

	// it('can get a simple value', (done: MochaDone) => {
	// 	// arrange
	// 	api.getItem.withArgs('someitem').returns('value');

	// 	// act
	// 	storage.get<string>('someitem').then((data: BrowserStorage.KeyValue<string>) => {
	// 		// assert
	// 		api.getItem.calledOnce.should.be.true();
	// 		api.getItem.calledWith('someitem').should.be.true();

	// 		data.should.have.property('key', 'someitem');
	// 		data.should.have.property('value', 'value');

	// 		done();
	// 	});
	// });

	// it('can get simple values', (done: MochaDone) => {
	// 	// arrange
	// 	let keys = ['item1', 'item2', 'item3', 'item4'];
	// 	let values = ['value1', 'value2', 'value3', 'value4'];
	// 	api.getItem.withArgs(keys[0]).returns(values[0]);
	// 	api.getItem.withArgs(keys[1]).returns(values[1]);
	// 	api.getItem.withArgs(keys[2]).returns(values[2]);
	// 	api.getItem.withArgs(keys[3]).returns(values[3]);

	// 	// act
	// 	storage.get<string>(keys).then((data: Array<BrowserStorage.KeyValue<string>>) => {
	// 		// assert
	// 		api.getItem.callCount.should.be.exactly(4);
	// 		api.getItem.calledWith(keys[0]).should.be.true();
	// 		api.getItem.calledWith(keys[1]).should.be.true();
	// 		api.getItem.calledWith(keys[2]).should.be.true();
	// 		api.getItem.calledWith(keys[3]).should.be.true();

	// 		data[0].should.have.property('key', keys[0]);
	// 		data[0].should.have.property('value', values[0]);
	// 		data[1].should.have.property('key', keys[1]);
	// 		data[1].should.have.property('value', values[1]);
	// 		data[2].should.have.property('key', keys[2]);
	// 		data[2].should.have.property('value', values[2]);
	// 		data[3].should.have.property('key', keys[3]);
	// 		data[3].should.have.property('value', values[3]);

	// 		done();
	// 	});
	// });

	// it('can get a complex value', (done: MochaDone) => {
	// 	// arrange
	// 	let key: string = 'item';
	// 	let value: { prop1: number, prop2: string, prop3: Object, prop4: Array<any> } = {
	// 		prop1: 1,
	// 		prop2: key,
	// 		prop3: { test: 'value' },
	// 		prop4: [ key, key ],
	// 	};
	// 	api.getItem.withArgs(key).returns(value);

	// 	// act
	// 	storage.get<{ prop1: number, prop2: string, prop3: Object, prop4: Array<any> }>(key)
	// 		.then((data: BrowserStorage.KeyValue<{ prop1: number, prop2: string, prop3: Object, prop4: Array<any> }>) => {
	// 		// assert
	// 		api.getItem.calledOnce.should.be.true();
	// 		api.getItem.calledWith(key).should.be.true();

	// 		data.should.have.property('key', key);
	// 		data.should.have.property('value', value);

	// 		done();
	// 	});
	// });

	// it('can get complex values', (done: MochaDone) => {
	// 	// arrange
	// 	let keys: Array<string> = ['item1', 'item2', 'item3'];
	// 	let values: Array<{ prop1: number, prop2: string }> = [
	// 		{
	// 			prop1: 1,
	// 			prop2: 'test1'
	// 		},
	// 		{
	// 			prop1: 2,
	// 			prop2: 'test2'
	// 		},
	// 		{
	// 			prop1: 3,
	// 			prop2: 'test3'
	// 		}
	// 	];
	// 	api.getItem.withArgs(keys[0]).returns(values[0]);
	// 	api.getItem.withArgs(keys[1]).returns(values[1]);
	// 	api.getItem.withArgs(keys[2]).returns(values[2]);

	// 	// act
	// 	storage.get<{ prop1: number, prop2: string }>(keys)
	// 		.then((data: Array<BrowserStorage.KeyValue<{ prop1: number, prop2: string }>>) => {
	// 			// assert
	// 			api.getItem.calledThrice.should.be.true();
	// 			api.getItem.calledWith(keys[0]).should.be.true();
	// 			api.getItem.calledWith(keys[1]).should.be.true();
	// 			api.getItem.calledWith(keys[2]).should.be.true();

	// 			data[0].should.have.property('key', keys[0]);
	// 			data[0].should.have.property('value', values[0]);
	// 			data[1].should.have.property('key', keys[1]);
	// 			data[1].should.have.property('value', values[1]);
	// 			data[2].should.have.property('key', keys[2]);
	// 			data[2].should.have.property('value', values[2]);

	// 			done();
	// 		});
	// });

	// it("will fail to get a value if it doesn't exist", (done: MochaDone) => {
	// 	// arrange
	// 	let key: string = 'item';
	// 	api.getItem.withArgs(key).returns(null);

	// 	// act
	// 	storage.get<string>(key).catch((reason: BrowserStorage.KeyValueOrError<string>) => {
	// 		// assert
	// 		api.getItem.calledOnce.should.be.true();
	// 		api.getItem.calledWith(key).should.be.true();

	// 		reason.key.should.equal(key);
	// 		reason.error.should.not.be.empty();

	// 		done();
	// 	});
	// });

	// it("will only get the values that exists", (done: MochaDone) => {
	// 	// arrange
	// 	let keys: Array<string> = ['item1', 'item2', 'item3'];
	// 	let values: Array<string> = ['value1'];

	// 	api.getItem.withArgs(keys[0]).returns(values[0]);
	// 	api.getItem.returns(null);

	// 	// act
	// 	storage.get<string>(keys).then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
	// 		// assert
	// 		api.getItem.calledThrice.should.be.true();
	// 		api.getItem.calledWith(keys[0]).should.be.true();
	// 		api.getItem.calledWith(keys[1]).should.be.true();
	// 		api.getItem.calledWith(keys[2]).should.be.true();

	// 		data.should.have.length(3);
	// 		data[0].should.have.property('key', keys[0]);
	// 		data[0].should.have.property('value', values[0]);
	// 		data[1].should.have.property('key', keys[1]);
	// 		data[1].should.have.ownProperty('error').and.not.be.empty();
	// 		data[2].should.have.property('key', keys[2]);
	// 		data[2].should.have.ownProperty('error').and.not.be.empty();

	// 		done();
	// 	});
	// });

	// it("will fail to get values, when they don't exist", (done: MochaDone) => {
	// 	// arrange
	// 	let keys: Array<string> = ['item1', 'item2'];
	// 	api.getItem.returns(null);

	// 	// act
	// 	storage.get<string>(keys).catch((reason: Array<BrowserStorage.KeyValueOrError<string>>) => {
	// 		// assert
	// 		api.getItem.calledTwice.should.be.true();
	// 		api.getItem.calledWith(keys[0]).should.be.true();
	// 		api.getItem.calledWith(keys[1]).should.be.true();

	// 		reason[0].key.should.equal(keys[0]);
	// 		reason[0].should.have.ownProperty('error').and.not.be.empty();
	// 		reason[1].key.should.equal(keys[1]);
	// 		reason[1].should.have.ownProperty('error').and.not.be.empty();

	// 		done();
	// 	});
	// });

	// it('can remove a value', (done: MochaDone) => {
	// 	// arrange
	// 	let key = 'test';
	// 	api.getItem.withArgs(key).returns('value');

	// 	// act
	// 	storage.remove(key).then((data: BrowserStorage.KeyValueOrError<void>) => {
	// 		api.removeItem.calledOnce.should.be.true();
	// 		api.removeItem.calledWith(key).should.be.true();

	// 		data.key.should.equal(key);

	// 		done();
	// 	});
	// });

	// it('will fail to remove a value', (done: MochaDone) => {
	// 	// arrange
	// 	let key = 'test';
	// 	api.getItem.returns(null);

	// 	// act
	// 	storage.remove(key).catch((reason: BrowserStorage.KeyValueOrError<void>) => {
	// 		// assert
	// 		reason.key.should.equal(key);
	// 		reason.should.have.ownProperty('error').and.not.be.empty();

	// 		done();
	// 	});
	// });

	// it("will only remove values that exists", (done: MochaDone) => {
	// 	// arrange
	// 	let keys: Array<string> = ['item1', 'item2'];
	// 	api.getItem.withArgs(keys[0]).returns('value');
	// 	api.getItem.returns(null);

	// 	// act
	// 	storage.remove(keys).then((data: Array<BrowserStorage.KeyValueOrError<void>>) => {
	// 		// assert
	// 		api.removeItem.calledOnce.should.be.true();
	// 		api.removeItem.calledWith(keys[0]).should.be.true();

	// 		data[0].key.should.equal(keys[0]);
	// 		data[1].key.should.equal(keys[1]);
	// 		data[1].should.have.ownProperty('error').and.not.be.empty();

	// 		done();
	// 	});
	// });

	// it("will fail to remove values that doesn't exist", (done: MochaDone) => {
	// 	// arrange
	// 	let keys: Array<string> = ['item1', 'item2'];
	// 	api.getItem.returns(null);

	// 	// act
	// 	storage.remove(keys).catch((reason: Array<BrowserStorage.KeyValueOrError<void>>) => {
	// 		// assert
	// 		reason[0].key.should.equal(keys[0]);
	// 		reason[0].should.have.ownProperty('error').and.not.be.empty()
	// 		reason[1].key.should.equal(keys[1]);
	// 		reason[1].should.have.ownProperty('error').and.not.be.empty()

	// 		done();
	// 	});
	// });

	// it('can clear the storage', (done: MochaDone) => {
	// 	// act
	// 	storage.clear().then(() => {
	// 		// assert
	// 		api.clear.calledOnce.should.be.true();

	// 		done();
	// 	});
	// });

	// // KeyValue storage will always clear
	// it('will fail to clear the storage', () => {});
});