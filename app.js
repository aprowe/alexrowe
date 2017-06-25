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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
  MONGO_URL: 'mongodb://localhost/api',
  LYRICS_DB_URL: 'mongodb://localhost/lyrics'
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
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findUser = findUser;
exports.findSession = findSession;
exports.insertSession = insertSession;

var _monk = __webpack_require__(26);

var _monk2 = _interopRequireDefault(_monk);

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = __webpack_require__(25);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = _bluebird2.default;

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
/* 5 */
/***/ (function(module, exports) {

module.exports = require("hogan.js");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authenticate;

var _models = __webpack_require__(4);

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

  (0, _models.findUser)(creds[0], creds[1]).then(function (user) {
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
/* 7 */
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
      data: 'window.globalEvents.emit(        \'receive_data\', ' + JSON.stringify(data) + ');'

    }, templateData));

    res.send(page);
  };

  res.mustache.template = TEMPLATES.base;
  next();
};

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(24);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Object of all templates
var TEMPLATES = exports.TEMPLATES = {
  base: _base2.default
};

// Import templates to build them in at compile time

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSession = getSession;
exports.saveSession = saveSession;

var _models = __webpack_require__(4);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSession(req, res, next) {
  var session_id = req.cookies.session_id;

  // If a session is present
  if (session_id) {
    return (0, _models.findSession)(session_id).then(function (session) {
      req.session = session;
      next();
    });
  }

  // Create a new session object
  var session = {
    date_created: new Date()
  };

  // Create a new session in the database
  return (0, _models.insertSession)(session).then(function (session) {
    res.cookie('session_id', session._id);
    req.session = session;
    next();
  });
}

function saveSession(req, res, next) {
  if (req.session) {
    (0, _models.insertSession)(req.session);
  }

  next();
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _qmote = __webpack_require__(19);

var _qmote2 = _interopRequireDefault(_qmote);

var _page = __webpack_require__(18);

var _page2 = _interopRequireDefault(_page);

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

router.get('/folder', _page2.default.folders);
router.get('/page/create', _page2.default.create);

exports.default = router;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _index = __webpack_require__(23);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res, next) {
  res.mustache(_index2.default, { foo: 'bar' });
  next();
});

exports.default = router;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _songs = __webpack_require__(17);

var _songs2 = _interopRequireDefault(_songs);

var _artists = __webpack_require__(16);

var _artists2 = _interopRequireDefault(_artists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var createRoute = function createRoute(fn) {
  return function (req, res, next) {
    var query = req.query;

    // Type cast numbers
    for (var i in query) {
      // if (RegExp.match(/[0-9]*(.|)[0-9]+/,query[i])) {
      // query[i] = Number(query[i]);
      // }
    }

    fn(query, req).then(function (json) {
      res.json(json);
    }).catch(function (err) {
      res.status(400).json(err);
    });
  };
};

var songRoutes = _lodash2.default.mapValues(_songs2.default, function (fn) {
  return createRoute(fn);
});
var artistRoutes = _lodash2.default.mapValues(_artists2.default, function (fn) {
  return createRoute(fn);
});

router.get('/song', songRoutes.list);
router.get('/song/search', songRoutes.search);
router.get('/song/:song_id', songRoutes.find);

router.get('/artist', artistRoutes.list);
router.get('/artist/search', artistRoutes.search);
router.get('/artist/:artist_id', artistRoutes.find);

exports.default = router;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("harp");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _bodyParser = __webpack_require__(12);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = __webpack_require__(13);

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _basicAuth = __webpack_require__(6);

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _sessionHandler = __webpack_require__(8);

var _mustache = __webpack_require__(7);

var _mustache2 = _interopRequireDefault(_mustache);

var _api = __webpack_require__(9);

var _api2 = _interopRequireDefault(_api);

var _lyrics = __webpack_require__(11);

var _lyrics2 = _interopRequireDefault(_lyrics);

var _routes = __webpack_require__(10);

var _routes2 = _interopRequireDefault(_routes);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialize app
var app = (0, _express2.default)();

// Define Middleware and routes
app.use((0, _cookieParser2.default)()).use(_sessionHandler.getSession).use(_mustache2.default
// Make client assets available
).use('/assets', _express2.default.static('assets')

// Make Harp assets available
).use(_express2.default.static(__dirname + '/../static', {
  extensions: ['html']
}));

// Only use harp for development
if (undefined !== 'production') {
  app.use(__webpack_require__(14).mount(__dirname + '/../static'));
}

app.use('/app', _routes2.default).use('/admin', _basicAuth2.default).use('/api', _api2.default).use('/api/lyrics', _lyrics2.default).use(_bodyParser2.default.json()).use(_sessionHandler.saveSession);

app.listen(_config2.default.PORT, function () {
  console.log('Listening on port ' + _config2.default.PORT);
});
/* WEBPACK VAR INJECTION */}.call(exports, "src"))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(async) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _artist = __webpack_require__(20);

var _artist2 = _interopRequireDefault(_artist);

var _song = __webpack_require__(21);

var _song2 = _interopRequireDefault(_song);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {};

var attachSongs = function attachSongs(artist) {
  return new Promise(function (res, rej) {
    _song2.default.find({ artist_id: artist.id }).then(function (songList) {
      res();
    });
  });
};

controller.list = function (_ref) {
  var _ref$limit = _ref.limit,
      limit = _ref$limit === undefined ? 4 : _ref$limit,
      _ref$with_songs = _ref.with_songs,
      with_songs = _ref$with_songs === undefined ? false : _ref$with_songs;


  var ret = [];
  return new Promise(function (resolve, reject) {
    _artist2.default.find().limit(limit).then(function (artistList) {
      if (!with_songs) {
        return resolve(artistList);
      }

      async.each(artistList, function (artist, cb) {
        _song2.default.find({ artist_id: artist.id }).then(function (songList) {
          console.log(songList);
          artist.songs = songList;
          cb();
        });
      }, resolve);
    });
  });
};

controller.search = function (query) {
  return _artist2.default.find(query);
};

controller.find = function (query) {
  return _artist2.default.findOne(query);
};

exports.default = controller;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _song = __webpack_require__(21);

var _song2 = _interopRequireDefault(_song);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {};

controller.list = function (query) {
  query = _lodash2.default.merge({
    limit: 10
  }, query);

  return _song2.default.find().limit(Number(query.limit));
};

controller.search = function (query) {
  return _song2.default.find(query);
};

controller.find = function (query) {
  return _song2.default.findOne(query);
};

exports.default = controller;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _page = __webpack_require__(22);

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {
  folders: function folders(req, res, next) {
    _page2.default.findFolders(function (err, folders) {
      res.json(err || folders);
      next();
    });
  },
  create: function create(req, res, next) {
    _page2.default.create({
      title: 'First Article',
      subtitle: 'First Article',
      slug: 'my_article',
      body: 'Lorem',
      folder: 'funtime'
    }, function (err, body) {
      res.json(err || body);
    });
    next();
  }
};

exports.default = controller;

/***/ }),
/* 19 */
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COLLECTION_NAME = 'artists';

var connection = _mongoose2.default.createConnection(_config2.default.LYRICS_DB_URL);

var schema = new _mongoose2.default.Schema({
  id: {
    type: Number,
    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true
  },

  link: {
    type: String
  },

  songs: [{
    type: Number,
    ref: 'songs'
  }],

  analysis: {
    language: String,
    score: Number,
    percent: Number
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date,
    default: Date.now
  }
});

exports.default = connection.model(COLLECTION_NAME, schema);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COLLECTION_NAME = 'songs';

var connection = _mongoose2.default.createConnection(_config2.default.LYRICS_DB_URL);

var schema = new _mongoose2.default.Schema({
  id: {
    type: Number,
    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true
  },

  link: {
    type: String
  },

  lyrics: {
    type: String
  },

  artist_id: {
    type: Number,
    ref: 'artist'
  },

  analysis: {
    language: String,
    stantzas: Number,
    lines: Number,
    length: Number,
    score: Number,
    percent: Number
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date,
    default: Date.now
  }
});

exports.default = connection.model(COLLECTION_NAME, schema);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = _mongoose2.default.createConnection(_config2.default.MONGO_URL);

var COLLECTION_NAME = 'page';

var schema = new _mongoose2.default.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },

  // url identifier
  slug: {
    type: String,
    required: true,
    unique: true,
    match: /[a-zA-Z0-9_\-+]+/
  },

  folder: {
    type: String,
    match: /[a-zA-Z0-9_\-+]+/
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  update_at: {
    type: Date,
    default: Date.now
  }
});

schema.statics.findFolders = function (cb) {
  this.distinct('folder', cb);
};

exports.default = conn.model(COLLECTION_NAME, schema);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var H = __webpack_require__(5);
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<h2 id=\"welcome-foo-\">Welcome ");t.b(t.v(t.f("foo",c,p,0)));t.b("</h2>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<h2 id=\"welcome-foo-\">Welcome {{ foo }}</h2>\n", H);return T.render.apply(T, arguments); };

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var H = __webpack_require__(5);
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<html>");t.b("\n" + i);t.b("  <head>");t.b("\n" + i);t.b("    <script src='assets/client.js'></script>");t.b("\n" + i);t.b("    <script id='_data'> ");t.b(t.t(t.f("data",c,p,0)));t.b(" </script>");t.b("\n" + i);t.b("  </head>");t.b("\n" + i);if(t.s(t.f("script",c,p,1),c,p,0,133,186,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("      <script src='assets/");t.b(t.v(t.f("script",c,p,0)));t.b("'></script>");t.b("\n" + i);});c.pop();}t.b("  <body>");t.b("\n" + i);t.b("    ");t.b(t.t(t.f("body",c,p,0)));t.b("\n" + i);t.b("  </body>");t.b("\n" + i);t.b("</html>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<html>\n  <head>\n    <script src='assets/client.js'></script>\n    <script id='_data'> {{{ data }}} </script>\n  </head>\n    {{#script}}\n      <script src='assets/{{script}}'></script>\n    {{/script}}\n  <body>\n    {{{ body }}}\n  </body>\n</html>\n", H);return T.render.apply(T, arguments); };

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("monk");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ })
/******/ ]);