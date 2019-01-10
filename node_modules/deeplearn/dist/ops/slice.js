"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var operation_1 = require("./operation");
var slice_util = require("./slice_util");
var SliceOps = (function () {
    function SliceOps() {
    }
    SliceOps.slice1d = function (x, begin, size) {
        util.assert(x.rank === 1, "slice1d expects a rank-1 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, [begin], [size]);
    };
    SliceOps.slice2d = function (x, begin, size) {
        util.assert(x.rank === 2, "slice1d expects a rank-2 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice3d = function (x, begin, size) {
        util.assert(x.rank === 3, "slice1d expects a rank-3 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice4d = function (x, begin, size) {
        util.assert(x.rank === 4, "slice1d expects a rank-4 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice = function (x, begin, size) {
        slice_util.assertParamsValid(x, begin, size);
        if (x.rank === 0) {
            throw new Error('Slicing scalar is not possible');
        }
        var inputShape = x.shape;
        var grad = function (dy) {
            var paddings = [];
            for (var i = 0; i < dy.rank; i++) {
                paddings.push([begin[i], inputShape[i] - begin[i] - size[i]]);
            }
            return { x: function () { return dy.pad(paddings); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.slice(x, begin, size); }, { x: x }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], SliceOps, "slice", null);
    return SliceOps;
}());
exports.SliceOps = SliceOps;
