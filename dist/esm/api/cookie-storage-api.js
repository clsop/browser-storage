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
import BrowserApiError from '../exceptions/browser-api-error';
import CookieStorage from '../storage/cookie-storage';
var CookieStorageApi = (function (_super) {
    __extends(CookieStorageApi, _super);
    function CookieStorageApi() {
        return _super.call(this, null) || this;
    }
    CookieStorageApi.prototype.use = function () {
        if ("cookie" in document) {
            return new CookieStorage();
        }
        throw new BrowserApiError("no browser storage api available!");
    };
    return CookieStorageApi;
}(ApiObject));
export default CookieStorageApi;
