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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApiConfigStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
var immutable_1 = require("immutable");
function isApiConfig(config) {
    return (typeof config === 'object' &&
        config !== null &&
        'id' in config &&
        'name' in config &&
        'version' in config &&
        'entities' in config &&
        'security' in config);
}
exports.useApiConfigStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set, get) { return ({
    apis: {},
    addApi: function (api, id) {
        var _a;
        if (!get().isNameUnique(api.name)) {
            throw new Error("API name \"".concat(api.name, "\" already exists"));
        }
        // Validate relationships
        if (api.entities) {
            var entityNames = api.entities.map(function (e) { return e.name; });
            // First pass: Validate all targets exist
            for (var _i = 0, _b = api.entities; _i < _b.length; _i++) {
                var entity = _b[_i];
                if (entity.relationships) {
                    for (var _c = 0, _d = entity.relationships; _c < _d.length; _c++) {
                        var rel = _d[_c];
                        if (!entityNames.includes(rel.target)) {
                            throw new Error("Relationship target entity \"".concat(rel.target, "\" does not exist"));
                        }
                    }
                }
            }
            // Second pass: Validate inverse relationships
            for (var _e = 0, _f = api.entities; _e < _f.length; _e++) {
                var entity = _f[_e];
                if (entity.relationships) {
                    var _loop_1 = function (rel) {
                        if (rel.inverse) {
                            var targetEntity = api.entities.find(function (e) { return e.name === rel.target; });
                            if (targetEntity === null || targetEntity === void 0 ? void 0 : targetEntity.relationships) {
                                var inverseRel = targetEntity.relationships.find(function (r) { return r.name === rel.inverse; });
                                if (inverseRel && inverseRel.target !== entity.name) {
                                    throw new Error("Inverse relationship mismatch between User.posts and Post.author");
                                }
                                if (!inverseRel) {
                                    throw new Error("Inverse relationship mismatch between ".concat(rel.target, ".").concat(rel.name, " and ").concat(entity.name, ".").concat(rel.inverse));
                                }
                            }
                        }
                    };
                    for (var _g = 0, _h = entity.relationships; _g < _h.length; _g++) {
                        var rel = _h[_g];
                        _loop_1(rel);
                    }
                }
            }
        }
        var finalId = id || crypto.randomUUID();
        var now = new Date().toISOString();
        var newApi = __assign(__assign({}, api), { id: finalId, createdAt: now, updatedAt: now, entities: ((_a = api.entities) === null || _a === void 0 ? void 0 : _a.map(function (entity) { return (__assign(__assign({}, entity), { relationships: entity.relationships || [] })); })) || [] });
        set(function (state) {
            var _a;
            return ({
                apis: __assign(__assign({}, state.apis), (_a = {}, _a[finalId] = newApi, _a))
            });
        });
        return finalId;
    },
    updateApi: function (id, updates) {
        set(function (state) {
            var _a;
            var existing = state.apis[id];
            if (!existing)
                return state;
            if (updates.name && !get().isNameUnique(updates.name, id)) {
                throw new Error("API name \"".concat(updates.name, "\" already exists"));
            }
            // Ensure updatedAt is different from createdAt
            var updatedAt = new Date().toISOString();
            while (updatedAt === existing.createdAt) {
                updatedAt = new Date().toISOString();
            }
            return {
                apis: __assign(__assign({}, state.apis), (_a = {}, _a[id] = __assign(__assign(__assign({}, existing), updates), { updatedAt: updatedAt }), _a))
            };
        });
    },
    removeApi: function (id) {
        set(function (state) {
            var _a = state.apis, _b = id, _ = _a[_b], remaining = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            void _; // Explicitly ignore the unused variable
            return {
                apis: remaining
            };
        });
    },
    getApi: function (id) {
        var api = get().apis[id];
        if (!api)
            return undefined;
        var apiData = (0, immutable_1.fromJS)(api).toJS();
        if (!isApiConfig(apiData)) {
            console.warn('Invalid API config structure', apiData);
            return undefined;
        }
        // Ensure all entities have relationships array
        if (apiData.entities) {
            apiData.entities = apiData.entities.map(function (entity) { return (__assign(__assign({}, entity), { relationships: entity.relationships || [] })); });
        }
        return apiData;
    },
    getApiByName: function (name) {
        var api = Object.values(get().apis).find(function (api) { return api.name === name; });
        if (!api)
            return undefined;
        var apiData = (0, immutable_1.fromJS)(api).toJS();
        if (!isApiConfig(apiData)) {
            console.warn('Invalid API config structure', apiData);
            return undefined;
        }
        return apiData;
    },
    createVersion: function (id, newVersion) {
        var existing = get().apis[id];
        if (!existing)
            throw new Error("API ".concat(id, " not found"));
        var newId = crypto.randomUUID();
        var now = new Date().toISOString();
        var newApi = __assign(__assign({}, existing), { id: newId, version: newVersion, createdAt: now, updatedAt: now });
        set(function (state) {
            var _a;
            return ({
                apis: __assign(__assign({}, state.apis), (_a = {}, _a[newId] = newApi, _a))
            });
        });
        return newApi;
    },
    isNameUnique: function (name, excludeId) {
        return !Object.values(get().apis).some(function (api) { return api.name === name && api.id !== excludeId; });
    }
}); }, {
    name: 'api-config-store',
    version: 1
}));
