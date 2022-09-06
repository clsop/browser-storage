"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseStorage = (function () {
    function BaseStorage(type) {
        this.asArray = function (typeAsValue, aPredicate, vPredicate) {
            if (typeAsValue instanceof Array) {
                aPredicate(typeAsValue);
            }
            else {
                vPredicate(typeAsValue);
            }
        };
        this.storageType = type;
    }
    return BaseStorage;
}());
exports.default = BaseStorage;
