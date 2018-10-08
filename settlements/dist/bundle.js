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
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.getCanvas = function (isRelative) {\r\n    if (isRelative === void 0) { isRelative = false; }\r\n    var can = document.createElement('canvas');\r\n    can.width = window.innerWidth;\r\n    can.height = window.innerHeight;\r\n    if (!isRelative) {\r\n        can.style.position = 'absolute';\r\n        can.style.top = '0';\r\n        can.style.left = '0';\r\n    }\r\n    return can;\r\n};\r\nexports.fullscreenCanvas3d = function (relative) {\r\n    if (relative === void 0) { relative = false; }\r\n    var can = exports.getCanvas(relative);\r\n    var gl = can.getContext('webgl');\r\n    if (gl == null)\r\n        throw new Error('failed to get \\'webgl\\' context');\r\n    document.body.appendChild(can);\r\n    return gl;\r\n};\r\nfunction fullscreenCanvas(relative, noAlpha) {\r\n    if (relative === void 0) { relative = false; }\r\n    if (noAlpha === void 0) { noAlpha = false; }\r\n    var can = exports.getCanvas(relative);\r\n    var ctx = can.getContext('2d', { alpha: !noAlpha });\r\n    if (ctx == null)\r\n        throw new Error('failed to get \\'2d\\' context');\r\n    ctx.clear = function () {\r\n        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\r\n        return ctx;\r\n    };\r\n    ctx.makePath = function (vertices) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(vertices[0], vertices[1]);\r\n        for (var i = 2; i < vertices.length; i += 2) {\r\n            ctx.lineTo(vertices[i], vertices[i + 1]);\r\n        }\r\n        ctx.closePath();\r\n        return ctx;\r\n    };\r\n    ctx.strokeCircle = function (x, y, r) {\r\n        ctx.beginPath();\r\n        ctx.arc(x, y, r, 0, 2 * Math.PI, true);\r\n        ctx.closePath();\r\n        ctx.stroke();\r\n        return ctx;\r\n    };\r\n    ctx.fillCircle = function (x, y, r) {\r\n        ctx.beginPath();\r\n        ctx.arc(x, y, r, 0, 2 * Math.PI, true);\r\n        ctx.closePath();\r\n        ctx.fill();\r\n        return ctx;\r\n    };\r\n    document.body.style.margin = '0';\r\n    document.body.appendChild(can);\r\n    return ctx;\r\n}\r\nexports.fullscreenCanvas = fullscreenCanvas;\r\n\n\n//# sourceURL=webpack:///../lib/canvas.ts?");

/***/ }),

/***/ "../lib/color.ts":
/*!***********************!*\
  !*** ../lib/color.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction hcy(h, c, y) {\r\n    var r = .3;\r\n    var g = .59;\r\n    var b = .11;\r\n    h %= 360;\r\n    h /= 60;\r\n    var k = (1 - Math.abs((h % 2) - 1));\r\n    var K = h < 1 ? r + k * g\r\n        : h < 2 ? g + k * r\r\n            : h < 3 ? g + k * b\r\n                : h < 4 ? b + k * g\r\n                    : h < 5 ? b + k * r\r\n                        : r + k * b;\r\n    var cmax = 1;\r\n    if (y <= 0 || y >= 1)\r\n        cmax = 0;\r\n    else\r\n        cmax *= K < y ? (y - 1) / (K - 1) : K > y ? y / K : 1;\r\n    c = Math.min(c, cmax);\r\n    var x = c * k;\r\n    var rgb = h < 1 ? [c, x, 0]\r\n        : h < 2 ? [x, c, 0]\r\n            : h < 3 ? [0, c, x]\r\n                : h < 4 ? [0, x, c]\r\n                    : h < 5 ? [x, 0, c]\r\n                        : [c, 0, x];\r\n    var m = y - (r * rgb[0] + g * rgb[1] + b * rgb[2]);\r\n    return [rgb[0] + m, rgb[1] + m, rgb[2] + m];\r\n}\r\nexports.hcy = hcy;\r\nvar breaks = [\r\n    [39, 60],\r\n    [60, 120],\r\n    [120, 180],\r\n    [240, 240],\r\n    [290, 300],\r\n    [360, 360]\r\n];\r\nfunction wheelHcy(h, c, y) {\r\n    var _a;\r\n    h %= 360;\r\n    var h2 = h;\r\n    var _b = [0, 0], s0 = _b[0], t0 = _b[1];\r\n    for (var _i = 0, breaks_1 = breaks; _i < breaks_1.length; _i++) {\r\n        var _c = breaks_1[_i], t = _c[0], s = _c[1];\r\n        if (h < s) {\r\n            h2 = t0 + (h - s0) * (t - t0) / (s - s0);\r\n            break;\r\n        }\r\n        _a = [s, t], s0 = _a[0], t0 = _a[1];\r\n    }\r\n    return hcy(h2, c, y);\r\n}\r\nexports.wheelHcy = wheelHcy;\r\nfunction wheel2rgb(h, c, y, a) {\r\n    if (a === void 0) { a = 1; }\r\n    var rgbdata = wheelHcy(h, c, y);\r\n    return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);\r\n}\r\nexports.wheel2rgb = wheel2rgb;\r\nfunction tuple2rgb(r, g, b, a) {\r\n    return 'rgba(' + (r * 255).toFixed(0) + ',' + (g * 255).toFixed(0) + ',' + (b * 255).toFixed(0) + ', ' + a + ')';\r\n}\r\nfunction hcy2rgb(h, c, y, a) {\r\n    if (a === void 0) { a = 1; }\r\n    var rgbdata = hcy(h, c, y);\r\n    return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);\r\n}\r\nexports.hcy2rgb = hcy2rgb;\r\nfunction rgbdata2rgb(t, a) {\r\n    return tuple2rgb(t[0], t[1], t[2], a === undefined ? 1 : a);\r\n}\r\nexports.rgbdata2rgb = rgbdata2rgb;\r\n\n\n//# sourceURL=webpack:///../lib/color.ts?");

/***/ }),

/***/ "../lib/geometry.ts":
/*!**************************!*\
  !*** ../lib/geometry.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    }\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Point = (function () {\r\n    function Point(x, y) {\r\n        this.x = x;\r\n        this.y = y;\r\n    }\r\n    Point.prototype.times = function (a, b) {\r\n        if (typeof (a) === 'number')\r\n            return new Point(this.x * a, this.y * b);\r\n        return new Point(this.x * a.x, this.y * a.y);\r\n    };\r\n    Point.prototype.plus = function (a, b) {\r\n        if (typeof (a) === 'number')\r\n            return new Point(this.x + a, this.y + b);\r\n        return new Point(this.x + a.x, this.y + a.y);\r\n    };\r\n    return Point;\r\n}());\r\nexports.Point = Point;\r\nvar Rect = (function (_super) {\r\n    __extends(Rect, _super);\r\n    function Rect(x, y, w, h) {\r\n        var _this = _super.call(this, x, y) || this;\r\n        _this.w = w;\r\n        _this.h = h;\r\n        return _this;\r\n    }\r\n    Object.defineProperty(Rect.prototype, \"horizontal\", {\r\n        get: function () {\r\n            return new Range(this.x, this.w);\r\n        },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(Rect.prototype, \"vertical\", {\r\n        get: function () {\r\n            return new Range(this.y, this.h);\r\n        },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    return Rect;\r\n}(Point));\r\nexports.Rect = Rect;\r\nvar Range = (function () {\r\n    function Range(start, length) {\r\n        this.start = start;\r\n        this.length = length;\r\n    }\r\n    Object.defineProperty(Range.prototype, \"end\", {\r\n        get: function () {\r\n            return this.start + this.length;\r\n        },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    return Range;\r\n}());\r\nexports.Range = Range;\r\n\n\n//# sourceURL=webpack:///../lib/geometry.ts?");

/***/ }),

/***/ "../lib/rnd.ts":
/*!*********************!*\
  !*** ../lib/rnd.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction rnd(a, b, c) {\r\n    if (a !== undefined && b !== undefined) {\r\n        if (c !== undefined)\r\n            return b + (a - b) * Math.random();\r\n        return typeof b === \"boolean\"\r\n            ? a * Math.random()\r\n            : (b + (a - b) * Math.random()) | 0;\r\n    }\r\n    else if (a !== undefined && b === undefined) {\r\n        if (a instanceof Array)\r\n            return a[(Math.random() * a.length) | 0];\r\n        else\r\n            return (a * Math.random()) | 0;\r\n    }\r\n    else\r\n        return Math.random();\r\n}\r\nexports.rnd = rnd;\r\n\n\n//# sourceURL=webpack:///../lib/rnd.ts?");

/***/ }),

/***/ "./src/cycle.ts":
/*!**********************!*\
  !*** ./src/cycle.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction findCycles(graph) {\r\n    var cycles = [];\r\n    graph.forEach(function (edge) { return edge.forEach(function (node) { return findNewCycles([node]); }); });\r\n    function findNewCycles(path) {\r\n        var start_node = path[0];\r\n        var next_node = null;\r\n        for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {\r\n            var edge = graph_1[_i];\r\n            var node1 = edge[0], node2 = edge[1];\r\n            if (node1 == start_node || node2 == start_node) {\r\n                next_node = node1 === start_node ? node2 : node1;\r\n            }\r\n            else\r\n                continue;\r\n            if (!visited(next_node, path)) {\r\n                findNewCycles([next_node].concat(path));\r\n            }\r\n            else if (path.length > 2 && next_node == path[path.length - 1]) {\r\n                var cycle = rotateToSmallest(path);\r\n                if (isNew(cycle) && isNew(reverse(cycle)))\r\n                    cycles.push(cycle);\r\n            }\r\n        }\r\n        function isNew(path) {\r\n            var p = JSON.stringify(path);\r\n            for (var _i = 0, cycles_1 = cycles; _i < cycles_1.length; _i++) {\r\n                var cycle = cycles_1[_i];\r\n                if (p === JSON.stringify(cycle)) {\r\n                    return false;\r\n                }\r\n            }\r\n            return true;\r\n        }\r\n    }\r\n    return cycles;\r\n}\r\nexports.findCycles = findCycles;\r\nfunction reverse(path) {\r\n    return rotateToSmallest(path.slice().reverse());\r\n}\r\nfunction rotateToSmallest(path) {\r\n    var n = path.indexOf(Math.min.apply(Math, path));\r\n    return path.slice(n).concat(path.slice(0, n));\r\n}\r\nfunction visited(node, path) {\r\n    return path.indexOf(node) != -1;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/cycle.ts?");

/***/ }),

/***/ "./src/dist-map.ts":
/*!*************************!*\
  !*** ./src/dist-map.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar DistMap = (function () {\r\n    function DistMap(points) {\r\n        this.dists = [];\r\n        this.length = points.length;\r\n        for (var i = 1; i < points.length; ++i)\r\n            for (var j = 0; j < i; ++j) {\r\n                var _a = points[i], x0 = _a.x, y0 = _a.y;\r\n                var _b = points[j], x1 = _b.x, y1 = _b.y;\r\n                var d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));\r\n                this.dists.push(d);\r\n            }\r\n    }\r\n    DistMap.prototype.dist = function (i0, i1) {\r\n        return i0 == i1\r\n            ? 0\r\n            : i1 > i0\r\n                ? this.dists[((i1 - 1) * i1) / 2 + i0]\r\n                : this.dists[((i0 - 1) * i0) / 2 + i1];\r\n    };\r\n    DistMap.prototype.closest = function (idx) {\r\n        var dist = Infinity;\r\n        var ix = -1;\r\n        for (var j = 0; j < idx; ++j) {\r\n            var d = this.dist(idx, j);\r\n            if (d < dist) {\r\n                dist = d;\r\n                ix = j;\r\n            }\r\n        }\r\n        for (var i = idx + 1; i < this.length; ++i) {\r\n            var d = this.dist(i, idx);\r\n            if (d < dist) {\r\n                dist = d;\r\n                ix = i;\r\n            }\r\n        }\r\n        return ix;\r\n    };\r\n    return DistMap;\r\n}());\r\nexports.DistMap = DistMap;\r\n\n\n//# sourceURL=webpack:///./src/dist-map.ts?");

/***/ }),

/***/ "./src/graph.ts":
/*!**********************!*\
  !*** ./src/graph.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Graph = (function () {\r\n    function Graph(dist, cutoff) {\r\n        var _this = this;\r\n        this.edges = [];\r\n        var connected = [true];\r\n        var done = false;\r\n        while (!done) {\r\n            var cluster = [];\r\n            var pending = [];\r\n            var links = [];\r\n            for (var i = 0; i < dist.length; ++i) {\r\n                (connected[i] ? cluster : pending).push(i);\r\n            }\r\n            if (pending.length > 0) {\r\n                for (var _i = 0, cluster_1 = cluster; _i < cluster_1.length; _i++) {\r\n                    var src = cluster_1[_i];\r\n                    for (var _a = 0, pending_1 = pending; _a < pending_1.length; _a++) {\r\n                        var tgt = pending_1[_a];\r\n                        links.push([src, tgt, dist.dist(src, tgt)]);\r\n                    }\r\n                }\r\n                links.sort(function (_a, _b) {\r\n                    var a = _a[0], b = _a[1], d1 = _a[2];\r\n                    var c = _b[0], d = _b[1], d2 = _b[2];\r\n                    return d1 - d2;\r\n                });\r\n                links\r\n                    .filter(function (_a, i) {\r\n                    var x = _a[0], y = _a[1], d = _a[2];\r\n                    return i < 2 || i < 4 && d < cutoff / 2;\r\n                })\r\n                    .forEach(function (v) {\r\n                    var src = v[0], tgt = v[1];\r\n                    connected[tgt] = true;\r\n                    _this.edges.push([\r\n                        Math.min(src, tgt),\r\n                        Math.max(src, tgt)\r\n                    ]);\r\n                });\r\n            }\r\n            else {\r\n                done = true;\r\n            }\r\n        }\r\n    }\r\n    return Graph;\r\n}());\r\nexports.Graph = Graph;\r\n\n\n//# sourceURL=webpack:///./src/graph.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar rnd_1 = __webpack_require__(/*! ../../lib/rnd */ \"../lib/rnd.ts\");\r\nvar geometry_1 = __webpack_require__(/*! ../../lib/geometry */ \"../lib/geometry.ts\");\r\nvar canvas_1 = __webpack_require__(/*! ../../lib/canvas */ \"../lib/canvas.ts\");\r\nvar world_1 = __webpack_require__(/*! ./world */ \"./src/world.ts\");\r\nvar render_1 = __webpack_require__(/*! ./render */ \"./src/render.ts\");\r\nvar cycle_1 = __webpack_require__(/*! ./cycle */ \"./src/cycle.ts\");\r\nvar tau = Math.PI * 2;\r\nvar sin = Math.sin;\r\nvar cos = Math.cos;\r\nvar minlen = 6;\r\nmain();\r\nfunction main() {\r\n    var q = Math.sqrt(3) / 2;\r\n    var size = 120;\r\n    var ctx = canvas_1.fullscreenCanvas();\r\n    var cols = (ctx.canvas.width / size / q) | 0;\r\n    var rows = (ctx.canvas.height / size) | 0;\r\n    var bottomOut = rows * size + size / 2 > ctx.canvas.height;\r\n    var world = null;\r\n    var score = 0;\r\n    var tries = 10;\r\n    var satisfactoryScore = 50;\r\n    while (tries-- > 0) {\r\n        var nodes = [];\r\n        for (var i = 0; i < rows; ++i) {\r\n            for (var j = 0; j < cols; ++j) {\r\n                if (i == rows - 1 && bottomOut && (j + 1) % 2)\r\n                    continue;\r\n                var rmax = size / 2;\r\n                var x = rmax + j * rmax * 2 * q;\r\n                var y = rmax + i * rmax * 2 + ((j + 1) % 2) * rmax;\r\n                var isRim = (i == 0 && j % 2 == 0) ||\r\n                    j == 0 ||\r\n                    (i == rows - 1 && (bottomOut || j % 2 == 0)) ||\r\n                    j == cols - 1;\r\n                var r = rnd_1.rnd(0.85 * rmax, true);\r\n                var a = isRim\r\n                    ? Math.atan2(ctx.canvas.height / 2 - y, ctx.canvas.width / 2 - x) + rnd_1.rnd(-tau / 10, tau / 10, true)\r\n                    : rnd_1.rnd(tau, true);\r\n                x += r * cos(a);\r\n                y += r * sin(a);\r\n                nodes.push(new world_1.Node(nodes.length + \"-\" + i + \"x\" + j, new geometry_1.Point(x, y)));\r\n            }\r\n        }\r\n        var newWorld = new world_1.World(nodes, size);\r\n        var newScore = getScore(cycle_1.findCycles(newWorld.graph.edges));\r\n        if (newScore > score) {\r\n            score = newScore;\r\n            world = newWorld;\r\n        }\r\n        if (score > satisfactoryScore) {\r\n            console.log(\"early break \" + tries + \" left\");\r\n            break;\r\n        }\r\n    }\r\n    if (world != null) {\r\n        render_1.render(ctx, world);\r\n        var cycles = cycle_1.findCycles(world.graph.edges);\r\n        console.log(getScore(cycles));\r\n        console.log(cycles.filter(function (c) { return c.length > minlen; }));\r\n    }\r\n}\r\n;\r\nfunction getScore(cycles) {\r\n    return cycles\r\n        .map(function (c) { return c.length; })\r\n        .filter(function (l) { return l >= minlen; })\r\n        .reduce(function (sum, len) { return sum + len / minlen; }, 0);\r\n}\r\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ "./src/render.ts":
/*!***********************!*\
  !*** ./src/render.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar color_1 = __webpack_require__(/*! ./../../lib/color */ \"../lib/color.ts\");\r\nfunction render(ctx, world) {\r\n    var maxdist = world.graph.edges.reduce(avgedge(world.dists), 0) * 1.01;\r\n    var _a = ctx.canvas, w = _a.width, h = _a.height;\r\n    var imgData = ctx.createImageData(w, h);\r\n    var data = imgData.data;\r\n    for (var i = 0; i < h; ++i) {\r\n        for (var j = 0; j < w; ++j) {\r\n            var v = world.nodes\r\n                .map(distto(j, i))\r\n                .filter(function (d) { return d < maxdist; })\r\n                .map(function (d) { return d / maxdist; })\r\n                .reduce(function (a, b) { return a + fade(1 - b); }, 0);\r\n            var _b = mapColor(v), r = _b[0], g = _b[1], b = _b[2];\r\n            var idx = (i * w + j) * 4;\r\n            data[idx] = (r * 255) & 255;\r\n            data[idx + 1] = (g * 255) & 255;\r\n            data[idx + 2] = (b * 255) & 255;\r\n            data[idx + 3] = 150;\r\n        }\r\n    }\r\n    ctx.putImageData(imgData, 0, 0);\r\n    for (var _i = 0, _c = world.graph.edges; _i < _c.length; _i++) {\r\n        var _d = _c[_i], i = _d[0], j = _d[1];\r\n        var node = world.nodes[i];\r\n        var other = world.nodes[j];\r\n        ctx.beginPath();\r\n        ctx.moveTo(node.pos.x, node.pos.y);\r\n        ctx.lineTo(other.pos.x, other.pos.y);\r\n        ctx.stroke();\r\n    }\r\n    for (var i = 0; i < world.nodes.length; ++i) {\r\n        var node = world.nodes[i];\r\n        ctx.fillCircle(node.pos.x, node.pos.y, 5);\r\n        ctx.fillText(node.name, node.pos.x, node.pos.y - 7);\r\n    }\r\n}\r\nexports.render = render;\r\nfunction avgedge(dist) {\r\n    return function (max, _a, i, arr) {\r\n        var a = _a[0], b = _a[1];\r\n        return max + dist.dist(a, b) / arr.length;\r\n    };\r\n}\r\nfunction distto(x, y) {\r\n    return function (_a) {\r\n        var pos = _a.pos;\r\n        return dist(x, y, pos.x, pos.y);\r\n    };\r\n}\r\nfunction dist(x1, y1, x2, y2) {\r\n    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));\r\n}\r\nvar grad = [\r\n    [0, color_1.wheelHcy(0, 1, 1)],\r\n    [0.4, color_1.wheelHcy(0, 1, 1)],\r\n    [0.405, color_1.wheelHcy(0, 1, 0.5)],\r\n    [0.60, color_1.wheelHcy(120, 1, 0.5)],\r\n    [0.70, color_1.wheelHcy(180, 1, 0.8)],\r\n];\r\nfunction mapColor(n) {\r\n    return mapGrad(n, grad);\r\n}\r\nfunction mapGrad(v, grad) {\r\n    var prev = grad[0];\r\n    for (var i = 1; i < grad.length; ++i) {\r\n        var _a = grad[i], lvl = _a[0], color = _a[1];\r\n        if (v < lvl) {\r\n            var lvl0 = prev[0], color0 = prev[1];\r\n            var k = 1 - (v - lvl0) / (lvl - lvl0);\r\n            return [\r\n                color0[0] * k + color[0] * (1 - k),\r\n                color0[1] * k + color[1] * (1 - k),\r\n                color0[2] * k + color[2] * (1 - k)\r\n            ];\r\n        }\r\n        prev = grad[i];\r\n    }\r\n    return grad[grad.length - 1][1];\r\n}\r\nfunction fade(t) {\r\n    return t * t * t * (t * (t * 6 - 15) + 10);\r\n}\r\n\n\n//# sourceURL=webpack:///./src/render.ts?");

/***/ }),

/***/ "./src/world.ts":
/*!**********************!*\
  !*** ./src/world.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar graph_1 = __webpack_require__(/*! ./graph */ \"./src/graph.ts\");\r\nvar dist_map_1 = __webpack_require__(/*! ./dist-map */ \"./src/dist-map.ts\");\r\nvar Node = (function () {\r\n    function Node(name, pos) {\r\n        this.name = name;\r\n        this.pos = pos;\r\n    }\r\n    return Node;\r\n}());\r\nexports.Node = Node;\r\nvar World = (function () {\r\n    function World(nodes, cutoff) {\r\n        this.nodes = nodes;\r\n        this.dists = new dist_map_1.DistMap(nodes.map(function (n) { return n.pos; }));\r\n        this.graph = new graph_1.Graph(this.dists, cutoff);\r\n    }\r\n    return World;\r\n}());\r\nexports.World = World;\r\n\n\n//# sourceURL=webpack:///./src/world.ts?");

/***/ })

/******/ });