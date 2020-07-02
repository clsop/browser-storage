import 'should';
import { describe } from 'mocha';

import stubs from './stubs';
import { StorageType } from '../src/storage-type';
import { BrowserStorage } from '../src/browser-storage';
import KeyValueStorage from '../src/storage/keyvalue-storage';

describe('IndexedDB storage', () => {
	@suite("indexedDB api tests")
	class IndexedDbApiTests {
		public static before() {
			stubs.defineWindow();
		}

		public static after() {
			stubs.undefineWindow();
		}

		public before() {
			stubs.defineIndexedDb();
		}

		public after() {
			stubs.undefineIndexedDb();
		}

		// @test("can get storage api")
		// public canGetApi() {
		// 	// act
		// 	let storage = BrowserStorage.getStorage(StorageType.IndexedDB);

		// 	// assert
		// 	storage.should.not.be.null();
		// }
	}

	@suite("indexedDB set tests")
	class IndexedDbSetTests {
		public static before() {
			stubs.defineWindow();
		}

		public static after() {
			stubs.undefineWindow();
		}

		public before() {
			stubs.defineIndexedDb();
		}

		public after() {
			stubs.undefineIndexedDb();
		}

		//@test("can set a simple value")
		@test.skip()
		public canSetValue() {
		}

		//@test("can set simple values")
		@test.skip()
		public canSetValues() {
		}

		//@test("can set a complex value")
		@test.skip()
		public canSetComplexValue() {
		}

		//@test("can set complex values")
		@test.skip()
		public canSetComplexValues() {
		}

		//@test("will fail to set a value")
		@test.skip()
		public willFailSetValue() {
		}

		//@test("will fail to set some values")
		@test.skip()
		public willFailSetValues() {
		}
	}

	@suite("indexedDB get tests")
	class IndexedDbGetTests {
		public static before() {
			stubs.defineWindow();
		}

		public static after() {
			stubs.undefineWindow();
		}

		public before() {
			stubs.defineIndexedDb();
		}

		public after() {
			stubs.undefineIndexedDb();
		}

		//@test("can get a simple value")
		@test.skip()
		public canGetValue() {
		}

		//@test("can get simple values")
		@test.skip()
		public canGetValues() {
		}

		//@test("can get a complex value")
		@test.skip()
		public canGetComplexValue() {
		}

		//@test("can get complex values")
		@test.skip()
		public canGetComplexValues() {
		}

		//@test("will fail to get a value")
		@test.skip()
		public willFailGetValue() {
		}

		//@test("will fail to get some values")
		@test.skip()
		public willFailGetValues() {
		}
	}

	@suite("indexedDB remove tests")
	class IndexedDbRemoveTests {
		public static before() {
			stubs.defineWindow();
		}

		public static after() {
			stubs.undefineWindow();
		}

		public before() {
			stubs.defineIndexedDb();
		}

		public after() {
			stubs.undefineIndexedDb();
		}

		//@test("can remove a value")
		@test.skip()
		public canRemoveValue() {
		}

		//@test("can remove values")
		@test.skip()
		public canRemoveValues() {
		}

		//@test("will fail to remove value")
		@test.skip()
		public willFailRemoveValue() {
		}

		//@test("will fail to remove values")
		@test.skip()
		public willFailRemoveValues() {
		}
	}

	@suite("indexedDB clear tests")
	class IndexedDbClearTests {
		public static before() {
			stubs.defineWindow();
		}

		public static after() {
			stubs.undefineWindow();
		}

		public before() {
			stubs.defineIndexedDb();
		}

		public after() {
			stubs.undefineIndexedDb();
		}

		//@test("can clear the storage")
		@test.skip()
		public canClear() {
		}

		//@test("will fail to clear the storage")
		@test.skip()
		public wilFailClear() {
		}
	}
});