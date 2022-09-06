export var StorageType;
(function (StorageType) {
    StorageType[StorageType["Cookie"] = 0] = "Cookie";
    StorageType[StorageType["Local"] = 1] = "Local";
    StorageType[StorageType["Session"] = 2] = "Session";
    StorageType[StorageType["IndexedDB"] = 3] = "IndexedDB";
})(StorageType || (StorageType = {}));
