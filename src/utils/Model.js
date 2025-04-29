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
exports.Model = exports.MODEL_STATUSES = exports.ModelStatus = void 0;
var History_1 = require("./History");
var ModelStatus;
(function (ModelStatus) {
    ModelStatus["Pristine"] = "pristine";
    ModelStatus["Modified"] = "modified";
    ModelStatus["Deleted"] = "deleted";
    ModelStatus["New"] = "new";
})(ModelStatus || (exports.ModelStatus = ModelStatus = {}));
exports.MODEL_STATUSES = Object.values(ModelStatus);
var Model = /** @class */ (function () {
    function Model(data, status, idGenerator, isNew) {
        if (status === void 0) { status = ModelStatus.Pristine; }
        if (idGenerator === void 0) { idGenerator = function () { return crypto.randomUUID(); }; }
        if (isNew === void 0) { isNew = false; }
        this.isNew = isNew;
        this.id = idGenerator();
        this.history = new History_1.History(__assign({}, data));
        this.status = status;
        if (status === ModelStatus.Pristine) {
            this.original = __assign({}, data);
        }
    }
    Object.defineProperty(Model.prototype, "current", {
        get: function () {
            return this.history.current;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "previous", {
        get: function () {
            return this.history.previous;
        },
        enumerable: false,
        configurable: true
    });
    Model.prototype.update = function (newValues) {
        this.history.update(newValues);
        this.status = ModelStatus.Modified;
    };
    Model.prototype.delete = function () {
        this.history.updateDeleted();
        this.status = ModelStatus.Deleted;
    };
    Model.prototype.restore = function () {
        this.status = this.original ? ModelStatus.Pristine : ModelStatus.New;
        if (this.history.current === null) {
            this.history.undo();
        }
        // If restoring from deleted after edits, maintain modified state
        if (this.original && JSON.stringify(this.history.current) !== JSON.stringify(this.original)) {
            this.status = ModelStatus.Modified;
        }
    };
    Object.defineProperty(Model.prototype, "canUndo", {
        get: function () {
            return this.history.canUndo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "canRedo", {
        get: function () {
            return this.history.canRedo;
        },
        enumerable: false,
        configurable: true
    });
    Model.prototype.undo = function () {
        if (!this.history.canUndo)
            return false;
        this.history.undo();
        if (this.history.current === null) {
            // Undoing to a deleted state
            this.status = ModelStatus.Deleted;
        }
        else {
            this.status = this.original && JSON.stringify(this.history.current) === JSON.stringify(this.original) ?
                ModelStatus.Pristine : ModelStatus.Modified;
        }
        return true;
    };
    Model.prototype.redo = function () {
        if (!this.history.canRedo)
            return false;
        this.history.redo();
        this.status = this.history.current === null ? ModelStatus.Deleted : ModelStatus.Modified;
        return true;
    };
    return Model;
}());
exports.Model = Model;
