import "should";
import * as sinon from "sinon";
import { describe, before, beforeEach, after, afterEach } from "mocha";
import { suite, test } from "@testdeck/mocha";

import stubs from "./stubs";
import { StorageType } from "../src/storage-type";
import { BrowserStorageFactory } from "../src/browser-storage-factory";
import KeyValueStorage from "../src/storage/keyvalue-storage";
import BrowserStorage from "../typings/browser-storage";

type TestObj = {
  prop1: number;
  prop2: string;
  prop3: Object;
  prop4: Array<any>;
};

// session and local storage has similar api
@suite("KeyValue storage: key/value api tests")
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
  public canGetApiTest() {
    // act
    let localStorage = BrowserStorageFactory.getStorage(StorageType.Local);
    let sessionStorage = BrowserStorageFactory.getStorage(StorageType.Session);

    // assert
    localStorage.should.not.be.null();
    sessionStorage.should.not.be.null();
  }

  @test("uses local storage as default")
  public canGetDefaultApiTest() {
    // arrange
    let storage = BrowserStorageFactory.getStorage();

    // assert
    storage.should.not.be.null();
    storage.should.be.instanceof(KeyValueStorage);
  }
}

@suite("KeyValue storage: key/value set tests")
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
    this.storage = BrowserStorageFactory.getStorage(StorageType.Local);
  }

  public after() {
    stubs.undefineStorage();
  }

  @test("can set a simple value")
  public async canSetSimpleValueTest(): Promise<any> {
    // arrange
    let key = "key";
    let value = "value";
    let setSpy = sinon.spy(window.localStorage, "setItem");

    // act
    await this.storage.set<string>({ key: key, value: value });

    // assert
    setSpy.calledOnce.should.be.true();
    setSpy.calledWith(`bs_${key}`, value).should.be.true();
  }

  @test("can set a complex value")
  public async canSetComplexValue() {
    const key = "key";
    const value: TestObj = {
      prop1: 1,
      prop2: "test",
      prop3: { test: "test" },
      prop4: [1, 2],
    };
    let setSpy = sinon.spy(window.localStorage, "setItem");

    // act
    await this.storage.set<TestObj>({
      key: key,
      value: value,
    });

    // assert
    setSpy.calledOnce.should.be.true();
    setSpy.calledWith(`bs_${key}`, JSON.stringify(value)).should.be.true();
  }

  @test("can set complex values")
  public async canSetComplexValues() {
    // arrange
    const keys = ["key1", "key2", "key3"];
    const values: Array<TestObj> = [
      {
        prop1: 1,
        prop2: "test",
        prop3: {},
        prop4: [2],
      },
      {
        prop1: 2,
        prop2: "test 2",
        prop3: { test: "test" },
        prop4: [1, 3],
      },
      {
        prop1: 3,
        prop2: "test 3",
        prop3: { test: "test" },
        prop4: [4, 7, 23, 56],
      },
    ];
    let setSpy = sinon.spy(window.localStorage, "setItem");

    // act
    await this.storage.set<TestObj>([
      {
        key: keys[0],
        value: values[0],
      },
      {
        key: keys[1],
        value: values[1],
      },
      {
        key: keys[2],
        value: values[2],
      },
    ]);

    // assert
    setSpy.calledThrice.should.be.true();
    setSpy
      .calledWith(`bs_${keys[0]}`, JSON.stringify(values[0]))
      .should.be.true();
    setSpy
      .calledWith(`bs_${keys[1]}`, JSON.stringify(values[1]))
      .should.be.true();
    setSpy
      .calledWith(`bs_${keys[2]}`, JSON.stringify(values[2]))
      .should.be.true();
  }

  @test("will fail to set a value")
  public async willFailSetValue() {
    // arrange
    let key = "key";
    let value = "value";
    let setMock = sinon.mock(window.localStorage);
    setMock.expects("setItem").throws("Error");

    try {
      // act
      await this.storage.set<string>({ key: key, value: value });
    } catch (ex: any) {
      const reason = ex as BrowserStorage.KeyValueOrError<string>;

      // assert
      reason.key.should.equal(key);
      reason.error.should.not.be.empty();
    }

    // assert
    setMock.verify();
  }

  @test("will fail to set some values")
  public async willFailSetSomeValues() {
    // arrange
    let values = [
      {
        key: "key1",
        value: "value1",
      },
      {
        key: "key2",
        value: "value2",
      },
      {
        key: "key3",
        value: "value3",
      },
    ];
    let setStub = sinon.stub(window.localStorage, "setItem");
    setStub.withArgs(`bs_${values[1].key}`, values[1].value).throws("Error");

    // act
    const data = (await this.storage.set(values)) as Array<
      BrowserStorage.KeyValueOrError<string>
    >;

    // assert
    setStub.calledThrice.should.be.true();
    data[0].key.should.equal(values[0].key);
    data[0].value.should.equal(values[0].value);
    data[1].key.should.equal(values[2].key);
    data[1].value.should.equal(values[2].value);
    data[2].key.should.equal(values[1].key);
    data[2].error.should.not.be.empty();
  }
}

@suite("KeyValue storage: key/value get tests")
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
    this.storage = BrowserStorageFactory.getStorage(StorageType.Local);
  }

  public after() {
    stubs.undefineStorage();
  }

  @test("can get a simple value")
  public async canGetSimpleValueTest(): Promise<any> {
    // arrange
    const key = "someitem";
    const storageKey = `bs_${key}`;
    const value = "value";
    let getStub = sinon
      .stub(window.localStorage, "getItem")
      .withArgs(storageKey)
      .returns(JSON.stringify(value));

    // act
    const data = (await this.storage.get<string>(
      key
    )) as BrowserStorage.KeyValueOrError<string>;

    // assert
    getStub.calledOnce.should.be.true();
    getStub.calledWith(storageKey).should.be.true();
    data.key.should.be.equal(key);
    data.value.should.be.equal(value);
  }

  @test("can get simple values")
  public async canGetSimpleValuesTest(): Promise<any> {
    // arrange
    const keys = ["item1", "item2", "item3", "item4"];
    const values = ["value1", "value2", "value3", "value4"];
    let getStub = sinon.stub(window.localStorage, "getItem");

    for (let i in keys) {
      const storageKey = `bs_${keys[i]}`;
      getStub.withArgs(storageKey).returns(JSON.stringify(values[i]));
    }

    // act
    const data = (await this.storage.get<string>(keys)) as Array<
      BrowserStorage.KeyValueOrError<string>
    >;

    // assert
    getStub.callCount.should.be.exactly(4);

    for (let i in data) {
      const storageKey = `bs_${data[i].key}`;
      getStub.calledWith(storageKey).should.be.true();
      data[i].key.should.be.equal(keys[i]);
      data[i].value.should.be.equal(values[i]);
    }
  }

  @test("can get a complex value")
  public async canGetComplexValueTest(): Promise<any> {
    // arrange
    const key = "item";
    const storageKey = `bs_${key}`;
    const value: TestObj = {
      prop1: 1,
      prop2: key,
      prop3: { test: "value" },
      prop4: [key, key],
    };
    let getStub = sinon
      .stub(window.localStorage, "getItem")
      .withArgs(storageKey)
      .returns(JSON.stringify(value));

    // act
    const data = (await this.storage.get<{
      prop1: number;
      prop2: string;
      prop3: Object;
      prop4: Array<any>;
    }>(key)) as BrowserStorage.KeyValueOrError<TestObj>;

    // assert
    getStub.calledOnce.should.be.true();
    getStub.calledWith(storageKey).should.be.true();
    data.key.should.be.equal(key);
    data.value.should.be.deepEqual(value);
  }

  @test("can get complex values")
  public async canGetComplexValuesTest(): Promise<any> {
    // arrange
    const keys: Array<string> = ["item1", "item2", "item3"];
    const values: Array<TestObj> = [
      {
        prop1: 1,
        prop2: "test1",
        prop3: { test: 45 },
        prop4: [3, 1],
      },
      {
        prop1: 2,
        prop2: "test2",
        prop3: { test: "some" },
        prop4: [55],
      },
      {
        prop1: 3,
        prop2: "test3",
        prop3: { test: { new: "test" } },
        prop4: ["one", "two"],
      },
    ];
    let getStub = sinon.stub(window.localStorage, "getItem");

    for (let i in keys) {
      getStub.withArgs(`bs_${keys[i]}`).returns(JSON.stringify(values[0]));
    }

    // act
    const data = (await this.storage.get<TestObj>(keys)) as Array<
      BrowserStorage.KeyValueOrError<TestObj>
    >;

    // assert
    getStub.calledThrice.should.be.true();

    for (let i in data) {
      getStub.calledWith(`bs_${data[i].key}`).should.be.true();
      data[0].key.should.be.equal(keys[0]);
      data[0].value.should.be.deepEqual(values[0]);
    }
  }

  @test("will fail to get a value if it doesn't exist")
  public async willFailGetValue(): Promise<any> {
    // arrange
    const key = "item";
    const storageKey = `bs_${key}`;
    let getStub = sinon
      .stub(window.localStorage, "getItem")
      .withArgs(storageKey)
      .returns(null);

    // act
    try {
      await this.storage.get<string>(key);
    } catch (ex: any) {
      const reason = ex as BrowserStorage.KeyValueOrError<string>;

      // assert
      getStub.calledOnce.should.be.true();
      getStub.calledWith(storageKey).should.be.true();
      reason.key.should.equal(key);
      reason.error.should.not.be.empty();
    }
  }

  @test("will only get the values that exists")
  public async willOnlyGetSomeValues(): Promise<any> {
    // arrange
    const keys: Array<string> = ["item1", "item2", "item3"];
    const values: Array<string> = ["value1", "value2"];
    let getStub = sinon.stub(window.localStorage, "getItem");
    getStub.withArgs(`bs_${keys[0]}`).returns(JSON.stringify(values[0]));
    getStub.withArgs(`bs_${keys[1]}`).returns(JSON.stringify(values[1]));
    getStub.returns(null);

    // act
    const data = (await this.storage.get<string>(keys)) as Array<
      BrowserStorage.KeyValueOrError<string>
    >;

    // assert
    getStub.calledThrice.should.be.true();
    data.should.have.length(keys.length);

    data[0].key.should.be.equal(keys[0]);
    data[0].value.should.be.equal(values[0]);
    data[1].key.should.be.equal(keys[1]);
    data[1].value.should.be.equal(values[1]);

    data[2].key.should.be.equal(keys[2]);
    data[2].error.should.not.be.empty();
  }

  @test("will fail to get values, when they don't exist")
  public async willFailGetAllValues(): Promise<any> {
    // arrange
    const keys = ["item1", "item2"];
    let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

    // act
    try {
      await this.storage.get<string>(keys);
    } catch (ex: any) {
      const reason = ex as Array<BrowserStorage.KeyValueOrError<string>>;

      // assert
      getStub.calledTwice.should.be.true();
      getStub.calledWith(`bs_${keys[0]}`).should.be.true();
      getStub.calledWith(`bs_${keys[1]}`).should.be.true();

      reason[0].key.should.equal(keys[0]);
      reason[0].error.should.not.be.empty();
      reason[1].key.should.equal(keys[1]);
      reason[1].should.not.be.empty();
    }
  }
}

@suite("KeyValue storage: key/value remove tests")
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
    this.storage = BrowserStorageFactory.getStorage(StorageType.Local);
  }

  public after() {
    stubs.undefineStorage();
  }

  @test("can remove a value")
  public async canRemoveValueTest(): Promise<any> {
    // arrange
    const key = "test";
    let removeStub = sinon
      .stub(window.localStorage, "removeItem")
      .withArgs(`bs_${key}`);

    // act
    const data = (await this.storage.remove(
      key
    )) as BrowserStorage.KeyValueOrError<void>;

    // assert
    removeStub.calledOnce.should.be.true();
    removeStub.calledWith(`bs_${key}`).should.be.true();
    data.key.should.equal(key);
  }

  @test("will fail to remove a value")
  public async willFailRemoveTest(): Promise<any> {
    // arrange
    const key = "test";
    let getStub = sinon.stub(window.localStorage, "getItem").returns(null);
    let removeStub = sinon.stub(window.localStorage, "removeItem");

    // act
    try {
      await this.storage.remove(key);
    } catch (ex: any) {
      const reason = ex as BrowserStorage.KeyValueOrError<void>;

      // assert
      reason.key.should.equal(key);
      reason.error.should.not.be.empty();
    }
  }

  @test("will only remove values that exists")
  public async willRemoveSomeValuesTest(): Promise<any> {
    // arrange
    const keys: Array<string> = ["item1", "item2"];
    let removeStub = sinon.stub(window.localStorage, "removeItem");
    let getStub = sinon.stub(window.localStorage, "getItem");
    getStub.withArgs(`bs_${keys[0]}`).returns("value");
    getStub.returns(null);

    // act
    const data = (await this.storage.remove(keys)) as Array<
      BrowserStorage.KeyValueOrError<void>
    >;

    // assert
    removeStub.calledOnce.should.be.true();
    removeStub.calledWith(`bs_${keys[0]}`).should.be.true();
    data[0].key.should.equal(keys[0]);
    data[0].should.not.have.ownProperty("error");
    data[1].key.should.equal(keys[1]);
    data[1].error.should.not.be.empty();
  }

  @test("will fail to remove values that doesn't exist")
  public async willFailRemoveAllValuesTest(): Promise<any> {
    // arrange
    const keys = ["item1", "item2"];
    let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

    // act
    try {
      await this.storage.remove(keys);
    } catch (ex: any) {
      const reason = ex as Array<BrowserStorage.KeyValueOrError<void>>;

      // assert
      reason[0].key.should.equal(keys[0]);
      reason[0].error.should.not.be.empty();
      reason[1].key.should.equal(keys[1]);
      reason[1].should.not.be.empty();
    }
  }
}

@suite("KeyValue storage: key/value clear tests")
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
    this.storage = BrowserStorageFactory.getStorage(StorageType.Local);
  }

  public after() {
    stubs.undefineStorage();
  }

  @test("can clear the storage")
  public async canClearValuesTest(): Promise<any> {
    // arrange
    const keys = ["item1", "item2", "item3"];
    sinon.replace(window.localStorage, "length", keys.length);
    let keyStub = sinon.stub(window.localStorage, "key");
    let removeSpy = sinon.spy(window.localStorage, "removeItem");

    for (let i in keys) {
      keyStub.withArgs(parseInt(i)).returns(`bs_${keys[i]}`);
    }

    // act
    await this.storage.clear();

    // assert
    keyStub.calledThrice.should.be.true();
    removeSpy.calledThrice.should.be.true();
  }

  @test("will only clear storage entries")
  public async willOnlyClearStorageTest(): Promise<any> {
    // arrange
    const keys = ["item1", "item2"];
    sinon.replace(window.localStorage, "length", keys.length + 1);
    let keyStub = sinon.stub(window.localStorage, "key");
    let removeSpy = sinon.spy(window.localStorage, "removeItem");

    keyStub.withArgs(0).returns(`bs_${keys[0]}`);
    keyStub.withArgs(1).returns("other");
    keyStub.withArgs(2).returns(`bs_${keys[1]}`);

    // act
    await this.storage.clear();

    // assert
    keyStub.calledThrice.should.be.true();
    removeSpy.calledTwice.should.be.true();
  }

  @test("will fail to clear any")
  public async willFailClearTest(): Promise<any> {
    // arrange
    sinon.replace(window.localStorage, "length", 1);
    let keyStub = sinon.stub(window.localStorage, "key");
    let removeSpy = sinon.spy(window.localStorage, "removeItem");

    keyStub.withArgs(0).returns("other");

    // act
    try {
      await this.storage.clear();
    } catch (ex: any) {
      const reason = ex as BrowserStorage.ValueOrError<void>;

      // assert
      keyStub.calledOnce.should.be.true();
      removeSpy.called.should.be.false();
      reason.error.should.not.be.empty();
    }
  }
}

@suite("KeyValue storage: key/value count tests")
class KeyValueCountTests {
  private storage: BrowserStorage.IBrowserStorage;

  public static before() {
    stubs.defineWindow();
  }

  public static after() {
    stubs.undefineWindow();
  }

  public before() {
    stubs.defineStorage();
    this.storage = BrowserStorageFactory.getStorage(StorageType.Local);
  }

  public after() {
    stubs.undefineStorage();
  }

  @test("can count enries")
  public async canCountTest(): Promise<any> {
    // arrange
    const keys = ["key1", "key2"];
    let keyStub = sinon.stub(window.localStorage, "key");
    sinon.replace(window.localStorage, "length", keys.length);

    for (let i in keys) {
      keyStub.withArgs(parseInt(i)).returns(`bs_${keys[i]}`);
    }

    // act
    const data = await this.storage.count();
    
    // assert
    data.value.should.be.equal(keys.length);
  }

  @test("will only count storage entries")
  public async willOnlyCountStorage(): Promise<any> {
    // arrange
    const keys = ["key1", "key2"];
    let keyStub = sinon.stub(window.localStorage, "key");
    sinon.replace(window.localStorage, "length", keys.length + 1);

    keyStub.withArgs(2).returns("other");

    for (let i in keys) {
      keyStub.withArgs(parseInt(i)).returns(`bs_${keys[i]}`);
    }

    // act
    const data = await this.storage.count();
    
    // assert
    data.value.should.be.equal(keys.length);
  }
}
