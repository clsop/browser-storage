import 'should';
import { describe, before, beforeEach, after, afterEach } from 'mocha';

import stubs from './stubs';
import { StorageType } from '../src/storage-type';
import { BrowserStorage } from '../src/browser-storage';
import KeyValueStorage from '../src/storage/keyvalue-storage';

describe('IndexedDB storage', () => {
	describe("indexedDB api tests", () => {
		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineIndexedDb();
		});

		afterEach(() => {
			stubs.undefineIndexedDb();
		});

		it.skip("can get storage api");
		// public canGetApi() {
		// 	// act
		// 	let storage = BrowserStorage.getStorage(StorageType.IndexedDB);

		// 	// assert
		// 	storage.should.not.be.null();
		// }
	});

	describe("indexedDB set tests", () => {
		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineIndexedDb();
		});

		afterEach(() => {
			stubs.undefineIndexedDb();
		});

		it.skip("can set a simple value");

		it.skip("can set simple values");
		
		it.skip("can set a complex value");
		
		it.skip("can set complex values");
		
		it.skip("will fail to set a value");
		
		it.skip("will fail to set some values");
	});

	describe("indexedDB get tests", () => {
		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineIndexedDb();
		});

		afterEach(() => {
			stubs.undefineIndexedDb();
		});

		it.skip("can get a simple value");
		
		it.skip("can get simple values");
		
		it.skip("can get a complex value");
		
		it.skip("can get complex values");
		
		it.skip("will fail to get a value");
		
		it.skip("will fail to get some values");
	});

	describe("indexedDB remove tests", () => {
		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineIndexedDb();
		});

		afterEach(() => {
			stubs.undefineIndexedDb();
		});

		it.skip("can remove a value");
		
		it.skip("can remove values");

		it.skip("will fail to remove value");

		it.skip("will fail to remove values");
	});

	describe("indexedDB clear tests", () => {
		before(() => {
			stubs.defineWindow();
		});

		after(() => {
			stubs.undefineWindow();
		});

		beforeEach(() => {
			stubs.defineIndexedDb();
		});

		afterEach(() => {
			stubs.undefineIndexedDb();
		});

		it.skip("can clear the storage");

		it.skip("will fail to clear the storage");
	});
});