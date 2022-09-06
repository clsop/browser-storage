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
var indexeddb_storage_1 = __importDefault(require("../storage/indexeddb-storage"));
var local_storage_api_1 = __importDefault(require("./local-storage-api"));
var SessionStorageApi = (function (_super) {
    __extends(SessionStorageApi, _super);
    function SessionStorageApi() {
        return _super.call(this, new local_storage_api_1.default()) || this;
    }
    SessionStorageApi.prototype.use = function () {
        if ("indexedDB" in window) {
            return new indexeddb_storage_1.default(window.indexedDB);
        }
        return this.nextApi.use();
    };
    return SessionStorageApi;
}(api_object_1.default));
exports.default = SessionStorageApi;
