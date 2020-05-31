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
/******/ 	return __webpack_require__(__webpack_require__.s = "./background/chrome_action.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./background/chrome_action.ts":
/*!*************************************!*\
  !*** ./background/chrome_action.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(/*! ./common */ "./background/common.ts");
chrome.pageAction.onClicked.addListener(common_1.clickAction);
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {
                            urlMatches: common_1.matchTweetURL
                        }
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});
chrome.runtime.onMessage.addListener(common_1.onMessageFromContentScript);


/***/ }),

/***/ "./background/common.ts":
/*!******************************!*\
  !*** ./background/common.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchTweetURL = 'https?://(?:mobile\\.)?twitter.com/(.+)/status/(\\d+)';
exports.matchTweetURLRegex = new RegExp(exports.matchTweetURL);
const tweetToLoad = {};
function onMessageFromContentScript(request, sender, _sendResponse) {
    switch (request.message) {
        case 'share':
            // Handle share button click. The payload is the tree structure.
            fetch('https://treeverse.app/share', {
                method: 'POST',
                body: JSON.stringify(request.payload),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then((response) => response.text())
                .then((response) => chrome.tabs.create({ url: response }));
            break;
        case 'ready':
            if (tweetToLoad.value) {
                launchTreeverse(sender.tab.id, tweetToLoad.value);
                tweetToLoad.value = null;
            }
            break;
    }
}
exports.onMessageFromContentScript = onMessageFromContentScript;
function launchTreeverse(tabId, tweetId) {
    chrome.tabs.sendMessage(tabId, {
        'action': 'launch',
        'tweetId': tweetId
    });
}
exports.launchTreeverse = launchTreeverse;
function getTweetIdFromURL(url) {
    let match = exports.matchTweetURLRegex.exec(url);
    if (match) {
        return match[2];
    }
}
exports.getTweetIdFromURL = getTweetIdFromURL;
function injectScripts(tabId, tweetId) {
    return __awaiter(this, void 0, void 0, function* () {
        let state = yield new Promise((resolve) => {
            chrome.tabs.executeScript(tabId, {
                code: `(typeof Treeverse !== 'undefined') ? Treeverse.PROXY.state : 'missing'`
            }, resolve);
        });
        console.log('state', state);
        switch (state[0]) {
            case 'ready':
                launchTreeverse(tabId, tweetId);
                break;
            case 'listening':
            case 'waiting':
            case 'missing':
            default:
                console.log(`Treeverse in non-ready state ${state[0]}`);
                tweetToLoad.value = tweetId;
                // Force the tab to reload.
                chrome.tabs.reload(tabId);
                // Ensure the tab loads.
                setTimeout(() => {
                    if (tweetToLoad.value !== null) {
                        alert(`Treeverse was unable to access the tweet data needed to launch.

If you report this error, please mention that the last proxy state was ${state[0]}`);
                    }
                }, 2000);
        }
    });
}
exports.injectScripts = injectScripts;
function clickAction(tab) {
    const tweetId = getTweetIdFromURL(tab.url);
    injectScripts(tab.id, tweetId);
}
exports.clickAction = clickAction;


/***/ })

/******/ });
//# sourceMappingURL=background.js.map