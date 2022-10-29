import "should";
import * as sinon from "sinon";
import { describe, before, beforeEach, after, afterEach } from "mocha";
import { suite, test } from "@testdeck/mocha";

import stubs from "./stubs";
import { StorageType } from "../src/storage-type";
import { BrowserStorageFactory } from "../src/browser-storage-factory";
import KeyValueStorage from "../src/storage/keyvalue-storage";
import BrowserStorage from "../typings/browser-storage";

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

// session and local storage has similar api
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
    const value: { value1: number; value2: string; value3: Array<number> } = {
      value1: 1,
      value2: "test",
      value3: [2],
    };
    let setSpy = sinon.spy(window.localStorage, "setItem");

    // act
    await this.storage.set<{
      value1: number;
      value2: string;
      value3: Array<number>;
    }>({
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
    const values: Array<{
      value1: number;
      value2: string;
      value3: Array<number>;
    }> = [
      {
        value1: 1,
        value2: "test",
        value3: [2],
      },
      {
        value1: 2,
        value2: "test2",
        value3: [3, 2],
      },
      {
        value1: 3,
        value2: "test3",
        value3: [3, 2, 5, 4, 1],
      },
    ];
    let setSpy = sinon.spy(window.localStorage, "setItem");

    // act
    await this.storage.set<{
      value1: number;
      value2: string;
      value3: Array<number>;
    }>([
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

// session and local storage has similar api
describe("KeyValue storage (localStorage and sessionStorage)", () => {
  xdescribe("key/value get tests", () => {
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
      let getStub = sinon
        .stub(window.localStorage, "getItem")
        .withArgs(key)
        .returns(value);

      // act
      storage
        .get<string>(key)
        .then((data: BrowserStorage.KeyValueOrError<string>) => {
          // assert
          getStub.calledOnce.should.be.true();
          getStub.calledWith(key).should.be.true();
          data.should.have.property("key", key);
          data.should.have.property("value", value);
          done();
        });
    });

    it("can get simple values", (done: Mocha.Done) => {
      // arrange
      let keys = ["item1", "item2", "item3", "item4"];
      let values = ["value1", "value2", "value3", "value4"];
      let getStub = sinon.stub(window.localStorage, "getItem");
      getStub.withArgs(keys[0]).returns(values[0]);
      getStub.withArgs(keys[1]).returns(values[1]);
      getStub.withArgs(keys[2]).returns(values[2]);
      getStub.withArgs(keys[3]).returns(values[3]);

      // act
      storage
        .get<string>(keys)
        .then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
          // assert
          getStub.callCount.should.be.exactly(4);
          getStub.calledWith(keys[0]).should.be.true();
          getStub.calledWith(keys[1]).should.be.true();
          getStub.calledWith(keys[2]).should.be.true();
          getStub.calledWith(keys[3]).should.be.true();
          data[0].should.have.property("key", keys[0]);
          data[0].should.have.property("value", values[0]);
          data[1].should.have.property("key", keys[1]);
          data[1].should.have.property("value", values[1]);
          data[2].should.have.property("key", keys[2]);
          data[2].should.have.property("value", values[2]);
          data[3].should.have.property("key", keys[3]);
          data[3].should.have.property("value", values[3]);
          done();
        });
    });

    it("can get a complex value", (done: Mocha.Done) => {
      // arrange
      let key: string = "item";
      let value: {
        prop1: number;
        prop2: string;
        prop3: Object;
        prop4: Array<any>;
      } = {
        prop1: 1,
        prop2: key,
        prop3: { test: "value" },
        prop4: [key, key],
      };
      let getStub = sinon
        .stub(window.localStorage, "getItem")
        .withArgs(key)
        .returns(JSON.stringify(value));

      // act
      storage
        .get<{
          prop1: number;
          prop2: string;
          prop3: Object;
          prop4: Array<any>;
        }>(key)
        .then(
          (
            data: BrowserStorage.KeyValueOrError<{
              prop1: number;
              prop2: string;
              prop3: Object;
              prop4: Array<any>;
            }>
          ) => {
            // assert
            getStub.calledOnce.should.be.true();
            getStub.calledWith(key).should.be.true();
            data.should.have.property("key", key);
            data.should.have.property("value", value);
            done();
          }
        );
    });

    it("can get complex values", (done: Mocha.Done) => {
      // arrange
      let keys: Array<string> = ["item1", "item2", "item3"];
      let values: Array<{ prop1: number; prop2: string }> = [
        {
          prop1: 1,
          prop2: "test1",
        },
        {
          prop1: 2,
          prop2: "test2",
        },
        {
          prop1: 3,
          prop2: "test3",
        },
      ];
      let getStub = sinon.stub(window.localStorage, "getItem");
      getStub.withArgs(keys[0]).returns(JSON.stringify(values[0]));
      getStub.withArgs(keys[1]).returns(JSON.stringify(values[1]));
      getStub.withArgs(keys[2]).returns(JSON.stringify(values[2]));

      // act
      storage
        .get<{ prop1: number; prop2: string }>(keys)
        .then(
          (
            data: Array<
              BrowserStorage.KeyValueOrError<{ prop1: number; prop2: string }>
            >
          ) => {
            // assert
            getStub.calledThrice.should.be.true();
            getStub.calledWith(keys[0]).should.be.true();
            getStub.calledWith(keys[1]).should.be.true();
            getStub.calledWith(keys[2]).should.be.true();
            data[0].should.have.property("key", keys[0]);
            data[0].should.have.property("value", values[0]);
            data[1].should.have.property("key", keys[1]);
            data[1].should.have.property("value", values[1]);
            data[2].should.have.property("key", keys[2]);
            data[2].should.have.property("value", values[2]);
            done();
          }
        );
    });

    it("will fail to get a value if it doesn't exist", (done: Mocha.Done) => {
      // arrange
      let key: string = "item";
      let getStub = sinon
        .stub(window.localStorage, "getItem")
        .withArgs(key)
        .returns(null);

      // act
      storage
        .get<string>(key)
        .catch((reason: BrowserStorage.KeyValueOrError<string>) => {
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
      let keys: Array<string> = ["item1", "item2", "item3"];
      let values: Array<string> = ["value1"];
      let getStub = sinon.stub(window.localStorage, "getItem");
      getStub.withArgs(keys[0]).returns(values[0]);
      getStub.returns(null);

      // act
      storage
        .get<string>(keys)
        .then((data: Array<BrowserStorage.KeyValueOrError<string>>) => {
          // assert
          getStub.calledThrice.should.be.true();
          getStub.calledWith(keys[0]).should.be.true();
          getStub.calledWith(keys[1]).should.be.true();
          getStub.calledWith(keys[2]).should.be.true();
          data.should.have.length(3);
          data[0].should.have.property("key", keys[0]);
          data[0].should.have.property("value", values[0]);
          data[1].should.have.property("key", keys[1]);
          data[1].should.have.ownProperty("error").and.not.be.empty();
          data[2].should.have.property("key", keys[2]);
          data[2].should.have.ownProperty("error").and.not.be.empty();
          done();
        });
    });

    it("will fail to get values, when they don't exist", (done: Mocha.Done) => {
      // arrange
      let keys: Array<string> = ["item1", "item2"];
      let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

      // act
      storage
        .get<string>(keys)
        .catch((reason: Array<BrowserStorage.KeyValueOrError<string>>) => {
          // assert
          getStub.calledTwice.should.be.true();
          getStub.calledWith(keys[0]).should.be.true();
          getStub.calledWith(keys[1]).should.be.true();
          reason[0].key.should.equal(keys[0]);
          reason[0].should.have.ownProperty("error").and.not.be.empty();
          reason[1].key.should.equal(keys[1]);
          reason[1].should.have.ownProperty("error").and.not.be.empty();
          done();
        });
    });
  });

  xdescribe("key/value remove tests", () => {
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
      let key = "test";
      let removeStub = sinon
        .stub(window.localStorage, "removeItem")
        .withArgs(key);

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
      let key = "test";
      let getStub = sinon.stub(window.localStorage, "getItem").returns(null);
      let removeStub = sinon.stub(window.localStorage, "removeItem");

      // act
      storage
        .remove(key)
        .catch((reason: BrowserStorage.KeyValueOrError<void>) => {
          // assert
          reason.key.should.equal(key);
          reason.should.have.ownProperty("error").and.not.be.empty();
          done();
        });
    });

    it("will only remove values that exists", (done: Mocha.Done) => {
      // arrange
      let keys: Array<string> = ["item1", "item2"];
      let removeStub = sinon.stub(window.localStorage, "removeItem");
      let getStub = sinon.stub(window.localStorage, "getItem");
      getStub.withArgs(keys[0]).returns("value");
      getStub.returns(null);

      // act
      storage
        .remove(keys)
        .then((data: Array<BrowserStorage.KeyValueOrError<void>>) => {
          // assert
          removeStub.calledOnce.should.be.true();
          removeStub.calledWith(keys[0]).should.be.true();
          data[0].key.should.equal(keys[0]);
          data[1].key.should.equal(keys[1]);
          data[1].should.have.ownProperty("error").and.not.be.empty();
          done();
        });
    });

    it("will fail to remove values that doesn't exist", (done: Mocha.Done) => {
      // arrange
      let keys: Array<string> = ["item1", "item2"];
      let getStub = sinon.stub(window.localStorage, "getItem").returns(null);

      // act
      storage
        .remove(keys)
        .catch((reason: Array<BrowserStorage.KeyValueOrError<void>>) => {
          // assert
          reason[0].key.should.equal(keys[0]);
          reason[0].should.have.ownProperty("error").and.not.be.empty();
          reason[1].key.should.equal(keys[1]);
          reason[1].should.have.ownProperty("error").and.not.be.empty();
          done();
        });
    });
  });

  xdescribe("key/value clear tests", () => {
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
