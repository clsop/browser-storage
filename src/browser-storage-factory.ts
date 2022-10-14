import { StorageType } from './storage-type';

import ApiObject from './api/api-object';
import CookieStorageApi from './api/cookie-storage-api';
import LocalStorageApi from './api/local-storage-api';
import SessionStorageApi from './api/session-storage-api';
import IndexedDBStorageApi from './api/indexeddb-storage-api';
import BrowserStorage from '../typings/browser-storage';


export class BrowserStorageFactory implements BrowserStorage.BrowserStorageFactory {
	public static getStorage(type: StorageType = StorageType.Local): BrowserStorage.Storage {
		let apiObject: ApiObject;

		switch(type) {
			case StorageType.Local: apiObject = new LocalStorageApi(); break;
			case StorageType.Session: apiObject = new SessionStorageApi(); break;
			case StorageType.Cookie: apiObject = new CookieStorageApi(); break;
			//case StorageType.IndexedDB: apiObject = new IndexedDBStorageApi(); break;
			default: apiObject = new LocalStorageApi(); break;
		}

		return apiObject.use();
	}
}