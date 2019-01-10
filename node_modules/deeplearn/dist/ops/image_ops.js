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
var ImageOps = (function () {
    function ImageOps() {
    }
    ImageOps.resizeBilinear = function (images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        util.assert(images.rank === 3 || images.rank === 4, "Error in resizeBilinear: x must be rank 3 or 4, but got " +
            ("rank " + images.rank + "."));
        util.assert(size.length === 2, "Error in resizeBilinear: new shape must 2D, but got shape " +
            (size + "."));
        var batchImages = images;
        var reshapedTo4D = false;
        if (images.rank === 3) {
            reshapedTo4D = true;
            batchImages =
                images.as4D(1, images.shape[0], images.shape[1], images.shape[2]);
        }
        var newHeight = size[0], newWidth = size[1];
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.resizeBilinear(batchImages, newHeight, newWidth, alignCorners); }, { batchImages: batchImages });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Images', namespace: 'image' }),
        operation_1.operation
    ], ImageOps, "resizeBilinear", null);
    return ImageOps;
}());
exports.ImageOps = ImageOps;
