/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../lib/canvas.ts":
/*!************************!*\
  !*** ../lib/canvas.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.fullscreenCanvas = exports.fullscreenCanvas3d = exports.getCanvas = void 0;\r\nexports.getCanvas = function (isRelative) {\r\n    if (isRelative === void 0) { isRelative = false; }\r\n    var can = document.createElement('canvas');\r\n    can.width = window.innerWidth;\r\n    can.height = window.innerHeight;\r\n    if (!isRelative) {\r\n        can.style.position = 'absolute';\r\n        can.style.top = '0';\r\n        can.style.left = '0';\r\n    }\r\n    return can;\r\n};\r\nexports.fullscreenCanvas3d = function (relative) {\r\n    if (relative === void 0) { relative = false; }\r\n    var can = exports.getCanvas(relative);\r\n    var gl = can.getContext('webgl');\r\n    if (gl == null)\r\n        throw new Error('failed to get \\'webgl\\' context');\r\n    document.body.appendChild(can);\r\n    return gl;\r\n};\r\nfunction fullscreenCanvas(relative, noAlpha) {\r\n    if (relative === void 0) { relative = false; }\r\n    if (noAlpha === void 0) { noAlpha = false; }\r\n    var can = exports.getCanvas(relative);\r\n    var ctx = can.getContext('2d', { alpha: !noAlpha });\r\n    if (ctx == null)\r\n        throw new Error('failed to get \\'2d\\' context');\r\n    ctx.clear = function () {\r\n        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\r\n        return ctx;\r\n    };\r\n    ctx.makePath = function (vertices) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(vertices[0], vertices[1]);\r\n        for (var i = 2; i < vertices.length; i += 2) {\r\n            ctx.lineTo(vertices[i], vertices[i + 1]);\r\n        }\r\n        ctx.closePath();\r\n        return ctx;\r\n    };\r\n    ctx.strokeCircle = function (x, y, r) {\r\n        ctx.beginPath();\r\n        ctx.arc(x, y, r, 0, 2 * Math.PI, true);\r\n        ctx.closePath();\r\n        ctx.stroke();\r\n        return ctx;\r\n    };\r\n    ctx.fillCircle = function (x, y, r) {\r\n        ctx.beginPath();\r\n        ctx.arc(x, y, r, 0, 2 * Math.PI, true);\r\n        ctx.closePath();\r\n        ctx.fill();\r\n        return ctx;\r\n    };\r\n    document.body.style.margin = '0';\r\n    document.body.appendChild(can);\r\n    return ctx;\r\n}\r\nexports.fullscreenCanvas = fullscreenCanvas;\r\n\n\n//# sourceURL=webpack:///../lib/canvas.ts?");

/***/ }),

/***/ "../lib/rnd.ts":
/*!*********************!*\
  !*** ../lib/rnd.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.rnd = void 0;\r\nfunction rnd(a, b, c) {\r\n    if (a !== undefined && b !== undefined) {\r\n        if (c !== undefined)\r\n            return b + (a - b) * Math.random();\r\n        return typeof b === \"boolean\"\r\n            ? a * Math.random()\r\n            : (b + (a - b) * Math.random()) | 0;\r\n    }\r\n    else if (a !== undefined && b === undefined) {\r\n        if (a instanceof Array)\r\n            return a[(Math.random() * a.length) | 0];\r\n        else\r\n            return (a * Math.random()) | 0;\r\n    }\r\n    else\r\n        return Math.random();\r\n}\r\nexports.rnd = rnd;\r\n\n\n//# sourceURL=webpack:///../lib/rnd.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar rnd_1 = __webpack_require__(/*! ../../lib/rnd */ \"../lib/rnd.ts\");\r\nvar canvas_1 = __webpack_require__(/*! ../../lib/canvas */ \"../lib/canvas.ts\");\r\nvar tau = Math.PI * 2;\r\nvar sqrt32 = Math.sqrt(3) / 2;\r\nvar sin = Math.sin;\r\nvar cos = Math.cos;\r\nvar max = Math.max;\r\nvar QuadTree = (function () {\r\n    function QuadTree(x, y, w, h) {\r\n        this.x = x;\r\n        this.y = y;\r\n        this.w = w;\r\n        this.h = h;\r\n        this.children = [];\r\n        this.quads = [];\r\n    }\r\n    QuadTree.prototype.contains = function (point) {\r\n        var _a = this, x = _a.x, y = _a.y, w = _a.w, h = _a.h;\r\n        return point.x >= x && point.y >= y && point.x < x + w && point.y < y + h;\r\n    };\r\n    QuadTree.prototype.forEach = function (callback) {\r\n        if (this.quads.length > 0)\r\n            this.quads.forEach(function (q) { return q.forEach(callback); });\r\n        else\r\n            this.children.forEach(callback);\r\n    };\r\n    QuadTree.prototype.push = function (point) {\r\n        var _this = this;\r\n        if (!this.contains(point))\r\n            return false;\r\n        if (this.quads.length > 0)\r\n            this.place(point);\r\n        else if (this.children.push(point) > QuadTree.maxDirectChildren) {\r\n            var _a = this, x = _a.x, y = _a.y, w = _a.w, h = _a.h;\r\n            var _b = [w / 2, h / 2], w2 = _b[0], h2 = _b[1];\r\n            this.quads = [\r\n                new QuadTree(x, y, w2, h2),\r\n                new QuadTree(x + w2, y, w2, h2),\r\n                new QuadTree(x, y + h2, w2, h2),\r\n                new QuadTree(x + w2, y + h2, w2, h2)\r\n            ];\r\n            this.children.every(function (child) { return _this.place(child); });\r\n            this.children.length = 0;\r\n        }\r\n        return true;\r\n    };\r\n    QuadTree.prototype.place = function (point) {\r\n        return this.quads.some(function (q) { return q.push(point); });\r\n    };\r\n    QuadTree.maxDirectChildren = 7;\r\n    return QuadTree;\r\n}());\r\nstart();\r\nfunction start() {\r\n    var ctx = canvas_1.fullscreenCanvas();\r\n    var cols = 12;\r\n    var buffer = .8;\r\n    var padding = .05;\r\n    var r = ctx.canvas.width * (1 - 2 * padding) / (1 + (cols - 1) * sqrt32) / 2;\r\n    var rows = (ctx.canvas.height * (1 - 2 * padding) / r - 1) / 2 | 0;\r\n    ctx.strokeStyle = 'hsla(0, 0%, 100%, .1)';\r\n    ctx.fillStyle = 'silver';\r\n    var nodes = [];\r\n    var tree = new QuadTree(ctx.canvas.width * padding, ctx.canvas.height * padding, max(2 * r + (cols - 1) * 2 * r * sqrt32, r * (rows * 2 + 1)), max(2 * r + (cols - 1) * 2 * r * sqrt32, r * (rows * 2 + 1)));\r\n    for (var i = 0; i < rows; ++i)\r\n        for (var j = 0; j < cols; ++j) {\r\n            var x = ctx.canvas.width * padding + j * 2 * r * sqrt32 + r;\r\n            var y = ctx.canvas.height * padding + i * 2 * r + r + r * (j % 2);\r\n            ctx.strokeCircle(x, y, r);\r\n            ctx.strokeCircle(x, y, r * buffer);\r\n            var a = rnd_1.rnd(tau, true);\r\n            var d = r * rnd_1.rnd(buffer, true);\r\n            var node = { x: x + d * cos(a), y: y + d * sin(a), cluster: {} };\r\n            ctx.fillCircle(node.x, node.y, 2);\r\n            nodes.push(node);\r\n            tree.push(node);\r\n        }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ })

/******/ });