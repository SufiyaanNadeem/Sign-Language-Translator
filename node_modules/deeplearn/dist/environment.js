"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var device_util = require("./device_util");
var doc_1 = require("./doc");
var engine_1 = require("./engine");
var math_1 = require("./math");
var util = require("./util");
var Type;
(function (Type) {
    Type[Type["NUMBER"] = 0] = "NUMBER";
    Type[Type["BOOLEAN"] = 1] = "BOOLEAN";
    Type[Type["STRING"] = 2] = "STRING";
})(Type = exports.Type || (exports.Type = {}));
exports.URL_PROPERTIES = [
    { name: 'DEBUG', type: Type.BOOLEAN },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', type: Type.BOOLEAN },
    { name: 'WEBGL_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_FLOAT_TEXTURE_ENABLED', type: Type.BOOLEAN }, {
        name: 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED',
        type: Type.BOOLEAN
    },
    { name: 'BACKEND', type: Type.STRING }
];
function hasExtension(gl, extensionName) {
    var ext = gl.getExtension(extensionName);
    return ext != null;
}
function getWebGLRenderingContext(webGLVersion) {
    if (webGLVersion === 0) {
        throw new Error('Cannot get WebGL rendering context, WebGL is disabled.');
    }
    var tempCanvas = document.createElement('canvas');
    if (webGLVersion === 1) {
        return (tempCanvas.getContext('webgl') ||
            tempCanvas.getContext('experimental-webgl'));
    }
    return tempCanvas.getContext('webgl2');
}
function loseContext(gl) {
    if (gl != null) {
        var loseContextExtension = gl.getExtension('WEBGL_lose_context');
        if (loseContextExtension == null) {
            throw new Error('Extension WEBGL_lose_context not supported on this browser.');
        }
        loseContextExtension.loseContext();
    }
}
function isWebGLVersionEnabled(webGLVersion) {
    var gl = getWebGLRenderingContext(webGLVersion);
    if (gl != null) {
        loseContext(gl);
        return true;
    }
    return false;
}
function getWebGLDisjointQueryTimerVersion(webGLVersion) {
    if (webGLVersion === 0) {
        return 0;
    }
    var queryTimerVersion;
    var gl = getWebGLRenderingContext(webGLVersion);
    if (hasExtension(gl, 'EXT_disjoint_timer_query_webgl2') &&
        webGLVersion === 2) {
        queryTimerVersion = 2;
    }
    else if (hasExtension(gl, 'EXT_disjoint_timer_query')) {
        queryTimerVersion = 1;
    }
    else {
        queryTimerVersion = 0;
    }
    if (gl != null) {
        loseContext(gl);
    }
    return queryTimerVersion;
}
function isFloatTextureReadPixelsEnabled(webGLVersion) {
    if (webGLVersion === 0) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion);
    if (webGLVersion === 1) {
        if (!hasExtension(gl, 'OES_texture_float')) {
            return false;
        }
    }
    else {
        if (!hasExtension(gl, 'EXT_color_buffer_float')) {
            return false;
        }
    }
    var frameBuffer = gl.createFramebuffer();
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var internalFormat = webGLVersion === 2 ? gl.RGBA32F : gl.RGBA;
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    var frameBufferComplete = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4));
    var readPixelsNoError = gl.getError() === gl.NO_ERROR;
    loseContext(gl);
    return frameBufferComplete && readPixelsNoError;
}
function isWebGLGetBufferSubDataAsyncExtensionEnabled(webGLVersion) {
    if (webGLVersion !== 2) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion);
    var isEnabled = hasExtension(gl, 'WEBGL_get_buffer_sub_data_async');
    loseContext(gl);
    return isEnabled;
}
var SUPPORTED_BACKENDS = ['webgl', 'cpu'];
var Environment = (function () {
    function Environment(features) {
        this.features = {};
        this.BACKEND_REGISTRY = {};
        this.backends = this.BACKEND_REGISTRY;
        if (features != null) {
            this.features = features;
        }
        if (this.get('DEBUG')) {
            console.warn('Debugging mode is ON. The output of every math call will ' +
                'be downloaded to CPU and checked for NaNs. ' +
                'This significantly impacts performance.');
        }
    }
    Environment.setBackend = function (backendType, safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        if (!(backendType in exports.ENV.backends)) {
            throw new Error("Backend type '" + backendType + "' not found in registry");
        }
        exports.ENV.globalMath = new math_1.NDArrayMath(backendType, safeMode);
    };
    Environment.getBackend = function () {
        exports.ENV.initEngine();
        return exports.ENV.currentBackendType;
    };
    Environment.memory = function () {
        return exports.ENV.engine.memory();
    };
    Environment.prototype.get = function (feature) {
        if (feature in this.features) {
            return this.features[feature];
        }
        this.features[feature] = this.evaluateFeature(feature);
        return this.features[feature];
    };
    Environment.prototype.set = function (feature, value) {
        this.features[feature] = value;
    };
    Environment.prototype.getBestBackendType = function () {
        for (var i = 0; i < SUPPORTED_BACKENDS.length; ++i) {
            var backendId = SUPPORTED_BACKENDS[i];
            if (backendId in this.backends) {
                return backendId;
            }
        }
        throw new Error('No backend found in registry.');
    };
    Environment.prototype.evaluateFeature = function (feature) {
        if (feature === 'DEBUG') {
            return false;
        }
        else if (feature === 'BACKEND') {
            return this.getBestBackendType();
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') {
            var webGLVersion = this.get('WEBGL_VERSION');
            if (webGLVersion === 0) {
                return 0;
            }
            return getWebGLDisjointQueryTimerVersion(webGLVersion);
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE') {
            return this.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0 &&
                !device_util.isMobile();
        }
        else if (feature === 'WEBGL_VERSION') {
            if (isWebGLVersionEnabled(2)) {
                return 2;
            }
            else if (isWebGLVersionEnabled(1)) {
                return 1;
            }
            return 0;
        }
        else if (feature === 'WEBGL_FLOAT_TEXTURE_ENABLED') {
            return isFloatTextureReadPixelsEnabled(this.get('WEBGL_VERSION'));
        }
        else if (feature === 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED') {
            return isWebGLGetBufferSubDataAsyncExtensionEnabled(this.get('WEBGL_VERSION'));
        }
        throw new Error("Unknown feature " + feature + ".");
    };
    Environment.prototype.setFeatures = function (features) {
        this.reset();
        this.features = features;
        this.backends = {};
    };
    Environment.prototype.reset = function () {
        this.features = getFeaturesFromURL();
        if (this.globalMath != null) {
            this.globalMath.dispose();
            this.globalMath = null;
            this.globalEngine = null;
        }
        if (this.backends !== this.BACKEND_REGISTRY) {
            for (var name_1 in this.backends) {
                this.backends[name_1].dispose();
            }
            this.backends = this.BACKEND_REGISTRY;
        }
    };
    Environment.prototype.setMath = function (math, backend, safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        if (this.globalMath === math) {
            return;
        }
        var customBackend = false;
        if (typeof backend === 'string') {
            this.currentBackendType = backend;
            backend = exports.ENV.findBackend(backend);
        }
        else {
            customBackend = true;
            this.currentBackendType = 'custom';
        }
        this.globalEngine = new engine_1.Engine(backend, customBackend, safeMode);
        this.globalMath = math;
    };
    Environment.prototype.findBackend = function (name) {
        return this.backends[name];
    };
    Environment.prototype.addCustomBackend = function (name, factory) {
        if (name in this.backends) {
            throw new Error(name + " backend was already registered");
        }
        try {
            var backend = factory();
            this.backends[name] = backend;
            return true;
        }
        catch (err) {
            return false;
        }
    };
    Environment.prototype.registerBackend = function (name, factory) {
        if (name in this.BACKEND_REGISTRY) {
            throw new Error(name + " backend was already registered as global");
        }
        try {
            var backend = factory();
            this.BACKEND_REGISTRY[name] = backend;
            return true;
        }
        catch (err) {
            return false;
        }
    };
    Object.defineProperty(Environment.prototype, "math", {
        get: function () {
            this.initEngine();
            return this.globalMath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Environment.prototype, "engine", {
        get: function () {
            this.initEngine();
            return this.globalEngine;
        },
        enumerable: true,
        configurable: true
    });
    Environment.prototype.initEngine = function () {
        if (this.globalEngine == null) {
            this.globalMath =
                new math_1.NDArrayMath(exports.ENV.get('BACKEND'), false);
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Environment' })
    ], Environment, "setBackend", null);
    __decorate([
        doc_1.doc({ heading: 'Environment' })
    ], Environment, "getBackend", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Environment, "memory", null);
    return Environment;
}());
exports.Environment = Environment;
var DEEPLEARNJS_FLAGS_PREFIX = 'dljsflags';
function getFeaturesFromURL() {
    var features = {};
    if (typeof window === 'undefined') {
        return features;
    }
    var urlParams = util.getQueryParams(window.location.search);
    if (DEEPLEARNJS_FLAGS_PREFIX in urlParams) {
        var urlFlags_1 = {};
        var keyValues = urlParams[DEEPLEARNJS_FLAGS_PREFIX].split(',');
        keyValues.forEach(function (keyValue) {
            var _a = keyValue.split(':'), key = _a[0], value = _a[1];
            urlFlags_1[key] = value;
        });
        exports.URL_PROPERTIES.forEach(function (urlProperty) {
            if (urlProperty.name in urlFlags_1) {
                console.log("Setting feature override from URL " + urlProperty.name + ": " +
                    ("" + urlFlags_1[urlProperty.name]));
                if (urlProperty.type === Type.NUMBER) {
                    features[urlProperty.name] = +urlFlags_1[urlProperty.name];
                }
                else if (urlProperty.type === Type.BOOLEAN) {
                    features[urlProperty.name] = urlFlags_1[urlProperty.name] === 'true';
                }
                else if (urlProperty.type === Type.STRING) {
                    features[urlProperty.name] = urlFlags_1[urlProperty.name];
                }
                else {
                    console.warn("Unknown URL param: " + urlProperty.name + ".");
                }
            }
        });
    }
    return features;
}
function getGlobalNamespace() {
    var ns;
    if (typeof (window) !== 'undefined') {
        ns = window;
    }
    else if (typeof (global) !== 'undefined') {
        ns = global;
    }
    else {
        throw new Error('Could not find a global object');
    }
    return ns;
}
function getOrMakeEnvironment() {
    var ns = getGlobalNamespace();
    ns.ENV = ns.ENV || new Environment(getFeaturesFromURL());
    return ns.ENV;
}
exports.ENV = getOrMakeEnvironment();
