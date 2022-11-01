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
import BaseStorage from "./base-storage";
import { StorageType } from "../storage-type";
import CookieOptions from "../options/cookie-options";
var CookieStorage = (function (_super) {
    __extends(CookieStorage, _super);
    function CookieStorage() {
        var _this = _super.call(this, StorageType.Cookie) || this;
        _this.keySplit = /\s*=\s*/;
        _this.cookies = {};
        _this.initializeCookies();
        return _this;
    }
    CookieStorage.prototype.initializeCookies = function () {
        var rawCookies = document.cookie.split("\r");
        if (rawCookies.length > 0 && rawCookies[0] !== '') {
            for (var i = 0; i < rawCookies.length; i++) {
                var rawCookie = rawCookies[i];
                var cookie = {};
                var aCouples = rawCookie.split(/\s*;\s*/);
                for (var aCouple = void 0, iKey = void 0, nIdx = 0; nIdx < aCouples.length; nIdx++) {
                    aCouple = aCouples[nIdx].split(this.keySplit);
                    if (aCouple.length > 1) {
                        cookie[(iKey = decodeURI(aCouple[0]))] = decodeURI(aCouple[1]);
                    }
                }
                this.cookies[aCouples[0].split(this.keySplit)[0]] = cookie;
            }
        }
        return this.cookies;
    };
    CookieStorage.prototype.foundOrNot = function (key, values) {
        var cookie = this.cookies[key]
            ? this.cookies[key]
            : this.initializeCookies()[key];
        if (cookie && key in cookie) {
            values.push({ key: key, value: JSON.parse(cookie[key]) });
        }
        else {
            values.push({
                key: key,
                error: "".concat(StorageType[this.storageType], " storage: value with key \"").concat(key, "\" was not found!"),
            });
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
                if (values.filter(function (value) { return value.error !== undefined; }).length ===
                    values.length) {
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
    CookieStorage.prototype.set = function (data, options) {
        var _this = this;
        var cookieOptions = new CookieOptions(options);
        return new Promise(function (resolve, reject) {
            _this.asArray(data, function (keyValues) {
                for (var index in keyValues) {
                    document.cookie = cookieOptions.create(keyValues[index]);
                }
                resolve(keyValues);
            }, function (keyValue) {
                document.cookie = cookieOptions.create(keyValue);
                resolve(keyValue);
            });
        });
    };
    CookieStorage.prototype.count = function () {
        return new Promise(function (resolve, reject) {
            resolve({ value: document.cookie.split("/r").length });
        });
    };
    CookieStorage.prototype.remove = function (key) {
        var _this = this;
        var cookieOptions = new CookieOptions({
            maxAge: 0
        });
        return new Promise(function (resolve, reject) {
            _this.asArray(key, function (keys) {
                var keyValues = [];
                for (var index in keys) {
                    _this.foundOrNot(keys[index], keyValues);
                    if (keyValues.length > 0) {
                        for (var _i = 0, keyValues_1 = keyValues; _i < keyValues_1.length; _i++) {
                            var valuePair = keyValues_1[_i];
                            var keyValue = { key: valuePair.key, value: valuePair.value };
                            if (!keyValue.error) {
                                document.cookie = cookieOptions.create({ key: keyValue.key, value: keyValue.value });
                            }
                        }
                    }
                }
                resolve(keyValues);
            }, function (key) {
                var valuePair = _this.foundOrNot(key, [])[0];
                if (!valuePair.error) {
                    document.cookie = cookieOptions.create({ key: valuePair.key, value: valuePair.value });
                    resolve(valuePair);
                }
                else {
                    reject(valuePair);
                }
            });
        });
    };
    CookieStorage.prototype.clear = function () {
        return new Promise(function (resolve, reject) {
            reject({ error: "cannot clear all cookies!" });
        });
    };
    return CookieStorage;
}(BaseStorage));
export default CookieStorage;
