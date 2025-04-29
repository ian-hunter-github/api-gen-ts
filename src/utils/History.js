"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
var History = /** @class */ (function () {
    function History(initial) {
        if (initial === null || initial === undefined) {
            throw new Error('History cannot be initialized with null or undefined');
        }
        this.history = [initial];
        this.currentIndex = 0;
    }
    Object.defineProperty(History.prototype, "current", {
        get: function () {
            return this.history[this.currentIndex];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "previous", {
        get: function () {
            return this.currentIndex > 0 ? this.history[this.currentIndex - 1] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "canUndo", {
        get: function () {
            return this.currentIndex > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "canRedo", {
        get: function () {
            return this.currentIndex < this.history.length - 1;
        },
        enumerable: false,
        configurable: true
    });
    History.prototype.update = function (partial) {
        if (partial === null || partial === undefined) {
            throw new Error('Use updateDeleted() for null updates');
        }
        // Create new state by merging changes
        var newState = this.current ? __assign(__assign({}, this.current), partial) : partial;
        // Skip if new state is same as current
        if (JSON.stringify(newState) === JSON.stringify(this.current)) {
            return;
        }
        // If not at end of history, truncate future states
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        this.history.push(newState);
        this.currentIndex++;
    };
    History.prototype.updateDeleted = function () {
        // Skip if already deleted
        if (this.current === null) {
            return;
        }
        // If not at end of history, truncate future states
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        this.history.push(null);
        this.currentIndex++;
    };
    History.prototype.undo = function () {
        if (!this.canUndo)
            return null;
        this.currentIndex--;
        return this.current;
    };
    History.prototype.redo = function () {
        if (!this.canRedo)
            return null;
        this.currentIndex++;
        return this.current;
    };
    Object.defineProperty(History.prototype, "historyLength", {
        get: function () {
            return this.history.length;
        },
        enumerable: false,
        configurable: true
    });
    return History;
}());
exports.History = History;
