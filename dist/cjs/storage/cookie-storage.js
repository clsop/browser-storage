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
var CookieStorage = (function (_super) {
    __extends(CookieStorage, _super);
    function CookieStorage() {
        var _this = _super.call(this, storage_type_1.StorageType.Cookie) || this;
        _this.COOKIE_PART = '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';
        _this.cookies = {};
        _this.initializeCookies();
        return _this;
    }
    CookieStorage.prototype.initializeCookies = function () {
        for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
            aCouple = aCouples[nIdx].split(/\s*=\s*/);
            if (aCouple.length > 1) {
                this.cookies[iKey = decodeURI(aCouple[0])] = decodeURI(aCouple[1]);
            }
        }
        return this.cookies;
    };
    CookieStorage.prototype.foundOrNot = function (key, values) {
        var value = this.cookies[key] ? this.cookies[key] : this.initializeCookies()[key];
        if (value !== undefined) {
            values.push({ key: key, value: value });
        }
        else {
            values.push({ key: key, error: "".concat(storage_type_1.StorageType[this.storageType], " storage: value with key \"").concat(key, "\" was not found!") });
        }
        return values;
    };
    CookieStorage.prototype.get = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.asArray(key, function (keys) {
                var values = [];
                for (var index in keys) {
                    _this.foundOrNot(keys[index], values);
                }
                if (values.filter(function (value) { return value.error !== undefined; }).length === values.length) {
                    reject(values);
                }
                resolve(values);
            }, function (key) {
                var value = _this.foundOrNot(key, [])[0];
                if (value.error !== undefined) {
                    reject(value);
                }
                else {
                    resolve(value);
                }
            });
        });
    };
    CookieStorage.prototype.set = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.asArray(data, function (keyValues) {
                for (var index in keyValues) {
                    var key = keyValues[index].key;
                    var value = keyValues[index].value;
                    document.cookie = "".concat(key, "=").concat(JSON.stringify(value)).concat(_this.COOKIE_PART);
                }
                resolve(keyValues);
            }, function (keyValue) {
                document.cookie = "".concat(keyValue.key, "=").concat(JSON.stringify(keyValue.value)).concat(_this.COOKIE_PART);
                resolve(keyValue);
            });
        });
    };
    CookieStorage.prototype.count = function () {
        return new Promise(function (resolve, reject) {
        });
    };
    CookieStorage.prototype.remove = function (key) {
        return new Promise(function (resolve, reject) {
        });
    };
    CookieStorage.prototype.clear = function () {
        return new Promise(function (resolve, reject) {
        });
    };
    return CookieStorage;
}(base_storage_1.default));
exports.default = CookieStorage;
