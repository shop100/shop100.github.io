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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(10);
__webpack_require__(12);
__webpack_require__(14);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./app.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./app.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "body * {\n  outline: none; }\n\n.site-sidenav.md-whiteframe-z2 .nav-header {\n  background-color: #106CC8;\n  background: -webkit-linear-gradient(#185694, #106cc8);\n  background: linear-gradient(#185694, #106cc8);\n  border-bottom: 1px solid #267ED5;\n  -webkit-flex-shrink: 0;\n  flex-shrink: 0;\n  z-index: 2; }\n  .site-sidenav.md-whiteframe-z2 .nav-header .docs-logo {\n    text-decoration: unset; }\n    .site-sidenav.md-whiteframe-z2 .nav-header .docs-logo .docs-logotype.md-heading {\n      color: white;\n      text-align: center;\n      font-weight: 400;\n      font-size: 26px; }\n\n.md-whiteframe-glow-z1.site-content-toolbar .md-toolbar-tools.docs-toolbar-tools {\n  background: #f6f6f6 !important;\n  color: #202020 !important;\n  z-index: 3;\n  box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 2px 2px rgba(0, 0, 0, 0.098), 0px 0px 5px 1px rgba(0, 0, 0, 0.084); }\n\n#courses .course {\n  width: 420px; }\n  #courses .course .card-media {\n    width: 90px;\n    height: 90px; }\n\n.appModuleCircle {\n  height: 100px;\n  width: 100px;\n  border-radius: 56px;\n  background: #8bc34a;\n  margin: auto;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  cursor: pointer;\n  transition: box-shadow ease-in 100ms; }\n  .appModuleCircle.active {\n    background: #36abcb; }\n    .appModuleCircle.active:hover {\n      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n  .appModuleCircle:hover, .appModuleCircle.active {\n    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n\n.appModule span {\n  margin: 10px 0 0;\n  display: block;\n  cursor: pointer; }\n\n.appModuleCircle img {\n  margin: 5px;\n  height: 90px;\n  width: 90px;\n  pointer-events: none; }\n\n.appModuleCircle.disabled {\n  background: #ddd; }\n\n.appModule {\n  padding: 20px 0;\n  text-align: center;\n  width: 100%;\n  overflow: hidden; }\n  .appModule.none {\n    float: left;\n    width: 50%; }\n  .appModule span {\n    margin: 10px 0 0;\n    display: block;\n    cursor: pointer; }\n\n.certificate {\n  opacity: 1;\n  transform: scaleX(1) scaleY(1); }\n\n.appModule .content {\n  max-width: 50%;\n  display: inline-block; }\n\n.appModule.certificate .icon {\n  margin: 10px 0 0;\n  display: block;\n  cursor: pointer;\n  width: 90px;\n  height: 90px;\n  background-image: url(https://www.sololearn.com/Images/appSprite.png);\n  background-position: -340px -280px; }\n\n.appModule.certificate span {\n  margin: -10px 0 0; }\n\n.lessonPanel {\n  max-width: 802px;\n  margin: 34px auto; }\n\n.appLesson .name {\n  padding: 20px 10px;\n  text-align: left;\n  height: 115px; }\n\n.appLesson .number {\n  padding: 4px;\n  font-size: 12px;\n  float: right; }\n\n.appLesson .info {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: #8bc34a;\n  color: #fff; }\n\n.appLesson {\n  position: relative;\n  height: 155px;\n  width: 155px;\n  margin: 4px;\n  float: left;\n  background: #fff;\n  color: #737373;\n  text-align: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  overflow: hidden;\n  transition: box-shadow ease-in 100ms;\n  cursor: pointer; }\n\n.appLesson.active .icon {\n  background-position: -40px 0; }\n\n.appLesson .icon {\n  display: block;\n  float: right;\n  width: 40px;\n  height: 40px;\n  background-image: url(https://www.sololearn.com/Images/appSprite.png); }\n\n.appLesson .info span {\n  white-space: nowrap;\n  font-size: 14px;\n  line-height: 40px;\n  margin: 0 10px; }\n\n.appLesson.active {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n\n.lessonOutline .video, .lessonOutline .quiz {\n  display: inline-block;\n  height: 30px;\n  width: 70px;\n  text-align: center;\n  margin: 0 -7px 0 -8px;\n  cursor: pointer; }\n\n.lessonOutline .left {\n  float: left; }\n\n.lessonOutline .video.passed i, .lessonOutline .video.active i {\n  background-position: -60px -150px; }\n\n.lessonOutline .video i {\n  background-position: -0 -150px; }\n\n.lessonOutline i {\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  background-image: url(https://www.sololearn.com/Images/appSprite.png);\n  position: relative; }\n\n.lessonOutline .right {\n  float: right; }\n\n.lessonOutline.text, .lessonOutline.video, #quizView .lessonOutline {\n  margin-left: 120px; }\n\n.lessonOutline {\n  text-align: center;\n  font-size: 0; }\n\n.lessonOutline .quiz.passed i, .lessonOutline .quiz.active i {\n  background-position: -90px -150px; }\n\n.lessonOutline .quiz i {\n  background-position: -30px -150px; }\n\n.lessonOutline i {\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  background-image: url(https://www.sololearn.com/Images/appSprite.png);\n  position: relative; }\n\n.lessonOutline .active {\n  background: url(https://www.sololearn.com/Images/appSprite.png) -160px -180px; }\n\n.lessonOutline .video, .lessonOutline .quiz {\n  display: inline-block;\n  height: 30px;\n  width: 70px;\n  text-align: center;\n  margin: 0 -7px 0 -8px;\n  cursor: pointer; }\n\n.lessonViewInfo .number {\n  padding: 0 20px;\n  float: right;\n  width: 80px;\n  text-align: right; }\n\n.lessonViewInfo {\n  height: 30px;\n  line-height: 30px;\n  color: #333;\n  font-size: 20px;\n  background-color: #d4d4d4; }\n\n.noteBlock {\n  border: solid 1px #ddd;\n  margin: 10px 20px;\n  background: #eeea87;\n  display: block; }\n\n.note {\n  padding: 10px;\n  border-left: 5px solid #c9c54c;\n  display: block; }\n\n#textContent {\n  max-width: 800px;\n  margin: 0 auto; }\n\n#quizView .actionBar {\n  padding: 20px 10px; }\n\n#quizView .checkButton {\n  background-color: #64dd17;\n  opacity: 1;\n  transform: scaleX(1) scaleY(1);\n  margin: 0 20px;\n  float: right;\n  background-image: url(https://www.sololearn.com/Images/appSprite.png);\n  background-position: -160px -60px; }\n\n.materialIcon, .actionButton {\n  overflow: hidden;\n  position: relative;\n  border-radius: 50%;\n  cursor: pointer;\n  z-index: 10; }\n\n.actionButton {\n  width: 60px;\n  height: 60px;\n  border-radius: 30px;\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);\n  border: none;\n  background: #0ad;\n  cursor: pointer; }\n\n#quizView .quizQuestion {\n  padding: 40px;\n  font-size: 20px;\n  color: #444; }\n\n#quizSelector {\n  padding: 0 40px;\n  text-align: center; }\n\n#sidebar-courses a {\n  display: block;\n  color: black;\n  text-decoration: none; }\n\n#sidebar-courses a:hover {\n  color: #1fbba6; }\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-drag-drop.css", function() {
			var newContent = require("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-drag-drop.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".placeholderDragAndDropQuiz .placeholders {\n  font-size: 20px;\n  font-family: monospace; }\n\n.placeholderDragAndDropQuiz .placeholder {\n  min-width: 50px;\n  position: relative;\n  margin: 0 4px;\n  padding: 0 4px;\n  text-align: center; }\n\n.placeholderDragAndDropQuiz .placeholder .underline {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 3px;\n  border: solid 2px #333;\n  border-top: none; }\n\n.placeholderDragAndDropQuiz .placeholder.active .underline {\n  display: none;\n  border-color: #09f; }\n\n.placeholderDragAndDropQuiz .placeholder .answer {\n  width: 53px;\n  color: #64dd17;\n  text-align: center;\n  padding: 10px;\n  padding-bottom: 0;\n  display: inline-block;\n  cursor: move;\n  white-space: nowrap; }\n\n.placeholderDragAndDropQuiz .placeholder {\n  display: inline-block; }\n\n.placeholderDragAndDropQuiz .answers {\n  margin-top: 20px;\n  background: #fff;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); }\n\n.placeholderDragAndDropQuiz .answers .answer {\n  color: #64dd17;\n  display: inline-block;\n  cursor: move; }\n\n.placeholderDragAndDropQuiz .answer {\n  padding: 10px;\n  color: #64dd17;\n  display: inline-block;\n  cursor: pointer;\n  white-space: nowrap;\n  text-align: left;\n  font-size: 20px;\n  position: relative; }\n\n.placeholderDragAndDropQuiz .answers .answer.selected {\n  color: grey; }\n\n.placeholderDragAndDropQuiz .answer span {\n  font-family: monospace;\n  left: 0;\n  width: 100%;\n  position: absolute; }\n\n.dndPlaceholder {\n  display: inline;\n  width: 53px; }\n\n.placeholderDragAndDropQuiz .placeholder.active {\n  min-width: unset; }\n\n.placeholderDragAndDropQuiz .placeholder.active .answer {\n  padding-right: 4px;\n  padding-left: 4px;\n  width: unset; }\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-fill-in-blank.css", function() {
			var newContent = require("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-fill-in-blank.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".typeInControl .prefix, .typeInControl .postfix {\n  display: inline-block; }\n\n.typeInControl .answer {\n  display: inline-block;\n  position: relative; }\n\n.typeInControl .realText {\n  color: transparent;\n  text-decoration: underline;\n  text-decoration-color: #757575;\n  padding-bottom: 4px;\n  text-align: left;\n  white-space: nowrap;\n  /*visibility: hidden;*/ }\n\n.typeInControl .materialInput, .typeInControl .resultText {\n  outline: unset;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0;\n  text-align: left;\n  white-space: nowrap;\n  overflow: hidden; }\n\n.typeInControl .prefix, .typeInControl .postfix {\n  display: inline-block; }\n\n.placeholderQuiz .placeholder {\n  display: inline-block; }\n\n.placeholderQuiz {\n  font-family: monospace;\n  width: 500px;\n  text-align: left;\n  font-size: 20px;\n  margin: auto; }\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-single-choice.css", function() {
			var newContent = require("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-single-choice.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".materialRadio .outline {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  border: solid 2px;\n  border-color: #5a5a5a; }\n\n.materialRadio.selected .fill {\n  -webkit-transform: scale(1.1);\n  transform: scale(1.1); }\n\n.materialRadio .fill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background-color: #0f9d58;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  transition: -webkit-transform ease .28s;\n  transition: transform ease .28s; }\n\n.multipleChoiceQuiz, .strikeOutQuiz {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  border-radius: 3px;\n  background: #fff;\n  text-align: left; }\n\n#quizSelector {\n  padding: 0 40px;\n  text-align: center; }\n\n.multipleChoiceQuiz .answer.selected, .strikeOutQuiz .answer.striked {\n  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.16), 0 4px 4px rgba(0, 0, 0, 0.23);\n  z-index: 1; }\n\n.multipleChoiceQuiz .answer, .strikeOutQuiz .answer {\n  border-top: solid 1px #eee;\n  border-radius: 3px;\n  background: #fff;\n  padding: 20px;\n  position: relative;\n  transition: box-shadow ease-in 100ms;\n  cursor: pointer; }\n\n#quizSelector .materialRadio .icon {\n  float: left;\n  width: 36px; }\n\n.materialRadio .icon {\n  position: relative;\n  width: 18px;\n  height: 18px; }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-multiple-choices.css", function() {
			var newContent = require("!!../css-loader/index.js!../sass-loader/lib/loader.js!./quiz-multiple-choices.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".multipleChoiceQuiz, .strikeOutQuiz {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  border-radius: 3px;\n  background: #fff;\n  text-align: left; }\n\n#quizSelector {\n  padding: 0 40px;\n  text-align: center; }\n\n.multipleChoiceQuiz .answer.selected, .strikeOutQuiz .answer.striked {\n  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.16), 0 4px 4px rgba(0, 0, 0, 0.23);\n  z-index: 1; }\n\n.multipleChoiceQuiz .answer, .strikeOutQuiz .answer {\n  border-top: solid 1px #eee;\n  border-radius: 3px;\n  background: #fff;\n  padding: 20px;\n  position: relative;\n  transition: box-shadow ease-in 100ms;\n  cursor: pointer; }\n\n#quizSelector .materialCheckbox .icon {\n  float: left;\n  width: 36px; }\n\n.materialCheckbox .icon {\n  position: relative;\n  width: 18px;\n  height: 18px; }\n\n.materialCheckbox.selected .outline, .materialCheckbox input:checked ~ .icon .outline {\n  transform: rotate(45deg);\n  top: 13px;\n  left: 5px;\n  width: 4px;\n  height: 4px;\n  opacity: 0; }\n\n.materialCheckbox .outline {\n  position: absolute;\n  box-sizing: border-box;\n  top: 0;\n  left: 0;\n  width: 18px;\n  height: 18px;\n  border: solid 2px;\n  border-color: #5a5a5a;\n  transition: all ease-out 140ms;\n  transition-property: transform,-webkit-transform,top,left,width,height,opacity; }\n\n.materialCheckbox.selected .fill, .materialCheckbox input:checked ~ .icon .fill {\n  opacity: 1;\n  top: -4px;\n  left: 6px;\n  width: 10px;\n  height: 21px; }\n\n.materialCheckbox .fill {\n  position: absolute;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n  top: 13px;\n  left: 5px;\n  width: 4px;\n  height: 4px;\n  border-top: none;\n  border-left: none;\n  border-right: solid 2px;\n  border-bottom: solid 2px;\n  border-color: #0f9d58;\n  transition: all ease-out 140ms;\n  transition-property: top,left,width,height,opacity,border-right-width,border-bottom-width;\n  transition-delay: 140ms;\n  opacity: 0; }\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(15);
__webpack_require__(19);

angular
    .module("App", [
        "ngMaterial",
        "AppServices",
        "AppControllers"
    ])
    .run([
        "$rootScope",
        "$mdSidenav",
        "$mdMedia",
        "$state",
        function ($rootScope, $mdSidenav, $mdMedia, $state) {
        $rootScope.$state = $state;
        $rootScope.openMenu = function () {
            $mdSidenav("left").toggle();
        };
    }])
    .directive("bbDecode", ["$sce",function ($sce) {
        return {
            template: "<div ng-bind-html='html'></div>",
            scope: {
                content: "="
            },
            link: function (scope) {
                scope.$watch('content', function () {
                    if(!scope.content){
                        return;
                    }
                    var html = scope.content;
                    var div = document.createElement('div');
                    div.innerText = html;
                    html = div.innerHTML;
                    html = html.replace(/\[b]/gi,'<strong>');
                    html = html.replace(/\[\/b]/gi,'</strong>');
                    html = html.replace(/\[h1]/gi,'<h1>');
                    html = html.replace(/\[\/h1]/gi,'</h1>');
                    html = html.replace(/\[h2]/gi,'<h2>');
                    html = html.replace(/\[\/h2]/gi,'</h2>');

                    html = html.replace(/\n/gi,'<br/>');

                    html = html.replace(/\[note]/gi,'<div class="noteBlock"><span class="note">');
                    html = html.replace(/\[\/note]/gi,'</span></div>');

                    html = html.replace(/\[code format="(.*?)"]/gi,'<div class="codeBlock"><span class="code $1">');
                    html = html.replace(/\[\/code]/gi,'</span></div>');
                    html = html.replace(/\[img id="(.*?)" width="100%"]/gi,'<img src="https://api.sololearn.com/DownloadFile?id=$1">');

                    scope.html = $sce.trustAsHtml(html);
                });
            }
        };
    }]);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var RESOURCES = 'https://shop100.github.io/';
var LessonService = __webpack_require__(16);
var CourseService = __webpack_require__(17);
var ProgressService = __webpack_require__(18);
angular
    .module("AppServices", [])
    .constant("RESOURCES_URL", RESOURCES)
    .service("LessonService", LessonService)
    .service("CourseService", CourseService)
    .service("ProgressService", ProgressService)
;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = [
    "$http",
    "RESOURCES_URL",
    "ProgressService",
    function ($http, RESOURCES_URL, ProgressService) {
        var lessonService = {};
        lessonService.get = function (course_id, module_id, lesson_id) {
            return $http.get(RESOURCES_URL + 'courses' + '/' + course_id + '/' + 'modules' + '/' + module_id + '/' + 'lessons' + '/' + lesson_id + '.json');
        };
        var progressType = 'lessonQuiz';
        lessonService.done = function (quiz) {
            return ProgressService.done(progressType, quiz.id);
        };
        lessonService.isDone = function (quiz) {
            return ProgressService.isDone(progressType, quiz.id);
        };
        return lessonService;
    }
];


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = ["$http", "RESOURCES_URL", function ($http, RESOURCES_URL) {
    var courseService = {};
    courseService.all = function () {
        return $http.get(RESOURCES_URL+'courses/items.json');
    };
    courseService.get = function (course) {
        return $http.get(RESOURCES_URL+'courses/'+ course.slug+'.json');
    };
    return courseService;
}];


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = [
    function () {
        var progressService = {};
        if(!localStorage.progresses) {
            localStorage.progresses = '{}';
        }
        progressService.pipe = function (handle) {
            var progresses = JSON.parse(localStorage.progresses);
            progresses = handle(progresses);
            localStorage.progresses = JSON.stringify(progresses);
        };
        progressService.done = function (type, id) {
            progressService.pipe(function (progresses) {
                if(!progresses[type]){
                    progresses[type] = {};
                }
                progresses[type][id] = {status:true};

                return progresses;
            })
        };
        progressService.isDone = function (type, id) {
            var done;
            done = false;
            progressService.pipe(function (progresses) {
                if(!progresses[type]){
                    progresses[type] = {};
                }
                if(!progresses[type][id]) {
                    progresses[type][id] = {status:false};
                }
                done = progresses[type][id].status;
                return progresses;
            });

            return done;
        };
        return progressService;
    }
];


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20);
__webpack_require__(21);
__webpack_require__(22);
__webpack_require__(23);
angular
    .module("AppControllers", [
        "ui.router",
        "DragDropQuiz",
        "FillInBlankQuiz",
        "MultipleChoiceQuiz",
        "SingleChoiceQuiz"
    ])
    .config([
        "$urlRouterProvider",
        "$stateProvider",
        function ($urlRouterProvider, $stateProvider) {
            var homeState = {
                name: 'home',
                url: '/',
                template: '',
                controller: [
                    "$state",
                    function ($state) {
                        $state.go('courses');
                    }
                ]
            };

            var coursesState = {
                name: 'courses',
                url: '/courses',
                controller: __webpack_require__(24),
                template: __webpack_require__(25)
            };

            var courseState = {
                name: 'courses.show',
                url: '/:slug',
                views: {
                    "@": {
                        controller: __webpack_require__(26),
                        template: __webpack_require__(27)
                    }
                }
            };
            var courseModuleShowState = {
                name: 'courses.show.module',
                url: '/:course_id/modules/:module_id',
                views: {
                    "@": {
                        controller: __webpack_require__(28),
                        template: __webpack_require__(29)
                    }
                }
            };
            var lessonShowState = {
                name: 'courses.show.module.lesson',
                url: '/lessons/:lesson_id',
                views: {
                    "@": {
                        controller: __webpack_require__(30),
                        template: __webpack_require__(31)
                    }
                }
            };

            $stateProvider.state(homeState);
            $stateProvider.state(coursesState);
            $stateProvider.state(courseState);
            $stateProvider.state(courseModuleShowState);
            $stateProvider.state(lessonShowState);
            $urlRouterProvider.otherwise('/');
        }]);


/***/ }),
/* 20 */
/***/ (function(module, exports) {

angular
    .module("DragDropQuiz", ["dndLists"])
    .directive("dragDropQuiz", function ($sce) {
        return {
            link: function ($scope) {
                function shuffle(b) {
                    var a = angular.copy(b);
                    var j, x, i;
                    for (i = a.length - 1; i > 0; i--) {
                        j = Math.floor(Math.random() * (i + 1));
                        x = a[i];
                        a[i] = a[j];
                        a[j] = x;
                    }
                    return a;
                }
                var scope = $scope;
                var placeholderSign = 'placeholderSegment';
                scope.placeholderSegments = scope.placeholder.replace(/{\d}/gi, placeholderSign).split(placeholderSign);

                scope.segmentsCollection = [scope.placeholderSegments, scope.answers];
                scope.shuffleAnswers = shuffle(scope.answers);
                scope.lengths = [];
                for(var i = 0; i<scope.segmentsCollection.length;i++) {
                    scope.lengths.push(scope.segmentsCollection[i].length);
                }

                scope.segments = [];
                var maxLength = Math.max.apply(null,scope.lengths);
                for(var k = 0; k<maxLength; k++){
                    for(var j = 0; j<scope.segmentsCollection.length;j++) {
                        if (scope.segmentsCollection[j]) {
                            scope.segments.push(scope.segmentsCollection[j][k]);
                        }
                    }
                }
                scope.segments = scope.segments.map(function (segment) {
                    if(typeof segment === 'undefined'){
                        segment='';
                    }
                    if(typeof segment==='object'){
                        return {
                            typeof:'placeholder',
                            text: segment.text
                        };
                    }
                    if(typeof segment==='string'){
                        return {
                            typeof:'raw',
                            text: segment
                        };
                    }
                    return segment;
                });
                scope.segments = scope.segments.map(function (segment) {
                    var html;
                    html = segment.text;
                    html = html.replace(/\r\n/gi,'<br/>');
                    html = html.replace(/ /gi,'&nbsp;');
                    segment.html = html;
                    segment.html = $sce.trustAsHtml(segment.html);
                    return segment;
                });
                scope.segments = scope.segments.map(function (segment) {
                    segment.answers = [];
                    return segment;
                });
                scope.selectAnswer = function (answer) {
                    var selectedSegment;
                    if(scope.isSelectedAnswer(answer)){
                        return;
                    }
                    for(var i = 0;i<scope.segments.length;i++){
                        if(scope.segments[i].answers.length === 0 && scope.segments[i].typeof === 'placeholder') {
                            selectedSegment = scope.segments[i];
                            scope.segments[i].answers = [angular.copy(answer)];
                            break;
                        }
                    }

                    selectedSegment.answers = [];
                    selectedSegment.answers = [angular.copy(answer)];
                };
                scope.isSelectedAnswer = function (answer) {
                    for(var i = 0;i<scope.segments.length;i++){
                        if(scope.segments[i].answers.length > 0){
                            if (scope.segments[i].answers[0].id === answer.id) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                var runCheckerQuizzesCorrect = function () {
                    var selectedAnswers = [];
                    for(var i = 0; i <scope.segments.length;i++){
                        var segment = scope.segments[i];
                        var answer = segment.answers[0];
                        if(typeof answer === 'undefined'){
                            continue;
                        }
                        selectedAnswers.push(answer);
                    }
                    var answers_ids = scope.answers.map(function (t) {return t.id; });
                    var selected_answers_ids = selectedAnswers.map(function (t) { return t.id; });
                    if(answers_ids.length !== selected_answers_ids.length){
                        return false;
                    }
                    for(var l = 0; l<answers_ids.length;l++){
                        if(answers_ids[l]!==selected_answers_ids[l]){
                            return false;
                        }
                    }
                    scope.eventCorrect();
                };

                scope.$watch('segments|json', function () {
                    runCheckerQuizzesCorrect();
                })
            },
            template: '<div class="placeholderDragAndDropQuiz placeholderQuiz"> <div class="placeholders"> <div class="textblock raw"> <span ng-repeat="segment in segments track by $index"> <span ng-if="segment.typeof === \'raw\'" ng-bind-html="segment.html"></span> <span ng-if="segment.typeof === \'placeholder\'" class="placeholder" ng-class="{active:(segment.answers.length > 0)}"> <span class="answer" dnd-list="segment.answers" dnd-drop="segment.answers=[item]"> <span style="visibility: hidden;position: static;">{{segment.text}}</span> <span ng-repeat="answer in segment.answers" dnd-draggable="answer" dnd-moved="segment.answers=[]" ng-click="segment.answers=[]">{{answer.text}}</span> </span> <span class="underline"></span> </span> </span> </div> </div> <div class="answers" dnd-list="[]"> <div class="answer" ng-class="{selected:isSelectedAnswer(answer)}" ng-repeat="answer in shuffleAnswers" dnd-draggable="answer" dnd-effect-allowed="copy" ng-click="selectAnswer(answer)" >{{answer.text}}</div> </div> </div>',
            scope: {
            eventCorrect: "&eventAnswersCorrect",
                placeholder: "=",
                answers: "="
        }
    };
    })
    .filter('typeof', function () {
        return function (value, wordwise, max, tail) {
            return typeof value;
        }
    })
;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

angular
    .module("FillInBlankQuiz", [])
    .directive("fillInBlankQuiz", [
        "$sce",
        function ($sce) {
            return {
                link: function ($scope) {
                    function shuffle(b) {
                        var a = angular.copy(b);
                        var j, x, i;
                        for (i = a.length - 1; i > 0; i--) {
                            j = Math.floor(Math.random() * (i + 1));
                            x = a[i];
                            a[i] = a[j];
                            a[j] = x;
                        }
                        return a;
                    }
                    var scope = $scope;
                    var placeholderSign = 'placeholderSegment';
                    scope.placeholderSegments = scope.placeholder.replace(/{\d}/gi, placeholderSign).split(placeholderSign);

                    scope.segmentsCollection = [scope.placeholderSegments, scope.answers];
                    scope.shuffleAnswers = shuffle(scope.answers);
                    scope.lengths = [];
                    for(var i = 0; i<scope.segmentsCollection.length;i++) {
                        scope.lengths.push(scope.segmentsCollection[i].length);
                    }

                    scope.segments = [];
                    var maxLength = Math.max.apply(null,scope.lengths);
                    for(var k = 0; k<maxLength; k++){
                        for(var j = 0; j<scope.segmentsCollection.length;j++) {
                            if (scope.segmentsCollection[j]) {
                                scope.segments.push(scope.segmentsCollection[j][k]);
                            }
                        }
                    }
                    scope.segments = scope.segments.map(function (segment) {
                        if(typeof segment === 'undefined'){
                            segment='';
                        }
                        if(typeof segment==='object'){
                            return {
                                postfix: segment.properties.postfix,
                                prefix: segment.properties.prefix,
                                typeof:'placeholder',
                                text: segment.text
                            };
                        }
                        if(typeof segment==='string'){
                            return {
                                typeof:'raw',
                                text: segment
                            };
                        }
                        return segment;
                    });
                    scope.segments = scope.segments.map(function (segment) {
                        var html;
                        html = segment.text;
                        html = html.replace(/\r\n/gi,'<br/>');
                        html = html.replace(/ /gi,'&nbsp;');
                        segment.html = html;
                        segment.html = $sce.trustAsHtml(segment.html);
                        return segment;
                    });
                    scope.segments = scope.segments.map(function (segment) {
                        segment.answers = [];
                        return segment;
                    });
                    scope.fill = function (segment, event) {
                        segment.filledIn = event.target.innerText;
                        runCheckerQuizzesCorrect();
                    };

                    var runCheckerQuizzesCorrect = function () {
                        var filledAnswers = scope.segments.filter(function (value) {
                            return value.typeof === 'placeholder'
                        });
                        var correctedFilledAnswers = filledAnswers.filter(function (value) {
                            return value.text === value.filledIn;
                        });
                        if(correctedFilledAnswers.length === filledAnswers.length){
                            scope.eventCorrect();
                        }
                    };
                },
                template: '<div class="answers placeholderTypeInQuiz placeholderQuiz"> <div class="textblock raw"> <span ng-repeat="segment in segments"> <div class="placeholder" ng-if="segment.typeof === \'placeholder\'"> <div class="answer"> <div class="typeInControl"> <div class="prefix">{{segment.prefix}}</div> <div class="answer"> <span class="realText">{{segment.text}}</span> <span class="resultText" contenteditable="true" ng-keydown="fill(segment, $event)" ng-keyup="fill(segment, $event)"></span> </div> <div class="postfix">{{segment.postfix}}</div> </div> </div> </div> <span ng-if="segment.typeof === \'raw\'" ng-bind-html="segment.html"></span> </span> </div> </div>',
                scope: {
                    eventCorrect: "&eventCorrect",
                    placeholder: "=",
                    answers: "="
                }
            };
        }
    ])
    .filter('typeof', function () {
        return function (value, wordwise, max, tail) {
            return typeof value;
        }
    })
;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

angular.module("SingleChoiceQuiz", []).directive("singleChoiceQuiz", function () {
    return {
        template: '<div id="quizSelector"> <div class="answers multipleChoiceQuiz"> <div class="answer materialRadio" ng-class="{selected:answer.selected}" ng-repeat="answer in answers" ng-click="selectAnswer(answer)"> <div class="icon"> <div class="outline"></div> <div class="fill"></div> </div> <span>{{answer.text}}</span> </div> </div> </div>',
        scope: {
            eventCorrect: "&",
            answers: "="
        },
        link: function (scope) {
            scope.selectAnswer = function (answer) {
                for (var i = 0; i < scope.answers.length; i++) {
                    if (answer.id === scope.answers[i].id) {
                        scope.answers[i].selected = true;
                    } else {
                        scope.answers[i].selected = false;
                    }
                }
            };
            scope.$watch("answers|json", function (newVal) {
                var correctAnswers = scope.answers.filter(function (value) {
                    return value.selected && value.isCorrect;
                });
                var selectedAnswers = scope.answers.filter(function (value) {
                    return value.selected;
                });
                if(correctAnswers.length === selectedAnswers.length) {
                    scope.eventCorrect();
                }
            })
        }
    };
});


/***/ }),
/* 23 */
/***/ (function(module, exports) {

angular.module("MultipleChoiceQuiz", []).directive("multipleChoicesQuiz", function () {
    return {
        template: '<div id="quizSelector"> <div class="answers multipleChoiceQuiz"> <div class="answer materialCheckbox" ng-class="{selected:answer.selected}" ng-repeat="answer in answers" ng-click="selectAnswer(answer)"> <div class="icon"> <div class="outline"></div> <div class="fill"></div> </div> <span>{{answer.text}}</span> </div> </div> </div>',
        scope: {
        eventCorrect: "&",
            answers: "="
    },
    link: function (scope) {
        scope.selectAnswer = function (answer) {
            for (var i = 0; i < scope.answers.length; i++) {
                if (answer.id === scope.answers[i].id) {
                    scope.answers[i].selected = !scope.answers[i].selected;
                }
            }
        };
        scope.$watch("answers|json", function () {
            var correctAnswers = scope.answers.filter(function (value) {
                return value.isCorrect;
            });
            var selectedAnswers = scope.answers.filter(function (value) {
                return value.selected;
            });
            var correctedSelectAnswers = scope.answers.filter(function (value) {
                return value.selected && value.isCorrect;
            });
            if(
                correctAnswers.length === correctedSelectAnswers.length &&
                correctAnswers.length === selectedAnswers.length
            ) {
                scope.eventCorrect();
            }
        })
    }
};
});


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = [
    "$rootScope",
    "$scope",
    "CourseService",
    function ($rootScope, scope, CourseService) {
        CourseService.all().then(function (resp) {
            scope.courses = $rootScope.courses = resp.data;
            scope.courses = scope.courses.map(function (course) {
                CourseService.get(course).then(function (resp) {
                    var respData = resp.data.course;
                    course.alias = respData.alias;
                    course.glossary = respData.glossary;
                    course.groups = respData.groups;
                    course.id = respData.id;
                    course.language = respData.language;
                    course.languageName = respData.languageName;
                    course.modules = respData.modules;
                    course.name = respData.name;
                    course.tags = respData.tags;
                    course.version = respData.version;
                });
                return course;
            })
        })
    }
];


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<div class=\"md-padding\" layout-xs=\"column\" layout=\"row\" id=\"courses\">\r\n    <div flex-xs flex-gt-xs=\"50\" layout=\"column\" ng-repeat=\"course in courses\">\r\n        <md-card class=\"course\" flex>\r\n            <md-card-title>\r\n                <md-card-title-text>\r\n                    <span class=\"md-headline\">{{course.title}}</span>\r\n                    <span class=\"md-subhead\">{{course.description}}</span>\r\n                </md-card-title-text>\r\n                <md-card-title-media>\r\n                    <div class=\"md-media-xs card-media\">\r\n                        <img ng-src=\"{{course.icon}}\" alt=\"\">\r\n                    </div>\r\n                </md-card-title-media>\r\n            </md-card-title>\r\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\r\n                <md-button ui-sref=\"courses.show({slug:course.slug})\">Tham gia ngay</md-button>\r\n            </md-card-actions>\r\n            <md-card-content>\r\n                <ul>\r\n                    <li ng-repeat=\"module in course.modules\">{{module.name}}</li>\r\n                </ul>\r\n            </md-card-content>\r\n        </md-card>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = [
    "$scope",
    "CourseService",
    "$stateParams",
    "$state",
    "$rootScope",
    function (scope, CourseService, $stateParams, state, rootScope) {
        CourseService.get({slug:$stateParams.slug}).then(function (resp) {
            scope.course = resp.data.course;
            scope.course.slug = $stateParams.slug;
        });
        CourseService.all().then(function (resp) {
            if (!rootScope.courses) {
                rootScope.courses = resp.data;
            }

            rootScope.courses = rootScope.courses.map(function (course) {
                CourseService.get(course).then(function (resp) {
                    var respData = resp.data.course;
                    course.modules = respData.modules;
                    course.name = respData.name;
                });

                return course;
            });
        });
        scope.stateGo = function (stateName, stateParams) {
            state.go(stateName, stateParams);
        };

    }
];


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<div id=\"modulesView\" class=\"modulePanel view\" style=\"z-index: 101; display: block; opacity: 1;\">\r\n    <div class=\"appModule \" ng-class=\"{none:!module.alignment,center:module.alignment}\" ng-repeat=\"module in course.modules\">\r\n        <div class=\"content\" ng-click=\"stateGo('courses.show.module',({course_id:course.id,module_id:module.id}))\">\r\n            <div class=\"appModuleCircle materialResponse\">\r\n                <img alt=\"\" src=\"https://api.sololearn.com/uploads/Modules/{{course.id}}/{{module.id}}.png\">\r\n            </div>\r\n            <span>{{module.name}}</span>\r\n        </div>\r\n    </div>\r\n    <div class=\"appModule center certificate\">\r\n        <div class=\"content\">\r\n            <i class=\"icon\"></i>\r\n            <span>Certificate</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = [
    "$rootScope",
    "$scope",
    "$stateParams",
    "CourseService",
    "$state",
    function (rootScope, scope, $stateParams, CourseService, state) {
        CourseService.get({slug:$stateParams.slug}).then(function (resp) {
            scope.course = resp.data.course;
            scope.module = scope.course.modules.filter(function (module) {
                return Number($stateParams.module_id) === Number(module.id);
            })[0];
        });
        CourseService.all().then(function (resp) {
            if (!rootScope.courses) {
                rootScope.courses = resp.data;
            }

            rootScope.courses = rootScope.courses.map(function (course) {
                CourseService.get(course).then(function (resp) {
                    var respData = resp.data.course;
                    course.modules = respData.modules;
                    course.name = respData.name;
                });

                return course;
            });
        });
        scope.goto = function (route, params) {
            state.go(route, params);
        }
    }
];


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<div id=\"lessonsView\" class=\"lessonPanel view\" style=\"z-index: 108; display: block; opacity: 1;\">\r\n    <div class=\"appLesson checkpoint normal\" style=\"opacity: 1; transform: translateY(0px);\" ng-repeat=\"lesson in module.lessons\" ng-click=\"goto('courses.show.module.lesson',{ slug:course.alias, course_id:course.id, module_id:module.id, lesson_id:lesson.id})\">\r\n        <div class=\"number\">\r\n            <span>{{$index+1}}/{{module.lessons.length+1}}</span>\r\n        </div>\r\n        <div class=\"name\">{{lesson.name}}</div>\r\n        <div class=\"info\">\r\n            <i class=\"icon\"></i>\r\n            <span>{{lesson.quizCount}} questions</span></div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = [
    "$scope",
    "LessonService",
    "$stateParams",
    function (scope, LessonService, params) {
        LessonService.get(params.course_id, params.module_id, params.lesson_id).then(function (resp) {
            scope.lesson = resp.data.lesson;
            scope.selectLessonText(scope.lesson.quizzes[0]);
        });
        scope.$watch('lesson.quizzes|json', function () {
            if (scope.lesson && scope.lesson.quizzes) {
                scope.quizSelected = scope.lesson.quizzes.filter(function (quiz) {
                    return quiz.selected;
                })[0];
            }
        });
        scope.deSelectAllItem = function () {
            scope.lesson.quizzes = scope.lesson.quizzes.map(function (quiz) {
                quiz.selected = false;
                return quiz;
            });
        };
        scope.selectLessonText = function (quiz) {
            scope.deSelectAllItem();
            quiz.selected = true;
            scope.view = 'text';
        };
        scope.selectQuiz = function (quiz) {
            scope.deSelectAllItem();
            quiz.selected = true;
            scope.view = 'quiz';
        };
        scope.done = function (selectedQuiz) {
            return LessonService.done(selectedQuiz);
        };
        scope.isDone = function (selectedQuiz) {
            return LessonService.isDone(selectedQuiz);
        };
        scope.$watch('quizSelected.question|json', function () {
            if(!scope.quizSelected){
                return;
            }
            scope.placeholder = scope.quizSelected.question.split('[!raw!]')[1];
            if(typeof scope.placeholder === 'undefined'){
                scope.placeholder = scope.quizSelected.question.split('[!html!]')[1];
            }
        });
        scope.$watch('quizSelected.question|json', function () {
            if(!scope.quizSelected){
                return;
            }
            let questionSegments = scope.quizSelected.question.split('[!raw!]');
            scope.question = questionSegments[0];
            if(typeof questionSegments[1] === 'undefined'){
                scope.question = scope.quizSelected.question.split('[!html!]')[0];
            }
        });
    }
];


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<div class=\"lessonViewInfo\">\r\n    <div class=\"lessonOutline text\">\r\n    <span class=\"video\" ng-class=\"{active:(quiz.selected && view=='text')}\"  ng-repeat-start=\"quiz in lesson.quizzes\" ng-click=\"selectLessonText(quiz)\">\r\n        <img class=\"left\" alt=\" \" src=\"https://www.sololearn.com/Play/arrow.png?r=54&g=171&b=203\">\r\n        <i></i>\r\n        <img class=\"right\" alt=\" \" src=\"https://www.sololearn.com/Play/arrow.png?r=54&g=171&b=203\">\r\n    </span>\r\n\r\n    <span class=\"quiz\" ng-class=\"{active:quiz.selected && view=='quiz'}\" ng-repeat-end ng-click=\"selectQuiz(quiz)\">\r\n        <img class=\"left\" alt=\" \" src=\"https://www.sololearn.com/Play/arrow.png?r=54&g=171&b=203\">\r\n        <i></i>\r\n        <img class=\"right\" alt=\" \" src=\"https://www.sololearn.com/Play/arrow.png?r=54&g=171&b=203\">\r\n    </span>\r\n    </div>\r\n</div>\r\n<div id=\"textView\" ng-show=\"view=='text'\">\r\n    <div class=\"textContentContainer\">\r\n        <div id=\"textContent\" class=\"text\">\r\n            <bb-decode content=\"quizSelected.textContent\"></bb-decode>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div id=\"quizView\" ng-show=\"view=='quiz'\" class=\"view elevated\" style=\"display: block; z-index: 116; transform: translateX(0px) scaleX(1) scaleY(1);\">\r\n    <div class=\"quizQuestion\">\r\n        {{question}}\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 1\">\r\n        <single-choice-quiz answers=\"quizSelected.answers\" event-correct=\"done(quizSelected)\"></single-choice-quiz>\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 2\">\r\n        {{quizSelected.type}}\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 3\">\r\n        {{quizSelected.question.split('[!raw!]')[1]}}\r\n        <fill-in-blank-quiz answers=\"quizSelected.answers\" event-correct=\"done(quizSelected)\" placeholder=\"placeholder\"></fill-in-blank-quiz>\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 4\">\r\n        {{quizSelected.type}}\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 5\">\r\n        {{quizSelected.type}}\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 6\">\r\n        {{quizSelected.type}}\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 7\">\r\n        {{quizSelected.type}}\r\n    </div>\r\n    <div ng-if=\"quizSelected.type === 8\">\r\n        {{quizSelected.type}}\r\n    </div>\r\n    <div class=\"actionBar\">\r\n        <button class=\"actionButton checkButton\" style=\"background-color: rgb(100, 221, 23); opacity: 1; transform: scaleX(1) scaleY(1);\" ng-click=\"check()\"></button>\r\n    </div>\r\n</div>\r\n";

/***/ })
/******/ ]);