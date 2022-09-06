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
var KeyValueStorage = (function (_super) {
    __extends(KeyValueStorage, _super);
    function KeyValueStorage(storage, type) {
        var _this = _super.call(this, type) || this;
        _this.storage = storage;
        return _this;
    }
    KeyValueStorage.prototype.parseValue = function (rawValue) {
        var value = null;
        try {
            value = JSON.parse(rawValue);
        }
        catch (ex) {
            value = rawValue;
        }
        return value;
    };
    KeyValueStorage.prototype.get = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.asArray(key, function (keys) {
                var values = [];
                var errors = [];
                for (var index in keys) {
                    var key_1 = keys[index];
                    var value = _this.parseValue(_this.storage.getItem(key_1));
                    if (value !== null) {
                        values.push({ key: key_1, value: value });
                    }
                    else {
                        errors.push({ key: key_1, error: "".concat(storage_type_1.StorageType[_this.storageType], " storage: value with key \"").concat(key_1, "\" was not found!") });
                    }
                }
                if (errors.length === keys.length) {
                    reject(errors);
                }
                else if (errors.length > 0) {
                    values.push.apply(values, errors);
                    resolve(values);
                }
                else {
                    resolve(values);
                }
            }, function (key) {
                var value = _this.parseValue(_this.storage.getItem(key));
                if (value !== null) {
                    resolve({ key: key, value: value });
                }
                else {
                    reject({ key: key, error: "".concat(storage_type_1.StorageType[_this.storageType], " storage: value with key \"").concat(key, "\" was not found!") });
                }
            });
        });
    };
    KeyValueStorage.prototype.set = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.asArray(data, function (data) {
                var values = [];
                var errors = [];
                for (var index in data) {
                    var key = data[index].key;
                    var value = typeof data[index].value !== "string" ?
                        JSON.stringify(data[index].value) : data[index].value;
                    try {
                        _this.storage.setItem(key, value);
                        values.push({ key: key, value: data[index].value });
                    }
                    catch (ex) {
                        errors.push({ key: key, error: "".concat(storage_type_1.StorageType[_this.storageType], " storage: value with key \"").concat(key, "\" could not be set!") });
                    }
                }
                if (errors.length === data.length) {
                    reject(errors);
                }
                else if (errors.length > 0) {
                    values.push.apply(values, errors);
                    resolve(values);
                }
                else {
                    resolve(values);
                }
            }, function (data) {
                try {
                    var value = typeof data.value !== "string" ?
                        JSON.stringify(data.value) : data.value;
                    _this.storage.setItem(data.key, value);
                }
                catch (ex) {
                    reject({ key: data.key, error: "".concat(storage_type_1.StorageType[_this.storageType], " storage: value with key \"").concat(data.key, "\" could not be set!") });
                }
                resolve({ key: data.key, value: data.value });
            });
        });
    };
    KeyValueStorage.prototype.count = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve({ value: _this.storage.length });
        });
    };
    KeyValueStorage.prototype.remove = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.asArray(key, function (keys) {
                var removedKeys = [];
                var errors = [];
                for (var index in keys) {
                    var key_2 = keys[index];
                    if (_this.storage.getItem(key_2) !== null) {
                        _this.storage.removeItem(key_2);
                        removedKeys.push({ key: key_2 });
                    }
                    else {
                        errors.push({ key: key_2, error: "".concat(storage_type_1.StorageType[_this.storageType], " storage: value with key \"").concat(key_2, "\" could not be removed!") });
                    }
                }
                if (errors.length === keys.length) {
                    reject(errors);
                }
                else if (errors.length > 0) {
                    removedKeys.push.apply(removedKeys, errors);
                    resolve(removedKeys);
                }
                else {
                    resolve(removedKeys);
                }
            }, function (key) {
                if (_this.storage.getItem(key) !== null) {
                    _this.storage.removeItem(key);
                    resolve({ key: key });
                }
                else {
                    reject({ key: key, error: "".concat(storage_type_1.StorageType[_this.storageType], " storage: value with key \"").concat(key, "\" could not be removed!") });
                }
            });
        });
    };
    KeyValueStorage.prototype.clear = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.clear();
            resolve();
        });
    };
    return KeyValueStorage;
}(base_storage_1.default));
exports.default = KeyValueStorage;
