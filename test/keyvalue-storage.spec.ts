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

		@test("can set a complex value")
		public canSetComplexValue(done: MochaDone) {
			// arrange
			let value: { value1: number, value2: string, value3: Array<number> } = {
				value1: 1,
				value2: "test",
				value3: [2]
			};
			let setSpy = sinon.spy(window.localStorage, "setItem");

			// act
			this.storage.set<{ value1: number, value2: string, value3: Array<number> }>(
				{ key: "test", value: value })
				.then((data: BrowserStorage.KeyValue<{ value1: number, value2: string, value3: Array<number> }>) => {
					// assert
					setSpy.calledOnce.should.be.true();
					setSpy.calledWith(data.key, JSON.stringify(data.value)).should.be.true();
					done();
				});
		}

		@test("can set complex values")
		public canSetComplexValues(done: MochaDone) {
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
			let setSpy = sinon.spy(window.localStorage, "setItem");

			// act
			this.storage.set<{ value1: number, value2: string, value3: Array<number> }>([{
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
				setSpy.calledThrice.should.be.true();
				setSpy.calledWith(data[0].key, JSON.stringify(data[0].value)).should.be.true();
				setSpy.calledWith(data[1].key, JSON.stringify(data[1].value)).should.be.true();
				setSpy.calledWith(data[2].key, JSON.stringify(data[2].value)).should.be.true();
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

	@suite("key/value get tests")
	class KeyValueGetTests {
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

		@test("can get a simple value")
		public canGetValue(done: MochaDone) {
			// arrange
			let key = "someitem";
			let value = "value";
			let getStub = sinon.stub(window.localStorage, "getItem").withArgs(key).returns(value);

			// act
			this.storage.get<string>(key).then((data: BrowserStorage.KeyValue<string>) => {
				// assert
				getStub.calledOnce.should.be.true();
				getStub.calledWith(key).should.be.true();
				data.should.have.property('key', key);
				data.should.have.property('value', value);
				done();
			});
		}

		@test("can get simple values")
		public canGetValues(done: MochaDone) {
			// arrange
			let keys = ['item1', 'item2', 'item3', 'item4'];
			let values = ['value1', 'value2', 'value3', 'value4'];
			let getStub = sinon.stub(window.localStorage, "getItem");
			getStub.withArgs(keys[0]).returns(values[0]);
			getStub.withArgs(keys[1]).returns(values[1]);
			getStub.withArgs(keys[2]).returns(values[2]);
			getStub.withArgs(keys[3]).returns(values[3]);

			// act
			this.storage.get<string>(keys).then((data: Array<BrowserStorage.KeyValue<string>>) => {
				// assert
				getStub.callCount.should.be.exactly(4);
				getStub.calledWith(keys[0]).should.be.true();
				getStub.calledWith(keys[1]).should.be.true();
				getStub.calledWith(keys[2]).should.be.true();
				getStub.calledWith(keys[3]).should.be.true();
				data[0].should.have.property('key', keys[0]);
				data[0].should.have.property('value', values[0]);
				data[1].should.have.property('key', keys[1]);
				data[1].should.have.property('value', values[1]);
				data[2].should.have.property('key', keys[2]);
				data[2].should.have.property('value', values[2]);
				data[3].should.have.property('key', keys[3]);
				data[3].should.have.property('value', values[3]);
				done();
			});
		}

		@test("can get a complex value")
		public canGetComplexValue(done: MochaDone) {
			// arrange
			let key: string = 'item';
			let value: { prop1: number, prop2: string, prop3: Object, prop4: Array<any> } = {
				prop1: 1,
				prop2: key,
				prop3: { test: 'value' },
				prop4: [key, key],
			};
			let getStub = sinon.stub(window.localStorage, "getItem").withArgs(key).returns(JSON.stringify(value));

			// act
			this.storage.get<{ prop1: number, prop2: string, prop3: Object, prop4: Array<any> }>(key)
				.then((data: BrowserStorage.KeyValue<{ prop1: number, prop2: string, prop3: Object, prop4: Array<any> }>) => {
					// assert
					getStub.calledOnce.should.be.true();
					getStub.calledWith(key).should.be.true();
					data.should.have.property('key', key);
					data.should.have.property('value', value);
					done();
				});
		}

		@test("can get complex values")
		public canGetComplexValues(done: MochaDone) {
			// arrange
			let keys: Array<string> = ['item1', 'item2', 'item3'];
			let values: Array<{ prop1: number, prop2: string }> = [
				{
					prop1: 1,
					prop2: 'test1'
				},
				{
					prop1: 2,
					prop2: 'test2'
				},
				{
					prop1: 3,
					prop2: 'test3'
				}
			];
			let getStub = sinon.stub(window.localStorage, "getItem");
			getStub.withArgs(keys[0]).returns(JSON.stringify(values[0]));
			getStub.withArgs(keys[1]).returns(JSON.stringify(values[1]));
			getStub.withArgs(keys[2]).returns(JSON.stringify(values[2]));

			// act
			this.storage.get<{ prop1: number, prop2: string }>(keys)
				.then((data: Array<BrowserStorage.KeyValue<{ prop1: number, prop2: string }>>) => {
					// assert
					getStub.calledThrice.should.be.true();
					getStub.calledWith(keys[0]).should.be.true();
					getStub.calledWith(keys[1]).should.be.true();
					getStub.calledWith(keys[2]).should.be.true();
					data[0].should.have.property('key', keys[0]);
					data[0].should.have.property('value', values[0]);
					data[1].should.have.property('key', keys[1]);
					data[1].should.have.property('value', values[1]);
					data[2].should.have.property('key', keys[2]);
					data[2].should.have.property('value', values[2]);
					done();
				});
		}

		@test("will fail to get a value if it doesn't exist")
		public willFailNotExist(done: MochaDone) {
			// arrange
			let key: string = 'item';
			let getStub = sinon.stub(window.localStorage, "getItem").withArgs(key).returns(null);

			// act
			this.storage.get<string>(key).catch((reason: BrowserStorage.KeyValueOrError<string>) => {
				// assert
				getStub.calledOnce.should.be.true();
				getStub.calledWith(key).should.be.true();
				reason.key.should.equal(key);
				reason.error.should.not.be.empty();
				done();
			});
		}

		@test("will only get the values that exists")
		public willGetValuesThatExists(done: MochaDone) {
			// arrange
			let keys: Array<string> = ['item1', 'item2', 'item3'];
			let values: Array<string> = ['value1'];
			let getStub = sinon.stub(window.localStorage, "getItem");
			getStub.withArgs(keys[0]).returns(values[0]);
			getStub.returns(null);

			// act
			this.storage.get<string>(keys).then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
				// assert
				getStub.calledThrice.should.be.true();
				getStub.calledWith(keys[0]).should.be.true();
				getStub.calledWith(keys[1]).should.be.true();
				getStub.calledWith(keys[2]).should.be.true();
				data.should.have.length(3);
				data[0].should.have.property('key', keys[0]);
				data[0].should.have.property('value', values[0]);
				data[1].should.have.property('key', keys[1]);
				data[1].should.have.ownProperty('error').and.not.be.empty();
				data[2].should.have.property('key', keys[2]);
				data[2].should.have.ownProperty('error').and.not.be.empty();
				done();
			});
		}

		@test("will fail to get values, when they don't exist")
		public willFailGetValuesThatNotExists(done: MochaDone) {
			// arrange
			let keys: Array<string> = ['item1', 'item2'];
			let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

			// act
			this.storage.get<string>(keys).catch((reason: Array<BrowserStorage.KeyValueOrError<string>>) => {
				// assert
				getStub.calledTwice.should.be.true();
				getStub.calledWith(keys[0]).should.be.true();
				getStub.calledWith(keys[1]).should.be.true();
				reason[0].key.should.equal(keys[0]);
				reason[0].should.have.ownProperty('error').and.not.be.empty();
				reason[1].key.should.equal(keys[1]);
				reason[1].should.have.ownProperty('error').and.not.be.empty();
				done();
			});
		}
	}

	@suite("key/value remove tests")
	class KeyValueRemoveTests {
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

		@test("can remove a value")
		public canRemoveValue(done: MochaDone) {
			// arrange
			let key = 'test';
			let removeStub = sinon.stub(window.localStorage, "removeItem").withArgs(key);

			// act
			this.storage.remove(key).then((data: BrowserStorage.KeyValueOrError<void>) => {
				removeStub.calledOnce.should.be.true();
				removeStub.calledWith(key).should.be.true();
				data.key.should.equal(key);
				done();
			});
		}

		@test("will fail to remove a value")
		public willFailRemove(done: MochaDone) {
			// arrange
			let key = 'test';
			let getStub = sinon.stub(window.localStorage, "getItem").returns(null);
			let removeStub = sinon.stub(window.localStorage, "removeItem");

			// act
			this.storage.remove(key).catch((reason: BrowserStorage.KeyValueOrError<void>) => {
				// assert
				reason.key.should.equal(key);
				reason.should.have.ownProperty('error').and.not.be.empty();
				done();
			});
		}

		@test("will only remove values that exists")
		public willRemoveExisting(done: MochaDone) {
			// arrange
			let keys: Array<string> = ['item1', 'item2'];
			let removeStub = sinon.stub(window.localStorage, "removeItem");
			let getStub = sinon.stub(window.localStorage, "getItem");
			getStub.withArgs(keys[0]).returns('value');
			getStub.returns(null);

			// act
			this.storage.remove(keys).then((data: Array<BrowserStorage.KeyValueOrError<void>>) => {
				// assert
				removeStub.calledOnce.should.be.true();
				removeStub.calledWith(keys[0]).should.be.true();
				data[0].key.should.equal(keys[0]);
				data[1].key.should.equal(keys[1]);
				data[1].should.have.ownProperty('error').and.not.be.empty();
				done();
			});
		}

		@test("will fail to remove values that doesn't exist")
		public willFailRemoveNonExisting(done: MochaDone) {
			// arrange
			let keys: Array<string> = ['item1', 'item2'];
			let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

			// act
			this.storage.remove(keys).catch((reason: Array<BrowserStorage.KeyValueOrError<void>>) => {
				// assert
				reason[0].key.should.equal(keys[0]);
				reason[0].should.have.ownProperty('error').and.not.be.empty()
				reason[1].key.should.equal(keys[1]);
				reason[1].should.have.ownProperty('error').and.not.be.empty()
				done();
			});
		}
	}

	@suite("key/value clear tests")
	class KeyValueClearTests {
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

		@test("can clear the storage")
		public canClear(done: MochaDone) {
			// arrange
			let clearSpy = sinon.spy(window.localStorage, "clear");

			// act
			this.storage.clear().then(() => {
				// assert
				clearSpy.calledOnce.should.be.true();
				done();
			});
		}
	}
});