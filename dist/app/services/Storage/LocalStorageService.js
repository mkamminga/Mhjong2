"use strict";
var LocalStorageService = (function () {
    function LocalStorageService() {
    }
    LocalStorageService.prototype.getValue = function (key) {
        return localStorage.getItem(key);
    };
    LocalStorageService.prototype.setValue = function (key, value) {
        localStorage.setItem(key, value);
    };
    LocalStorageService.prototype.remove = function (key) {
        localStorage.removeItem(key);
    };
    LocalStorageService.prototype.clear = function () {
        localStorage.clear();
    };
    return LocalStorageService;
}());
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=LocalStorageService.js.map