"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStorageFactory = void 0;
var storage_type_1 = require("./storage-type");
var cookie_storage_api_1 = __importDefault(require("./api/cookie-storage-api"));
var local_storage_api_1 = __importDefault(require("./api/local-storage-api"));
var session_storage_api_1 = __importDefault(require("./api/session-storage-api"));
var BrowserStorageFactory = (function () {
    function BrowserStorageFactory() {
    }
    BrowserStorageFactory.getStorage = function (type) {
        if (type === void 0) { type = storage_type_1.StorageType.Local; }
        var apiObject;
        switch (type) {
            case storage_type_1.StorageType.Local:
                apiObject = new local_storage_api_1.default();
                break;
            case storage_type_1.StorageType.Session:
                apiObject = new session_storage_api_1.default();
                break;
            case storage_type_1.StorageType.Cookie:
                apiObject = new cookie_storage_api_1.default();
                break;
            default:
                apiObject = new local_storage_api_1.default();
                break;
        }
        return apiObject.use();
    };
    return BrowserStorageFactory;
}());
exports.BrowserStorageFactory = BrowserStorageFactory;
