var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import ApiObject from './api-object';
import IndexedDBStorage from '../storage/indexeddb-storage';
import LocalStorageApi from './local-storage-api';
var SessionStorageApi = (function (_super) {
    __extends(SessionStorageApi, _super);
    function SessionStorageApi() {
        return _super.call(this, new LocalStorageApi()) || this;
    }
    SessionStorageApi.prototype.use = function () {
        if ("indexedDB" in window) {
            return new IndexedDBStorage(window.indexedDB);
        }
        return this.nextApi.use();
    };
    return SessionStorageApi;
}(ApiObject));
export default SessionStorageApi;
