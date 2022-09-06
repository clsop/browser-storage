import { StorageType } from './storage-type';
import CookieStorageApi from './api/cookie-storage-api';
import LocalStorageApi from './api/local-storage-api';
import SessionStorageApi from './api/session-storage-api';
var BrowserStorageFactory = (function () {
    function BrowserStorageFactory() {
    }
    BrowserStorageFactory.getStorage = function (type) {
        if (type === void 0) { type = StorageType.Local; }
        var apiObject;
        switch (type) {
            case StorageType.Local:
                apiObject = new LocalStorageApi();
                break;
            case StorageType.Session:
                apiObject = new SessionStorageApi();
                break;
            case StorageType.Cookie:
                apiObject = new CookieStorageApi();
                break;
            default:
                apiObject = new LocalStorageApi();
                break;
        }
        return apiObject.use();
    };
    return BrowserStorageFactory;
}());
export { BrowserStorageFactory };
