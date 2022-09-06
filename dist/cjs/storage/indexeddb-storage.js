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
var base_storage_1 = __importDefault(require("./base-storage"));
var storage_type_1 = require("../storage-type");
var IndexedDBStorage = (function (_super) {
    __extends(IndexedDBStorage, _super);
    function IndexedDBStorage(indexedDB) {
        var _this = _super.call(this, storage_type_1.StorageType.IndexedDB) || this;
        _this.indexedDB = indexedDB;
        return _this;
    }
    IndexedDBStorage.prototype.get = function (key) {
        return new Promise(function (resolve, reject) {
        });
    };
    IndexedDBStorage.prototype.set = function (data) {
        return new Promise(function (resolve, reject) {
        });
    };
    IndexedDBStorage.prototype.count = function () {
        return new Promise(function (resolve, reject) {
        });
    };
    IndexedDBStorage.prototype.remove = function (key) {
        return new Promise(function (resolve, reject) {
        });
    };
    IndexedDBStorage.prototype.clear = function () {
        return new Promise(function (resolve, reject) {
        });
    };
    return IndexedDBStorage;
}(base_storage_1.default));
exports.default = IndexedDBStorage;
