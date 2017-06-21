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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(0);

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findUser = findUser;
exports.findSession = findSession;
exports.insertSession = insertSession;

var _monk = __webpack_require__(17);

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
/* 4 */
/***/ (function(module, exports) {

module.exports = require("hogan.js");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authenticate;

var _db = __webpack_require__(3);

var _lodash = __webpack_require__(0);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEMPLATES = undefined;

exports.default = function (req, res, next) {
  res.mustache = function (partial, data, templateData) {

    // Get the appropriate template
    var templateFn = res.mustache.template;

    if (!templateFn) {
      throw 'Invalid templates: ' + res.mustache.template;
    }

    // Render the page
    var page = templateFn(_lodash2.default.merge({
      head: '',

      // Render the partial
      body: partial(data),

      // Give the data to the javascript
      script: 'window.globalEvents.emit(        \'receive_data\', ' + JSON.stringify(data) + ');'
    }, templateData));

    res.send(page);
  };

  res.mustache.template = TEMPLATES.index;
  next();
};

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _index = __webpack_require__(16);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Object of all templates
var TEMPLATES = exports.TEMPLATES = {
  index: _index2.default
};

// Import templates to build them in at compile time

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSession = getSession;
exports.saveSession = saveSession;

var _db = __webpack_require__(3);

var _lodash = __webpack_require__(0);

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _qmote = __webpack_require__(14);

var _qmote2 = _interopRequireDefault(_qmote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res, next) {
  res.json(req.session);
  next();
});

// QMote Actions
router.get('/qmote/:action', function (req, res, next) {
  var action = _qmote2.default[req.params.action];

  console.log(JSON.stringify(req.headers));
  if (!action) {
    res.status(400).send('Action ' + req.params.action + ' not found');
    return;
  }

  action(req.query).then(function (status) {
    res.json({ status: status });
    next();
  });
});

exports.default = router;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _index = __webpack_require__(15);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res, next) {
  res.mustache(_index2.default, { foo: 'bar' });
  next();
});

exports.default = router;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _bodyParser = __webpack_require__(10);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = __webpack_require__(11);

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _basicAuth = __webpack_require__(5);

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _sessionHandler = __webpack_require__(7);

var _mustache = __webpack_require__(6);

var _mustache2 = _interopRequireDefault(_mustache);

var _api = __webpack_require__(8);

var _api2 = _interopRequireDefault(_api);

var _routes = __webpack_require__(9);

var _routes2 = _interopRequireDefault(_routes);

var _config = __webpack_require__(2);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialize app
var app = (0, _express2.default)();

// Define Middleware and routes
app.use((0, _cookieParser2.default)()).use(_sessionHandler.getSession).use(_mustache2.default
// .use(express.static(__dirname + '/../static', {
//   extensions: ['html']
// }))

// Make client assets available
).use('/assets', _express2.default.static('public'));

// Only use harp for development
if (undefined !== 'production') {
  // app.use(require('harp').mount(__dirname + '/../static'));
}

app.use('/', _routes2.default).use('/admin', _basicAuth2.default).use('/api', _api2.default).use(_bodyParser2.default.json()).use(_sessionHandler.saveSession);

app.listen(_config2.default.PORT, function () {
  console.log('Listening on port ' + _config2.default.PORT);
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var QMote = {};

QMote.debug = function (params) {
  console.log(JSON.stringify(params));
  return Promise.resolve('success');
};

exports.default = QMote;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var H = __webpack_require__(4);
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<h2 id=\"welcome-foo-\">Welcome ");t.b(t.v(t.f("foo",c,p,0)));t.b("</h2>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<h2 id=\"welcome-foo-\">Welcome {{ foo }}</h2>\n", H);return T.render.apply(T, arguments); };

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var H = __webpack_require__(4);
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<html>");t.b("\n" + i);t.b("  <head>");t.b("\n" + i);t.b("    <script src='assets/client.js'></script>");t.b("\n" + i);t.b("    <script id='_data'> ");t.b(t.t(t.f("script",c,p,0)));t.b(" </script>");t.b("\n" + i);t.b("  </head>");t.b("\n" + i);t.b("  <body>");t.b("\n" + i);t.b("    ");t.b(t.t(t.f("body",c,p,0)));t.b("\n" + i);t.b("  </body>");t.b("\n" + i);t.b("</html>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<html>\n  <head>\n    <script src='assets/client.js'></script>\n    <script id='_data'> {{{ script }}} </script>\n  </head>\n  <body>\n    {{{ body }}}\n  </body>\n</html>\n", H);return T.render.apply(T, arguments); };

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("monk");

/***/ })
/******/ ]);