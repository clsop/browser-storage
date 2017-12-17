import { describe, it, before } from 'mocha';
import * as sinon from 'sinon';

import CookieStorageApi from '../src/api/cookie-storage-api';
import LocalStorageApi from '../src/api/local-storage-api';
import SessionStorageApi from '../src/api/session-storage-api';
import IndexedDBStorageApi from '../src/api/indexeddb-storage-api';

describe('Api fallbacks', () => {
	it('localStorage to cookie');

	it('sessionStorage to cookie');

	it('indexedDB to localStorage');

	it('cookie to none');
});