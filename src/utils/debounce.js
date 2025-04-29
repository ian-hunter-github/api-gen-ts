"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
var debounce = function (func, wait) {
    var timeout = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () { return func.apply(void 0, args); }, wait);
    };
};
exports.debounce = debounce;
