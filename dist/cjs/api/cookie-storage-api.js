"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_object_1 = __importDefault(require("./api-object"));
var browser_api_error_1 = __importDefault(require("../exceptions/browser-api-error"));
var cookie_storage_1 = __importDefault(require("../storage/cookie-storage"));
var CookieStorageApi = (function (_super) {
    __extends(CookieStorageApi, _super);
    function CookieStorageApi() {
        return _super.call(this, null) || this;
    }
    CookieStorageApi.prototype.use = function () {
        if ("cookie" in document) {
            return new cookie_storage_1.default();
        }
        throw new browser_api_error_1.default("no browser storage api available!");
    };
    return CookieStorageApi;
}(api_object_1.default));
exports.default = CookieStorageApi;
