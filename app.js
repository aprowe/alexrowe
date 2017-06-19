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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findUser = findUser;
exports.findSession = findSession;
exports.insertSession = insertSession;

var _monk = __webpack_require__(11);

var _monk2 = _interopRequireDefault(_monk);

var _config = __webpack_require__(2);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _monk2.default)(_config2.default.MONGO_URL);
var users = db.get('users');
var sessions = db.get('sessions');

exports.default = db;
function findUser(name, password) {
  return users.findOne({
    name: name,
    password: password
  });
}

function findSession(session_id) {
  return sessions.findOne(session_id);
}

function insertSession(session) {
  if (!session._id) {
    return sessions.insert(session);
  } else {
    return sessions.update(session._id, session);
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Development / default Config
var config = {
  PORT: 3000,
  MONGO_URL: 'mongodb://localhost/api'
};

// Production Config
/**
 * Config Variables
 */

var prodConfig = {
  PORT: 80
};

if (undefined == 'production') {
  config = _lodash2.default.merge(config, prodConfig);
}

exports.default = config;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authenticate;

var _db = __webpack_require__(0);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fail(res) {
  res.status(401).end('Unauthorized');
}

function parseAuth(authString) {
  var b64 = authString.split(' ')[1];

  return Buffer.from(b64, 'base64').toString().split(':');
}

function authenticate(req, res, next) {

  // Set authentication type
  res.set('WWW-Authenticate', 'Basic');

  var authorization = req.headers.authorization;

  if (!authorization) {
    console.log('No Authorization Header Found');
    return fail(res);
  }

  // Attempt
  var creds = void 0;
  try {
    creds = parseAuth(authorization);
  } catch (e) {
    console.log('Failed to parse Authorization');
    return fail(res);
  }

  (0, _db.findUser)(creds[0], creds[1]).then(function (user) {
    if (!user) {
      return fail(res);
    }

    // Attach to request
    req.user = user;
    req.session.user_id = user._id;

    // Continue
    next();
  });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSession = getSession;
exports.saveSession = saveSession;

var _db = __webpack_require__(0);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSession(req, res, next) {
  var session_id = req.cookies.session_id;

  // If a session is present
  if (session_id) {
    return (0, _db.findSession)(session_id).then(function (session) {
      req.session = session;
      next();
    });
  }

  // Create a new session object
  var session = {
    date_created: new Date()
  };

  // Create a new session in the database
  return (0, _db.insertSession)(session).then(function (session) {
    res.cookie('session_id', session._id);
    req.session = session;
    next();
  });
}

function saveSession(req, res, next) {
  if (req.session) {
    (0, _db.insertSession)(req.session);
  }

  next();
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(3);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res, next) {
  res.json(req.session);
  next();
});

router.get('/test', function (req, res, next) {
  res.json({ works: true });
  next();
});

exports.default = router;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("harp");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var _express = __webpack_require__(3);

var _express2 = _interopRequireDefault(_express);

var _bodyParser = __webpack_require__(7);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = __webpack_require__(8);

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _db = __webpack_require__(0);

var _db2 = _interopRequireDefault(_db);

var _basicAuth = __webpack_require__(4);

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _sessionHandler = __webpack_require__(5);

var _routes = __webpack_require__(6);

var _routes2 = _interopRequireDefault(_routes);

var _config = __webpack_require__(2);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialize app
var app = (0, _express2.default)();

// Define Middleware and routes
app.use((0, _cookieParser2.default)()).use(_sessionHandler.getSession).use(_express2.default.static(__dirname + '/../static', {
  extensions: ['html']
}));

// Only use harp for development
if (undefined !== 'production') {
  app.use(__webpack_require__(9).mount(__dirname + '/../static'));
}

app.use('/admin', _basicAuth2.default).use(_bodyParser2.default.json()).use(_routes2.default).use(_sessionHandler.saveSession);

app.listen(_config2.default.PORT, function () {
  console.log('Listening on port ' + _config2.default.PORT);
});
/* WEBPACK VAR INJECTION */}.call(exports, "src"))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("monk");

/***/ })
/******/ ]);