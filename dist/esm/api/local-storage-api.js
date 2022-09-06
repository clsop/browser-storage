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
import { StorageType } from '../storage-type';
import CookieStorageApi from './cookie-storage-api';
import KeyValueStorage from '../storage/keyvalue-storage';
var LocalStorageApi = (function (_super) {
    __extends(LocalStorageApi, _super);
    function LocalStorageApi() {
        return _super.call(this, new CookieStorageApi()) || this;
    }
    LocalStorageApi.prototype.use = function () {
        if ("localStorage" in window &&
            "setItem" in window.localStorage &&
            "getItem" in window.localStorage &&
            "removeItem" in window.localStorage &&
            "clear" in window.localStorage) {
            return new KeyValueStorage(window.localStorage, StorageType.Local);
        }
        return this.nextApi.use();
    };
    return LocalStorageApi;
}(ApiObject));
export default LocalStorageApi;
