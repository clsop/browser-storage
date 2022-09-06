import 'should';
import * as sinon from 'sinon';
import { describe, before, beforeEach, after, afterEach } from 'mocha';

import stubs from './stubs';
import { StorageType } from '../src/storage-type';
import { BrowserStorageFactory } from '../src/browser-storage-factory';
import KeyValueStorage from '../src/storage/keyvalue-storage';
import BrowserStorage from '../typings/browser-storage';

// session and local storage has similar api
describe('KeyValue storage (localStorage and sessionStorage)', () => {
	describe("key/value api tests", () => {
		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineStorage();
		});

		afterEach(() => {
			stubs.undefineStorage();
		});

		it("can get storage api", () => {
			// act
			let localStorage = BrowserStorageFactory.getStorage(StorageType.Local);
			let sessionStorage = BrowserStorageFactory.getStorage(StorageType.Session);

			// assert
			localStorage.should.not.be.null();
			sessionStorage.should.not.be.null();
		});

		it("uses localstorage as default", () => {
			// arrange
			let storage = BrowserStorageFactory.getStorage();

			// assert
			storage.should.not.be.null();
			storage.should.be.instanceof(KeyValueStorage);
		});
	});

	describe("key/value set tests", () => {
		let storage: BrowserStorage.IBrowserStorage;

		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineStorage();
			storage = BrowserStorageFactory.getStorage(StorageType.Local);
		});

		afterEach(() => {
			stubs.undefineStorage();
		});

		it("can set a simple value", (done: Mocha.Done) => {
			// arrange
			let key = "key";
			let value = "value";
			let setSpy = sinon.spy(window.localStorage, "setItem");

			// act
			storage.set<string>({ key: key, value: value }).then((data: BrowserStorage.KeyValueOrError<string>) => {
				// assert
				setSpy.calledOnce.should.be.true();
				setSpy.calledWith(key, value).should.be.true();
				done();
			});
		});

		it("can set simple values", (done: Mocha.Done) => {
			// arrange
			let data = [{ key: 'test', value: 1 },
			{ key: 'test2', value: 2 },
			{ key: 'test3', value: 3 }];
			let setSpy = sinon.spy(window.localStorage, "setItem");

			// act
			storage.set<number>(data).then((values: Array<BrowserStorage.KeyValueOrError<number>>) => {
				// assert
				setSpy.calledThrice.should.be.true();
				setSpy.calledWith(data[0].key, data[0].value.toString()).should.be.true();
				setSpy.calledWith(data[1].key, data[1].value.toString()).should.be.true();
				setSpy.calledWith(data[2].key, data[2].value.toString()).should.be.true();
				done();
			});
		});

		it("can set a complex value", (done: Mocha.Done) => {
			// arrange
			let value: { value1: number, value2: string, value3: Array<number> } = {
				value1: 1,
				value2: "test",
				value3: [2]
			};
			let setSpy = sinon.spy(window.localStorage, "setItem");

			// act
			storage.set<{ value1: number, value2: string, value3: Array<number> }>(
				{ key: "test", value: value })
				.then((data: BrowserStorage.KeyValueOrError<{ value1: number, value2: string, value3: Array<number> }>) => {
					// assert
					setSpy.calledOnce.should.be.true();
					setSpy.calledWith(data.key, JSON.stringify(data.value)).should.be.true();
					done();
				});
		});

		it("can set complex values", (done: Mocha.Done) => {
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
			storage.set<{ value1: number, value2: string, value3: Array<number> }>([{
				key: "test",
				value: values[0]
			}, {
				key: "test2",
				value: values[1]
			}, {
				key: "test3",
				value: values[2]
			}]).then((data: Array<BrowserStorage.KeyValueOrError<{ value1: number, value2: string, value3: Array<number> }>>) => {
				// assert
				setSpy.calledThrice.should.be.true();
				setSpy.calledWith(data[0].key, JSON.stringify(data[0].value)).should.be.true();
				setSpy.calledWith(data[1].key, JSON.stringify(data[1].value)).should.be.true();
				setSpy.calledWith(data[2].key, JSON.stringify(data[2].value)).should.be.true();
				done();
			});
		});

		it("will fail to set a value", (done: Mocha.Done) => {
			// arrange
			let key = "key";
			let value = "value";
			let setMock = sinon.mock(window.localStorage);
			setMock.expects("setItem").throws("Error");

			// act
			storage.set<string>({ key: key, value: value }).catch((reason: BrowserStorage.KeyValueOrError<string>) => {
				// assert
				reason.key.should.equal(key);
				reason.error.should.not.be.empty();
				done();
			});

			// assert
			setMock.verify();
		});

		it("will fail to set some values", (done: Mocha.Done) => {
			// arrange
			let data = [{
				key: "key1", value: "value1"
			}, {
				key: "key2", value: "value2"
			}, {
				key: "key3", value: "value3"
			}];
			let setStub = sinon.stub(window.localStorage, "setItem");
			setStub.withArgs(data[1].key, data[1].value).throws("Error");

			// act
			storage.set<string>(data).then((setData: Array<BrowserStorage.KeyValueOrError<string>>) => {
				// assert
				setStub.calledThrice.should.be.true();
				setData[0].key.should.equal(data[0].key);
				setData[0].value.should.equal(data[0].value);
				setData[1].key.should.equal(data[2].key);
				setData[1].value.should.equal(data[2].value);
				setData[2].key.should.equal(data[1].key);
				setData[2].error.should.not.be.empty();
				done();
			});
		});
	});

	describe("key/value get tests", () => {
		let storage: BrowserStorage.IBrowserStorage;

		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineStorage();
			storage = BrowserStorageFactory.getStorage(StorageType.Local);
		});

		afterEach(() => {
			stubs.undefineStorage();
		});

		it("can get a simple value", (done: Mocha.Done) => {
			// arrange
			let key = "someitem";
			let value = "value";
			let getStub = sinon.stub(window.localStorage, "getItem").withArgs(key).returns(value);

			// act
			storage.get<string>(key).then((data: BrowserStorage.KeyValueOrError<string>) => {
				// assert
				getStub.calledOnce.should.be.true();
				getStub.calledWith(key).should.be.true();
				data.should.have.property('key', key);
				data.should.have.property('value', value);
				done();
			});
		});

		it("can get simple values", (done: Mocha.Done) => {
			// arrange
			let keys = ['item1', 'item2', 'item3', 'item4'];
			let values = ['value1', 'value2', 'value3', 'value4'];
			let getStub = sinon.stub(window.localStorage, "getItem");
			getStub.withArgs(keys[0]).returns(values[0]);
			getStub.withArgs(keys[1]).returns(values[1]);
			getStub.withArgs(keys[2]).returns(values[2]);
			getStub.withArgs(keys[3]).returns(values[3]);

			// act
			storage.get<string>(keys).then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
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
		});

		it("can get a complex value", (done: Mocha.Done) => {
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
			storage.get<{ prop1: number, prop2: string, prop3: Object, prop4: Array<any> }>(key)
				.then((data: BrowserStorage.KeyValueOrError<{ prop1: number, prop2: string, prop3: Object, prop4: Array<any> }>) => {
					// assert
					getStub.calledOnce.should.be.true();
					getStub.calledWith(key).should.be.true();
					data.should.have.property('key', key);
					data.should.have.property('value', value);
					done();
				});
		});

		it("can get complex values", (done: Mocha.Done) => {
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
			storage.get<{ prop1: number, prop2: string }>(keys)
				.then((data: Array<BrowserStorage.KeyValueOrError<{ prop1: number, prop2: string }>>) => {
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
		});

		it("will fail to get a value if it doesn't exist", (done: Mocha.Done) => {
			// arrange
			let key: string = 'item';
			let getStub = sinon.stub(window.localStorage, "getItem").withArgs(key).returns(null);

			// act
			storage.get<string>(key).catch((reason: BrowserStorage.KeyValueOrError<string>) => {
				// assert
				getStub.calledOnce.should.be.true();
				getStub.calledWith(key).should.be.true();
				reason.key.should.equal(key);
				reason.error.should.not.be.empty();
				done();
			});
		});

		it("will only get the values that exists", (done: Mocha.Done) => {
			// arrange
			let keys: Array<string> = ['item1', 'item2', 'item3'];
			let values: Array<string> = ['value1'];
			let getStub = sinon.stub(window.localStorage, "getItem");
			getStub.withArgs(keys[0]).returns(values[0]);
			getStub.returns(null);

			// act
			storage.get<string>(keys).then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
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
		});

		it("will fail to get values, when they don't exist", (done: Mocha.Done) => {
			// arrange
			let keys: Array<string> = ['item1', 'item2'];
			let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

			// act
			storage.get<string>(keys).catch((reason: Array<BrowserStorage.KeyValueOrError<string>>) => {
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
		});
	});

	describe("key/value remove tests", () => {
		let storage: BrowserStorage.IBrowserStorage;

		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineStorage();
			storage = BrowserStorageFactory.getStorage(StorageType.Local);
		});

		afterEach(() => {
			stubs.undefineStorage();
		});

		it("can remove a value", (done: Mocha.Done) => {
			// arrange
			let key = 'test';
			let removeStub = sinon.stub(window.localStorage, "removeItem").withArgs(key);

			// act
			storage.remove(key).then((data: BrowserStorage.KeyValueOrError<void>) => {
				removeStub.calledOnce.should.be.true();
				removeStub.calledWith(key).should.be.true();
				data.key.should.equal(key);
				done();
			});
		});

		it("will fail to remove a value", (done: Mocha.Done) => {
			// arrange
			let key = 'test';
			let getStub = sinon.stub(window.localStorage, "getItem").returns(null);
			let removeStub = sinon.stub(window.localStorage, "removeItem");

			// act
			storage.remove(key).catch((reason: BrowserStorage.KeyValueOrError<void>) => {
				// assert
				reason.key.should.equal(key);
				reason.should.have.ownProperty('error').and.not.be.empty();
				done();
			});
		});

		it("will only remove values that exists", (done: Mocha.Done) => {
			// arrange
			let keys: Array<string> = ['item1', 'item2'];
			let removeStub = sinon.stub(window.localStorage, "removeItem");
			let getStub = sinon.stub(window.localStorage, "getItem");
			getStub.withArgs(keys[0]).returns('value');
			getStub.returns(null);

			// act
			storage.remove(keys).then((data: Array<BrowserStorage.KeyValueOrError<void>>) => {
				// assert
				removeStub.calledOnce.should.be.true();
				removeStub.calledWith(keys[0]).should.be.true();
				data[0].key.should.equal(keys[0]);
				data[1].key.should.equal(keys[1]);
				data[1].should.have.ownProperty('error').and.not.be.empty();
				done();
			});
		});

		it("will fail to remove values that doesn't exist", (done: Mocha.Done) => {
			// arrange
			let keys: Array<string> = ['item1', 'item2'];
			let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

			// act
			storage.remove(keys).catch((reason: Array<BrowserStorage.KeyValueOrError<void>>) => {
				// assert
				reason[0].key.should.equal(keys[0]);
				reason[0].should.have.ownProperty('error').and.not.be.empty()
				reason[1].key.should.equal(keys[1]);
				reason[1].should.have.ownProperty('error').and.not.be.empty()
				done();
			});
		});
	});

	describe("key/value clear tests", () => {
		let storage: BrowserStorage.IBrowserStorage;

		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineStorage();
			storage = BrowserStorageFactory.getStorage(StorageType.Local);
		});

		afterEach(() => {
			stubs.undefineStorage();
		});

		it("can clear the storage", (done: Mocha.Done) => {
			// arrange
			let clearSpy = sinon.spy(window.localStorage, "clear");

			// act
			storage.clear().then(() => {
				// assert
				clearSpy.calledOnce.should.be.true();
				done();
			});
		});
	});
});