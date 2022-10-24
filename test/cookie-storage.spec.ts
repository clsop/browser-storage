import "should";
import * as sinon from "sinon";
import { suite, test, timeout } from "@testdeck/mocha";

import stubs from "./stubs";
import { StorageType } from "../src/storage-type";
import { BrowserStorageFactory } from "../src/browser-storage-factory";
import BrowserStorage from "../typings/browser-storage";
import CookieOptions from "../src/options/cookie-options";

type TestObj = { test: string; num: number; decimal: number };
type CookieFakes = {
  getStub: sinon.SinonStub<[], any>;
  setStub: sinon.SinonStub<[v: any], void>;
  clear: Function;
};

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
  private static cookieOptions: CookieOptions<any>;

  public static before() {
    stubs.defineDocument();
    CookieSetTests.cookieFakes = stubs.defineCookie();
    CookieSetTests.storage = BrowserStorageFactory.getStorage(
      StorageType.Cookie
    );
    CookieSetTests.cookieOptions = new CookieOptions();
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
    const key = "key";
    const value = "value";

    // act
    const data = (await CookieSetTests.storage.set<string>({
      key: key,
      value: value,
    })) as BrowserStorage.KeyValueOrError<string>;
    const cookie = CookieSetTests.cookieOptions.create({
      key: data.key,
      value: data.value,
    });

    // assert
    CookieSetTests.cookieFakes.setStub.calledOnce.should.be.true();
    CookieSetTests.cookieFakes.setStub
      .calledWithExactly(cookie)
      .should.be.true();
  }

  @test("can set simple values")
  public async canSetSimpleValuesTest(): Promise<any> {
    // arrange
    const keys = ["key1", "key2"];
    const values = ["value1", "value2"];

    // act
    const data = (await CookieSetTests.storage.set<string>([
      { key: keys[0], value: values[0] },
      { key: keys[1], value: values[1] },
    ])) as Array<BrowserStorage.KeyValueOrError<string>>;
    const cookies = data.map((d) =>
      CookieSetTests.cookieOptions.create({ key: d.key, value: d.value })
    );

    // assert
    CookieSetTests.cookieFakes.setStub.calledTwice.should.be.true();
    CookieSetTests.cookieFakes.setStub
      .calledWithExactly(cookies[0])
      .should.be.true();
    CookieSetTests.cookieFakes.setStub
      .calledWithExactly(cookies[1])
      .should.be.true();
  }

  @test("can set a complex value")
  public async canSetComplexValueTest(): Promise<any> {
    // arrange
    const key = "key";
    const value: TestObj = { test: "test", num: 2, decimal: 23.45 };

    // act
    const data = (await CookieSetTests.storage.set<TestObj>({
      key: key,
      value: value,
    })) as BrowserStorage.KeyValueOrError<TestObj>;
    const cookie = CookieSetTests.cookieOptions.create({
      key: data.key,
      value: data.value,
    });

    // assert
    CookieSetTests.cookieFakes.setStub.calledOnce.should.be.true();
    CookieSetTests.cookieFakes.setStub
      .calledWithExactly(cookie)
      .should.be.true();
  }

  @test("can set complex values")
  public async canSetComplexValues(): Promise<any> {
    // arrange
    const values: Array<{ key: string; value: TestObj }> = [
      {
        key: "key1",
        value: { test: "test", num: 2, decimal: 24.32 },
      },
      {
        key: "key2",
        value: { test: "test2", num: 4, decimal: 46.23 },
      },
    ];

    // act
    const data = (await CookieSetTests.storage.set<TestObj>(values)) as Array<
      BrowserStorage.KeyValueOrError<TestObj>
    >;
    const cookies = data.map((d) =>
      CookieSetTests.cookieOptions.create({ key: d.key, value: d.value })
    );

    // assert
    CookieSetTests.cookieFakes.setStub.calledTwice.should.be.true();
    CookieSetTests.cookieFakes.setStub.calledWith(cookies[0]).should.be.true();
    CookieSetTests.cookieFakes.setStub.calledWith(cookies[1]).should.be.true();
  }
}

@suite("Cookie storage: cookie get tests")
class CookieGetTests {
  private storage: BrowserStorage.IBrowserStorage;
  private static cookieFakes: CookieFakes;
  private static cookieOptions: CookieOptions<any>;

  public static before() {
    stubs.defineDocument();
    CookieGetTests.cookieFakes = stubs.defineCookie();
    CookieGetTests.cookieOptions = new CookieOptions();
  }

  public static after() {
    stubs.undefineCookie();
    stubs.undefineDocument();
  }

  public before() {
    this.storage = BrowserStorageFactory.getStorage(
      StorageType.Cookie
    );
  }

  public after() {
    CookieGetTests.cookieFakes.getStub.resetHistory();
    CookieGetTests.cookieFakes.setStub.resetHistory();
    CookieGetTests.cookieFakes.clear();
  }

  @test("can get a simple value")
  public async canGetSimpleValueTest(): Promise<any> {
    // arrange
    const key = "key";
    const value = "value";
    document.cookie = `${key}="${value}"`
    
    // act
    const data = (await this.storage.get<string>(
      key
    )) as BrowserStorage.KeyValueOrError<string>;

    // assert
    CookieGetTests.cookieFakes.getStub.called.should.be.true();
    data.key.should.be.equal(key);
    data.value.should.be.equal(value);
  }

  @test("can get a complex value")
  public async canGetSimpleComplexValueTest(): Promise<any> {
    // arrange
    const key = "key";
    const value: TestObj = { decimal: 34.2, num: 3, test: "test" };
    document.cookie = `${key}=${JSON.stringify(value)}`
    
    // act
    const data = (await this.storage.get<TestObj>(
      key
    )) as BrowserStorage.KeyValueOrError<TestObj>;

    // assert
    CookieGetTests.cookieFakes.getStub.called.should.be.true();
    data.value.should.containDeep(value);
  }

  @test("can get complex values")
  public async canGetComplexValuesTest(): Promise<any> {
    // arrange
    const keys = ["key", "key2"];
    const values: Array<TestObj> = [
      { decimal: 34.2, num: 3, test: "test" },
      { decimal: 53.7, num: 4, test: "test2" },
    ];
    await this.storage.set<TestObj>([
      {
        key: keys[0],
        value: values[0],
      },
      {
        key: keys[1],
        value: values[1],
      },
    ]);

    // act
    const data = (await this.storage.get<TestObj>(keys)) as Array<
      BrowserStorage.KeyValueOrError<TestObj>
    >;

    // assert
    CookieGetTests.cookieFakes.getStub.called.should.be.true();
    data.should.be.Array();
    data.map((x) => x.key).should.have.length(keys.length);
    data.map((x) => x.key).should.containDeep(keys);
    data.map((x) => x.value).should.containDeep(values);
  }

  @test("will fail to get a value")
  public async willFailValueTest(): Promise<any> {
    // arrange
    const key = "key";

    try {
      // act
      await this.storage.get<TestObj>(key);
    } catch (err: any) {
      // assert
      const error = err as BrowserStorage.KeyValueOrError<TestObj>;
      error.error.should.not.be.null();
    }
  }

  @test("will fail to get some values")
  public async willFailValuesTest(): Promise<any> {
    // arrange
    const keys = ["key", "key2"];
    await this.storage.set<TestObj>({
      key: keys[0],
      value: { decimal: 2.2, num: 33, test: "valid" },
    });

    // act
    const data = (await this.storage.get<TestObj>(keys)) as Array<
      BrowserStorage.KeyValueOrError<TestObj>
    >;

    // assert
    data[0].value.should.not.be.null();
    data[1].error.should.not.be.null();
  }
}

@suite("Cookie storage: cookie remove tests")
class CookieRemoveTests {
  private storage: BrowserStorage.IBrowserStorage;
  private static cookieFakes: CookieFakes;

  public static before() {
    stubs.defineDocument();
    CookieRemoveTests.cookieFakes = stubs.defineCookie();
  }

  public static after() {
    stubs.undefineCookie();
    stubs.undefineDocument();
  }

  public before() {
    this.storage = BrowserStorageFactory.getStorage(
      StorageType.Cookie
    );
  }

  public after() {
    CookieRemoveTests.cookieFakes.getStub.resetHistory();
    CookieRemoveTests.cookieFakes.setStub.resetHistory();
    CookieRemoveTests.cookieFakes.clear();
  }

  @test("can remove a value")
  public async canRemoveValueTest(): Promise<any> {
    // arrange
    const key = "key";
    const value = "value";
    document.cookie = `${key}=${JSON.stringify(value)}`;

    // act
    const data = (await this.storage.remove(
      key
    )) as BrowserStorage.KeyValueOrError<void>;

    // assert
    CookieRemoveTests.cookieFakes.setStub.called.should.be.true();
    data.key.should.be.equal(key);
    document.cookie.should.not.be.containEql(`${data.key}=${data.value}`);
  }

  @test("can remove some values")
  public async canRemoveValuesTest(): Promise<any> {
    // arrange
    const keyValues: Array<BrowserStorage.KeyValue<string>> = [
      {
        key: "key",
        value: "value",
      },
      {
        key: "key1",
        value: "value1",
      },
      {
        key: "key2",
        value: "value2",
      },
    ];
    const removeKeys = [keyValues[0].key, keyValues[2].key];
    keyValues.forEach((x) => (document.cookie = `${x.key}=${JSON.stringify(x.value)}`));

    // act
    const data = (await this.storage.remove(removeKeys)) as Array<
      BrowserStorage.KeyValueOrError<void>
    >;

    // assert
    const keys = data.map((x) => x.key);
    CookieRemoveTests.cookieFakes.setStub.called.should.be.true();
    keys.should.be.deepEqual(removeKeys);

    for (let key of removeKeys) {
      document.cookie.should.not.be.containEql(
        `${key}=${data.find((x) => x.key == key).value}`
      );
    }
  }

  @test("will fail to remove value")
  public async willFailRemoveValueTest(): Promise<any> {
    // arrange
    const key = "key";

    // act
    try {
      await this.storage.remove(key);
    } catch (err: any) {
      const data = err as BrowserStorage.KeyValueOrError<void>;

      // assert
      CookieRemoveTests.cookieFakes.setStub.called.should.not.be.true();
      data.key.should.be.equal(key);
      data.error.should.not.be.undefined();
    }
  }

  @test("will fail to remove some values")
  public async willFailRemoveValuesTest(): Promise<any> {
    // arrange
    const keyValues: Array<BrowserStorage.KeyValue<string>> = [
      {
        key: "key",
        value: "value",
      },
      {
        key: "key1",
        value: "value1",
      },
      {
        key: "key2",
        value: "value2",
      },
    ];
    const removeKeys = [keyValues[0].key, keyValues[2].key];
    document.cookie = `${keyValues[1].key}=${keyValues[1].value}`;

    // act
    const data = (await this.storage.remove(removeKeys)) as Array<
      BrowserStorage.KeyValueOrError<void>
    >;

    // assert
    document.cookie.should.be.containEql(
      `${keyValues[1].key}=${keyValues[1].value}`
    );

    for (let valuePair of data) {
      removeKeys.should.containEql(valuePair.key);
      valuePair.error.should.not.be.undefined();
    }
  }
}
