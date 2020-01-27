'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _jsBase = require('js-base64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright  2016 Yahoo Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license    Licensed under {@link https://spdx.org/licenses/BSD-3-Clause-Clear.html BSD-3-Clause-Clear}.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *             Github.js is freely distributable.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var log = (0, _debug2.default)('github:request');

/**
 * The error structure returned when a network call fails
 */

var ResponseError = function (_Error) {
   _inherits(ResponseError, _Error);

   /**
    * Construct a new ResponseError
    * @param {string} message - an message to return instead of the the default error message
    * @param {string} path - the requested path
    * @param {Object} response - the object returned by Axios
    */
   function ResponseError(message, path, response) {
      _classCallCheck(this, ResponseError);

      var _this = _possibleConstructorReturn(this, (ResponseError.__proto__ || Object.getPrototypeOf(ResponseError)).call(this, message));

      _this.path = path;
      _this.request = response.config;
      _this.response = (response || {}).response || response;
      _this.status = response.status;
      return _this;
   }

   return ResponseError;
}(Error);

/**
 * Requestable wraps the logic for making http requests to the API
 */


var Requestable = function () {
   /**
    * Either a username and password or an oauth token for Github
    * @typedef {Object} Requestable.auth
    * @prop {string} [username] - the Github username
    * @prop {string} [password] - the user's password
    * @prop {token} [token] - an OAuth token
    */
   /**
    * Initialize the http internals.
    * @param {Requestable.auth} [auth] - the credentials to authenticate to Github. If auth is
    *                                  not provided request will be made unauthenticated
    * @param {string} [apiBase=https://api.github.com] - the base Github API URL
    * @param {string} [AcceptHeader=v3] - the accept header for the requests
    */
   function Requestable(auth, apiBase, AcceptHeader) {
      _classCallCheck(this, Requestable);

      this.__apiBase = apiBase || 'https://api.github.com';
      this.__auth = {
         token: auth.token,
         username: auth.username,
         password: auth.password
      };
      this.__AcceptHeader = AcceptHeader || 'v3';

      if (auth.token) {
         this.__authorizationHeader = 'token ' + auth.token;
      } else if (auth.username && auth.password) {
         this.__authorizationHeader = 'Basic ' + _jsBase.Base64.encode(auth.username + ':' + auth.password);
      }
   }

   /**
    * Compute the URL to use to make a request.
    * @private
    * @param {string} path - either a URL relative to the API base or an absolute URL
    * @return {string} - the URL to use
    */


   _createClass(Requestable, [{
      key: '__getURL',
      value: function __getURL(path) {
         var url = path;

         if (path.indexOf('//') === -1) {
            url = this.__apiBase + path;
         }

         var newCacheBuster = 'timestamp=' + new Date().getTime();
         return url.replace(/(timestamp=\d+)/, newCacheBuster);
      }

      /**
       * Compute the headers required for an API request.
       * @private
       * @param {boolean} raw - if the request should be treated as JSON or as a raw request
       * @param {string} AcceptHeader - the accept header for the request
       * @return {Object} - the headers to use in the request
       */

   }, {
      key: '__getRequestHeaders',
      value: function __getRequestHeaders(raw, AcceptHeader) {
         var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/vnd.github.' + (AcceptHeader || this.__AcceptHeader)
         };

         if (raw) {
            headers.Accept += '.raw';
         }
         headers.Accept += '+json';

         if (this.__authorizationHeader) {
            headers.Authorization = this.__authorizationHeader;
         }

         return headers;
      }

      /**
       * Sets the default options for API requests
       * @protected
       * @param {Object} [requestOptions={}] - the current options for the request
       * @return {Object} - the options to pass to the request
       */

   }, {
      key: '_getOptionsWithDefaults',
      value: function _getOptionsWithDefaults() {
         var requestOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         if (!(requestOptions.visibility || requestOptions.affiliation)) {
            requestOptions.type = requestOptions.type || 'all';
         }
         requestOptions.sort = requestOptions.sort || 'updated';
         requestOptions.per_page = requestOptions.per_page || '100'; // eslint-disable-line

         return requestOptions;
      }

      /**
       * if a `Date` is passed to this function it will be converted to an ISO string
       * @param {*} date - the object to attempt to coerce into an ISO date string
       * @return {string} - the ISO representation of `date` or whatever was passed in if it was not a date
       */

   }, {
      key: '_dateToISO',
      value: function _dateToISO(date) {
         if (date && date instanceof Date) {
            date = date.toISOString();
         }

         return date;
      }

      /**
       * A function that receives the result of the API request.
       * @callback Requestable.callback
       * @param {Requestable.Error} error - the error returned by the API or `null`
       * @param {(Object|true)} result - the data returned by the API or `true` if the API returns `204 No Content`
       * @param {Object} request - the raw {@linkcode https://github.com/mzabriskie/axios#response-schema Response}
       */
      /**
       * Make a request.
       * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
       * @param {string} path - the path for the request
       * @param {*} [data] - the data to send to the server. For HTTP methods that don't have a body the data
       *                   will be sent as query parameters
       * @param {Requestable.callback} [cb] - the callback for the request
       * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
       *                              request will be made as JSON
       * @return {Promise} - the Promise for the http request
       */

   }, {
      key: '_request',
      value: function _request(method, path, data, cb, raw) {
         var url = this.__getURL(path);

         var AcceptHeader = (data || {}).AcceptHeader;
         if (AcceptHeader) {
            delete data.AcceptHeader;
         }
         var headers = this.__getRequestHeaders(raw, AcceptHeader);

         var queryParams = {};

         var shouldUseDataAsParams = data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && methodHasNoBody(method);
         if (shouldUseDataAsParams) {
            queryParams = data;
            data = undefined;
         }

         var config = {
            url: url,
            method: method,
            headers: headers,
            params: queryParams,
            data: data,
            responseType: raw ? 'text' : 'json'
         };

         log(config.method + ' to ' + config.url);
         var requestPromise = (0, _axios2.default)(config).catch(callbackErrorOrThrow(cb, path));

         if (cb) {
            requestPromise.then(function (response) {
               if (response.data && Object.keys(response.data).length > 0) {
                  // When data has results
                  cb(null, response.data, response);
               } else if (config.method !== 'GET' && Object.keys(response.data).length < 1) {
                  // True when successful submit a request and receive a empty object
                  cb(null, response.status < 300, response);
               } else {
                  cb(null, response.data, response);
               }
            });
         }

         return requestPromise;
      }

      /**
       * Make a request to an endpoint the returns 204 when true and 404 when false
       * @param {string} path - the path to request
       * @param {Object} data - any query parameters for the request
       * @param {Requestable.callback} cb - the callback that will receive `true` or `false`
       * @param {method} [method=GET] - HTTP Method to use
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: '_request204or404',
      value: function _request204or404(path, data, cb) {
         var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET';

         return this._request(method, path, data).then(function success(response) {
            if (cb) {
               cb(null, true, response);
            }
            return true;
         }, function failure(response) {
            if (response.response.status === 404) {
               if (cb) {
                  cb(null, false, response);
               }
               return false;
            }

            if (cb) {
               cb(response);
            }
            throw response;
         });
      }

      /**
       * Make a request and fetch all the available data. Github will paginate responses so for queries
       * that might span multiple pages this method is preferred to {@link Requestable#request}
       * @param {string} path - the path to request
       * @param {Object} options - the query parameters to include
       * @param {Requestable.callback} [cb] - the function to receive the data. The returned data will always be an array.
       * @param {Object[]} results - the partial results. This argument is intended for internal use only.
       * @return {Promise} - a promise which will resolve when all pages have been fetched
       * @deprecated This will be folded into {@link Requestable#_request} in the 2.0 release.
       */

   }, {
      key: '_requestAllPages',
      value: function _requestAllPages(path, options, cb, results) {
         var _this2 = this;

         results = results || [];

         return this._request('GET', path, options).then(function (response) {
            var _results;

            var thisGroup = void 0;
            if (response.data instanceof Array) {
               thisGroup = response.data;
            } else if (response.data.items instanceof Array) {
               thisGroup = response.data.items;
            } else {
               var message = 'cannot figure out how to append ' + response.data + ' to the result set';
               throw new ResponseError(message, path, response);
            }
            (_results = results).push.apply(_results, _toConsumableArray(thisGroup));

            var nextUrl = getNextPage(response.headers.link);
            if (nextUrl) {
               if (!options) {
                  options = {};
               }
               options.page = parseInt(nextUrl.match(/(page=[0-9]*)/g).shift().split('=').pop());
               if (!(options && typeof options.page !== 'number')) {
                  log('getting next page: ' + nextUrl);
                  return _this2._requestAllPages(nextUrl, options, cb, results);
               }
            }

            if (cb) {
               cb(null, results, response);
            }

            response.data = results;
            return response;
         }).catch(callbackErrorOrThrow(cb, path));
      }
   }]);

   return Requestable;
}();

module.exports = Requestable;

// ////////////////////////// //
//  Private helper functions  //
// ////////////////////////// //
var METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];
function methodHasNoBody(method) {
   return METHODS_WITH_NO_BODY.indexOf(method) !== -1;
}

function getNextPage() {
   var linksHeader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

   var links = linksHeader.split(/\s*,\s*/); // splits and strips the urls
   return links.reduce(function (nextUrl, link) {
      if (link.search(/rel="next"/) !== -1) {
         return (link.match(/<(.*)>/) || [])[1];
      }

      return nextUrl;
   }, undefined);
}

function callbackErrorOrThrow(cb, path) {
   return function handler(object) {
      var error = void 0;
      if (object.hasOwnProperty('config')) {
         var _object$response = object.response,
             status = _object$response.status,
             statusText = _object$response.statusText,
             _object$config = object.config,
             method = _object$config.method,
             url = _object$config.url;

         var message = status + ' error making request ' + method + ' ' + url + ': "' + statusText + '"';
         error = new ResponseError(message, path, object);
         log(message + ' ' + JSON.stringify(object.data));
      } else {
         error = object;
      }
      if (cb) {
         log('going to error callback');
         cb(error);
      } else {
         log('throwing error');
         throw error;
      }
   };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcXVlc3RhYmxlLmpzIl0sIm5hbWVzIjpbImxvZyIsIlJlc3BvbnNlRXJyb3IiLCJtZXNzYWdlIiwicGF0aCIsInJlc3BvbnNlIiwicmVxdWVzdCIsImNvbmZpZyIsInN0YXR1cyIsIkVycm9yIiwiUmVxdWVzdGFibGUiLCJhdXRoIiwiYXBpQmFzZSIsIkFjY2VwdEhlYWRlciIsIl9fYXBpQmFzZSIsIl9fYXV0aCIsInRva2VuIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIl9fQWNjZXB0SGVhZGVyIiwiX19hdXRob3JpemF0aW9uSGVhZGVyIiwiQmFzZTY0IiwiZW5jb2RlIiwidXJsIiwiaW5kZXhPZiIsIm5ld0NhY2hlQnVzdGVyIiwiRGF0ZSIsImdldFRpbWUiLCJyZXBsYWNlIiwicmF3IiwiaGVhZGVycyIsIkFjY2VwdCIsIkF1dGhvcml6YXRpb24iLCJyZXF1ZXN0T3B0aW9ucyIsInZpc2liaWxpdHkiLCJhZmZpbGlhdGlvbiIsInR5cGUiLCJzb3J0IiwicGVyX3BhZ2UiLCJkYXRlIiwidG9JU09TdHJpbmciLCJtZXRob2QiLCJkYXRhIiwiY2IiLCJfX2dldFVSTCIsIl9fZ2V0UmVxdWVzdEhlYWRlcnMiLCJxdWVyeVBhcmFtcyIsInNob3VsZFVzZURhdGFBc1BhcmFtcyIsIm1ldGhvZEhhc05vQm9keSIsInVuZGVmaW5lZCIsInBhcmFtcyIsInJlc3BvbnNlVHlwZSIsInJlcXVlc3RQcm9taXNlIiwiY2F0Y2giLCJjYWxsYmFja0Vycm9yT3JUaHJvdyIsInRoZW4iLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiX3JlcXVlc3QiLCJzdWNjZXNzIiwiZmFpbHVyZSIsIm9wdGlvbnMiLCJyZXN1bHRzIiwidGhpc0dyb3VwIiwiQXJyYXkiLCJpdGVtcyIsInB1c2giLCJuZXh0VXJsIiwiZ2V0TmV4dFBhZ2UiLCJsaW5rIiwicGFnZSIsInBhcnNlSW50IiwibWF0Y2giLCJzaGlmdCIsInNwbGl0IiwicG9wIiwiX3JlcXVlc3RBbGxQYWdlcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJNRVRIT0RTX1dJVEhfTk9fQk9EWSIsImxpbmtzSGVhZGVyIiwibGlua3MiLCJyZWR1Y2UiLCJzZWFyY2giLCJoYW5kbGVyIiwib2JqZWN0IiwiZXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsInN0YXR1c1RleHQiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFPQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBVEE7Ozs7Ozs7QUFXQSxJQUFNQSxNQUFNLHFCQUFNLGdCQUFOLENBQVo7O0FBRUE7Ozs7SUFHTUMsYTs7O0FBQ0g7Ozs7OztBQU1BLDBCQUFZQyxPQUFaLEVBQXFCQyxJQUFyQixFQUEyQkMsUUFBM0IsRUFBcUM7QUFBQTs7QUFBQSxnSUFDNUJGLE9BRDRCOztBQUVsQyxZQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxZQUFLRSxPQUFMLEdBQWVELFNBQVNFLE1BQXhCO0FBQ0EsWUFBS0YsUUFBTCxHQUFnQixDQUFDQSxZQUFZLEVBQWIsRUFBaUJBLFFBQWpCLElBQTZCQSxRQUE3QztBQUNBLFlBQUtHLE1BQUwsR0FBY0gsU0FBU0csTUFBdkI7QUFMa0M7QUFNcEM7OztFQWJ3QkMsSzs7QUFnQjVCOzs7OztJQUdNQyxXO0FBQ0g7Ozs7Ozs7QUFPQTs7Ozs7OztBQU9BLHdCQUFZQyxJQUFaLEVBQWtCQyxPQUFsQixFQUEyQkMsWUFBM0IsRUFBeUM7QUFBQTs7QUFDdEMsV0FBS0MsU0FBTCxHQUFpQkYsV0FBVyx3QkFBNUI7QUFDQSxXQUFLRyxNQUFMLEdBQWM7QUFDWEMsZ0JBQU9MLEtBQUtLLEtBREQ7QUFFWEMsbUJBQVVOLEtBQUtNLFFBRko7QUFHWEMsbUJBQVVQLEtBQUtPO0FBSEosT0FBZDtBQUtBLFdBQUtDLGNBQUwsR0FBc0JOLGdCQUFnQixJQUF0Qzs7QUFFQSxVQUFJRixLQUFLSyxLQUFULEVBQWdCO0FBQ2IsY0FBS0kscUJBQUwsR0FBNkIsV0FBV1QsS0FBS0ssS0FBN0M7QUFDRixPQUZELE1BRU8sSUFBSUwsS0FBS00sUUFB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b250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEBjb3B5cmlnaHQgIDIwMTYgWWFob28gSW5jLlxuICogQGxpY2Vuc2UgICAgTGljZW5zZWQgdW5kZXIge0BsaW5rIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlLUNsZWFyLmh0bWwgQlNELTMtQ2xhdXNlLUNsZWFyfS5cbiAqICAgICAgICAgICAgIEdpdGh1Yi5qcyBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZS5cbiAqL1xuXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7QmFzZTY0fSBmcm9tICdqcy1iYXNlNjQnO1xuXG5jb25zdCBsb2cgPSBkZWJ1ZygnZ2l0aHViOnJlcXVlc3QnKTtcblxuLyoqXG4gKiBUaGUgZXJyb3Igc3RydWN0dXJlIHJldHVybmVkIHdoZW4gYSBuZXR3b3JrIGNhbGwgZmFpbHNcbiAqL1xuY2xhc3MgUmVzcG9uc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgIC8qKlxuICAgICogQ29uc3RydWN0IGEgbmV3IFJlc3BvbnNlRXJyb3JcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gYW4gbWVzc2FnZSB0byByZXR1cm4gaW5zdGVhZCBvZiB0aGUgdGhlIGRlZmF1bHQgZXJyb3IgbWVzc2FnZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcmVxdWVzdGVkIHBhdGhcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSAtIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgQXhpb3NcbiAgICAqL1xuICAgY29uc3RydWN0b3IobWVzc2FnZSwgcGF0aCwgcmVzcG9uc2UpIHtcbiAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgIHRoaXMucmVxdWVzdCA9IHJlc3BvbnNlLmNvbmZpZztcbiAgICAgIHRoaXMucmVzcG9uc2UgPSAocmVzcG9uc2UgfHwge30pLnJlc3BvbnNlIHx8IHJlc3BvbnNlO1xuICAgICAgdGhpcy5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICB9XG59XG5cbi8qKlxuICogUmVxdWVzdGFibGUgd3JhcHMgdGhlIGxvZ2ljIGZvciBtYWtpbmcgaHR0cCByZXF1ZXN0cyB0byB0aGUgQVBJXG4gKi9cbmNsYXNzIFJlcXVlc3RhYmxlIHtcbiAgIC8qKlxuICAgICogRWl0aGVyIGEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIG9yIGFuIG9hdXRoIHRva2VuIGZvciBHaXRodWJcbiAgICAqIEB0eXBlZGVmIHtPYmplY3R9IFJlcXVlc3RhYmxlLmF1dGhcbiAgICAqIEBwcm9wIHtzdHJpbmd9IFt1c2VybmFtZV0gLSB0aGUgR2l0aHViIHVzZXJuYW1lXG4gICAgKiBAcHJvcCB7c3RyaW5nfSBbcGFzc3dvcmRdIC0gdGhlIHVzZXIncyBwYXNzd29yZFxuICAgICogQHByb3Age3Rva2VufSBbdG9rZW5dIC0gYW4gT0F1dGggdG9rZW5cbiAgICAqL1xuICAgLyoqXG4gICAgKiBJbml0aWFsaXplIHRoZSBodHRwIGludGVybmFscy5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuYXV0aH0gW2F1dGhdIC0gdGhlIGNyZWRlbnRpYWxzIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWIuIElmIGF1dGggaXNcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBwcm92aWRlZCByZXF1ZXN0IHdpbGwgYmUgbWFkZSB1bmF1dGhlbnRpY2F0ZWRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYXBpQmFzZT1odHRwczovL2FwaS5naXRodWIuY29tXSAtIHRoZSBiYXNlIEdpdGh1YiBBUEkgVVJMXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW0FjY2VwdEhlYWRlcj12M10gLSB0aGUgYWNjZXB0IGhlYWRlciBmb3IgdGhlIHJlcXVlc3RzXG4gICAgKi9cbiAgIGNvbnN0cnVjdG9yKGF1dGgsIGFwaUJhc2UsIEFjY2VwdEhlYWRlcikge1xuICAgICAgdGhpcy5fX2FwaUJhc2UgPSBhcGlCYXNlIHx8ICdodHRwczovL2FwaS5naXRodWIuY29tJztcbiAgICAgIHRoaXMuX19hdXRoID0ge1xuICAgICAgICAgdG9rZW46IGF1dGgudG9rZW4sXG4gICAgICAgICB1c2VybmFtZTogYXV0aC51c2VybmFtZSxcbiAgICAgICAgIHBhc3N3b3JkOiBhdXRoLnBhc3N3b3JkLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX19BY2NlcHRIZWFkZXIgPSBBY2NlcHRIZWFkZXIgfHwgJ3YzJztcblxuICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgIHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyID0gJ3Rva2VuICcgKyBhdXRoLnRva2VuO1xuICAgICAgfSBlbHNlIGlmIChhdXRoLnVzZXJuYW1lICYmIGF1dGgucGFzc3dvcmQpIHtcbiAgICAgICAgIHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyID0gJ0Jhc2ljICcgKyBCYXNlNjQuZW5jb2RlKGF1dGgudXNlcm5hbWUgKyAnOicgKyBhdXRoLnBhc3N3b3JkKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBDb21wdXRlIHRoZSBVUkwgdG8gdXNlIHRvIG1ha2UgYSByZXF1ZXN0LlxuICAgICogQHByaXZhdGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gZWl0aGVyIGEgVVJMIHJlbGF0aXZlIHRvIHRoZSBBUEkgYmFzZSBvciBhbiBhYnNvbHV0ZSBVUkxcbiAgICAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgVVJMIHRvIHVzZVxuICAgICovXG4gICBfX2dldFVSTChwYXRoKSB7XG4gICAgICBsZXQgdXJsID0gcGF0aDtcblxuICAgICAgaWYgKHBhdGguaW5kZXhPZignLy8nKSA9PT0gLTEpIHtcbiAgICAgICAgIHVybCA9IHRoaXMuX19hcGlCYXNlICsgcGF0aDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0NhY2hlQnVzdGVyID0gJ3RpbWVzdGFtcD0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICByZXR1cm4gdXJsLnJlcGxhY2UoLyh0aW1lc3RhbXA9XFxkKykvLCBuZXdDYWNoZUJ1c3Rlcik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tcHV0ZSB0aGUgaGVhZGVycyByZXF1aXJlZCBmb3IgYW4gQVBJIHJlcXVlc3QuXG4gICAgKiBAcHJpdmF0ZVxuICAgICogQHBhcmFtIHtib29sZWFufSByYXcgLSBpZiB0aGUgcmVxdWVzdCBzaG91bGQgYmUgdHJlYXRlZCBhcyBKU09OIG9yIGFzIGEgcmF3IHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBBY2NlcHRIZWFkZXIgLSB0aGUgYWNjZXB0IGhlYWRlciBmb3IgdGhlIHJlcXVlc3RcbiAgICAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgaGVhZGVycyB0byB1c2UgaW4gdGhlIHJlcXVlc3RcbiAgICAqL1xuICAgX19nZXRSZXF1ZXN0SGVhZGVycyhyYXcsIEFjY2VwdEhlYWRlcikge1xuICAgICAgbGV0IGhlYWRlcnMgPSB7XG4gICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCcsXG4gICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIuJyArIChBY2NlcHRIZWFkZXIgfHwgdGhpcy5fX0FjY2VwdEhlYWRlciksXG4gICAgICB9O1xuXG4gICAgICBpZiAocmF3KSB7XG4gICAgICAgICBoZWFkZXJzLkFjY2VwdCArPSAnLnJhdyc7XG4gICAgICB9XG4gICAgICBoZWFkZXJzLkFjY2VwdCArPSAnK2pzb24nO1xuXG4gICAgICBpZiAodGhpcy5fX2F1dGhvcml6YXRpb25IZWFkZXIpIHtcbiAgICAgICAgIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVhZGVycztcbiAgIH1cblxuICAgLyoqXG4gICAgKiBTZXRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIEFQSSByZXF1ZXN0c1xuICAgICogQHByb3RlY3RlZFxuICAgICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0T3B0aW9ucz17fV0gLSB0aGUgY3VycmVudCBvcHRpb25zIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHJlcXVlc3RcbiAgICAqL1xuICAgX2dldE9wdGlvbnNXaXRoRGVmYXVsdHMocmVxdWVzdE9wdGlvbnMgPSB7fSkge1xuICAgICAgaWYgKCEocmVxdWVzdE9wdGlvbnMudmlzaWJpbGl0eSB8fCByZXF1ZXN0T3B0aW9ucy5hZmZpbGlhdGlvbikpIHtcbiAgICAgICAgIHJlcXVlc3RPcHRpb25zLnR5cGUgPSByZXF1ZXN0T3B0aW9ucy50eXBlIHx8ICdhbGwnO1xuICAgICAgfVxuICAgICAgcmVxdWVzdE9wdGlvbnMuc29ydCA9IHJlcXVlc3RPcHRpb25zLnNvcnQgfHwgJ3VwZGF0ZWQnO1xuICAgICAgcmVxdWVzdE9wdGlvbnMucGVyX3BhZ2UgPSByZXF1ZXN0T3B0aW9ucy5wZXJfcGFnZSB8fCAnMTAwJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG4gICAgICByZXR1cm4gcmVxdWVzdE9wdGlvbnM7XG4gICB9XG5cbiAgIC8qKlxuICAgICogaWYgYSBgRGF0ZWAgaXMgcGFzc2VkIHRvIHRoaXMgZnVuY3Rpb24gaXQgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYW4gSVNPIHN0cmluZ1xuICAgICogQHBhcmFtIHsqfSBkYXRlIC0gdGhlIG9iamVjdCB0byBhdHRlbXB0IHRvIGNvZXJjZSBpbnRvIGFuIElTTyBkYXRlIHN0cmluZ1xuICAgICogQHJldHVybiB7c3RyaW5nfSAtIHRoZSBJU08gcmVwcmVzZW50YXRpb24gb2YgYGRhdGVgIG9yIHdoYXRldmVyIHdhcyBwYXNzZWQgaW4gaWYgaXQgd2FzIG5vdCBhIGRhdGVcbiAgICAqL1xuICAgX2RhdGVUb0lTTyhkYXRlKSB7XG4gICAgICBpZiAoZGF0ZSAmJiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICBkYXRlID0gZGF0ZS50b0lTT1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0ZTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgdGhlIHJlc3VsdCBvZiB0aGUgQVBJIHJlcXVlc3QuXG4gICAgKiBAY2FsbGJhY2sgUmVxdWVzdGFibGUuY2FsbGJhY2tcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuRXJyb3J9IGVycm9yIC0gdGhlIGVycm9yIHJldHVybmVkIGJ5IHRoZSBBUEkgb3IgYG51bGxgXG4gICAgKiBAcGFyYW0geyhPYmplY3R8dHJ1ZSl9IHJlc3VsdCAtIHRoZSBkYXRhIHJldHVybmVkIGJ5IHRoZSBBUEkgb3IgYHRydWVgIGlmIHRoZSBBUEkgcmV0dXJucyBgMjA0IE5vIENvbnRlbnRgXG4gICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCAtIHRoZSByYXcge0BsaW5rY29kZSBodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvcyNyZXNwb25zZS1zY2hlbWEgUmVzcG9uc2V9XG4gICAgKi9cbiAgIC8qKlxuICAgICogTWFrZSBhIHJlcXVlc3QuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdGhlIG1ldGhvZCBmb3IgdGhlIHJlcXVlc3QgKEdFVCwgUFVULCBQT1NULCBERUxFVEUpXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHBhcmFtIHsqfSBbZGF0YV0gLSB0aGUgZGF0YSB0byBzZW5kIHRvIHRoZSBzZXJ2ZXIuIEZvciBIVFRQIG1ldGhvZHMgdGhhdCBkb24ndCBoYXZlIGEgYm9keSB0aGUgZGF0YVxuICAgICogICAgICAgICAgICAgICAgICAgd2lsbCBiZSBzZW50IGFzIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB0aGUgY2FsbGJhY2sgZm9yIHRoZSByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyYXc9ZmFsc2VdIC0gaWYgdGhlIHJlcXVlc3Qgc2hvdWxkIGJlIHNlbnQgYXMgcmF3LiBJZiB0aGlzIGlzIGEgZmFsc3kgdmFsdWUgdGhlbiB0aGVcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdCB3aWxsIGJlIG1hZGUgYXMgSlNPTlxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBfcmVxdWVzdChtZXRob2QsIHBhdGgsIGRhdGEsIGNiLCByYXcpIHtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMuX19nZXRVUkwocGF0aCk7XG5cbiAgICAgIGNvbnN0IEFjY2VwdEhlYWRlciA9IChkYXRhIHx8IHt9KS5BY2NlcHRIZWFkZXI7XG4gICAgICBpZiAoQWNjZXB0SGVhZGVyKSB7XG4gICAgICAgICBkZWxldGUgZGF0YS5BY2NlcHRIZWFkZXI7XG4gICAgICB9XG4gICAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5fX2dldFJlcXVlc3RIZWFkZXJzKHJhdywgQWNjZXB0SGVhZGVyKTtcblxuICAgICAgbGV0IHF1ZXJ5UGFyYW1zID0ge307XG5cbiAgICAgIGNvbnN0IHNob3VsZFVzZURhdGFBc1BhcmFtcyA9IGRhdGEgJiYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgJiYgbWV0aG9kSGFzTm9Cb2R5KG1ldGhvZCk7XG4gICAgICBpZiAoc2hvdWxkVXNlRGF0YUFzUGFyYW1zKSB7XG4gICAgICAgICBxdWVyeVBhcmFtcyA9IGRhdGE7XG4gICAgICAgICBkYXRhID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgIHBhcmFtczogcXVlcnlQYXJhbXMsXG4gICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgcmVzcG9uc2VUeXBlOiByYXcgPyAndGV4dCcgOiAnanNvbicsXG4gICAgICB9O1xuXG4gICAgICBsb2coYCR7Y29uZmlnLm1ldGhvZH0gdG8gJHtjb25maWcudXJsfWApO1xuICAgICAgY29uc3QgcmVxdWVzdFByb21pc2UgPSBheGlvcyhjb25maWcpLmNhdGNoKGNhbGxiYWNrRXJyb3JPclRocm93KGNiLCBwYXRoKSk7XG5cbiAgICAgIGlmIChjYikge1xuICAgICAgICAgcmVxdWVzdFByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhICYmIE9iamVjdC5rZXlzKHJlc3BvbnNlLmRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgIC8vIFdoZW4gZGF0YSBoYXMgcmVzdWx0c1xuICAgICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UuZGF0YSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcubWV0aG9kICE9PSAnR0VUJyAmJiBPYmplY3Qua2V5cyhyZXNwb25zZS5kYXRhKS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAvLyBUcnVlIHdoZW4gc3VjY2Vzc2Z1bCBzdWJtaXQgYSByZXF1ZXN0IGFuZCByZWNlaXZlIGEgZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICAgICBjYihudWxsLCAocmVzcG9uc2Uuc3RhdHVzIDwgMzAwKSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVxdWVzdFByb21pc2U7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTWFrZSBhIHJlcXVlc3QgdG8gYW4gZW5kcG9pbnQgdGhlIHJldHVybnMgMjA0IHdoZW4gdHJ1ZSBhbmQgNDA0IHdoZW4gZmFsc2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHBhdGggdG8gcmVxdWVzdFxuICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBhbnkgcXVlcnkgcGFyYW1ldGVycyBmb3IgdGhlIHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gdGhlIGNhbGxiYWNrIHRoYXQgd2lsbCByZWNlaXZlIGB0cnVlYCBvciBgZmFsc2VgXG4gICAgKiBAcGFyYW0ge21ldGhvZH0gW21ldGhvZD1HRVRdIC0gSFRUUCBNZXRob2QgdG8gdXNlXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIF9yZXF1ZXN0MjA0b3I0MDQocGF0aCwgZGF0YSwgY2IsIG1ldGhvZCA9ICdHRVQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChtZXRob2QsIHBhdGgsIGRhdGEpXG4gICAgICAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgIGNiKG51bGwsIHRydWUsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgfSwgZnVuY3Rpb24gZmFpbHVyZShyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlc3BvbnNlLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICAgIGNiKG51bGwsIGZhbHNlLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgY2IocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICAgICB9KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBNYWtlIGEgcmVxdWVzdCBhbmQgZmV0Y2ggYWxsIHRoZSBhdmFpbGFibGUgZGF0YS4gR2l0aHViIHdpbGwgcGFnaW5hdGUgcmVzcG9uc2VzIHNvIGZvciBxdWVyaWVzXG4gICAgKiB0aGF0IG1pZ2h0IHNwYW4gbXVsdGlwbGUgcGFnZXMgdGhpcyBtZXRob2QgaXMgcHJlZmVycmVkIHRvIHtAbGluayBSZXF1ZXN0YWJsZSNyZXF1ZXN0fVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCB0byByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGluY2x1ZGVcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB0aGUgZnVuY3Rpb24gdG8gcmVjZWl2ZSB0aGUgZGF0YS4gVGhlIHJldHVybmVkIGRhdGEgd2lsbCBhbHdheXMgYmUgYW4gYXJyYXkuXG4gICAgKiBAcGFyYW0ge09iamVjdFtdfSByZXN1bHRzIC0gdGhlIHBhcnRpYWwgcmVzdWx0cy4gVGhpcyBhcmd1bWVudCBpcyBpbnRlbmRlZCBmb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIGEgcHJvbWlzZSB3aGljaCB3aWxsIHJlc29sdmUgd2hlbiBhbGwgcGFnZXMgaGF2ZSBiZWVuIGZldGNoZWRcbiAgICAqIEBkZXByZWNhdGVkIFRoaXMgd2lsbCBiZSBmb2xkZWQgaW50byB7QGxpbmsgUmVxdWVzdGFibGUjX3JlcXVlc3R9IGluIHRoZSAyLjAgcmVsZWFzZS5cbiAgICAqL1xuICAgX3JlcXVlc3RBbGxQYWdlcyhwYXRoLCBvcHRpb25zLCBjYiwgcmVzdWx0cykge1xuICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBwYXRoLCBvcHRpb25zKVxuICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpc0dyb3VwO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgdGhpc0dyb3VwID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuZGF0YS5pdGVtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICB0aGlzR3JvdXAgPSByZXNwb25zZS5kYXRhLml0ZW1zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gYGNhbm5vdCBmaWd1cmUgb3V0IGhvdyB0byBhcHBlbmQgJHtyZXNwb25zZS5kYXRhfSB0byB0aGUgcmVzdWx0IHNldGA7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgUmVzcG9uc2VFcnJvcihtZXNzYWdlLCBwYXRoLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goLi4udGhpc0dyb3VwKTtcblxuICAgICAgICAgICAgY29uc3QgbmV4dFVybCA9IGdldE5leHRQYWdlKHJlc3BvbnNlLmhlYWRlcnMubGluayk7XG4gICAgICAgICAgICBpZihuZXh0VXJsKSB7XG4gICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIG9wdGlvbnMucGFnZSA9IHBhcnNlSW50KFxuICAgICAgICAgICAgICAgICBuZXh0VXJsLm1hdGNoKC8ocGFnZT1bMC05XSopL2cpXG4gICAgICAgICAgICAgICAgICAgLnNoaWZ0KClcbiAgICAgICAgICAgICAgICAgICAuc3BsaXQoJz0nKVxuICAgICAgICAgICAgICAgICAgIC5wb3AoKVxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgIGlmICghKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucGFnZSAhPT0gJ251bWJlcicpKSB7XG4gICAgICAgICAgICAgICAgICBsb2coYGdldHRpbmcgbmV4dCBwYWdlOiAke25leHRVcmx9YCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdEFsbFBhZ2VzKG5leHRVcmwsIG9wdGlvbnMsIGNiLCByZXN1bHRzKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICBjYihudWxsLCByZXN1bHRzLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEgPSByZXN1bHRzO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgfSkuY2F0Y2goY2FsbGJhY2tFcnJvck9yVGhyb3coY2IsIHBhdGgpKTtcbiAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXF1ZXN0YWJsZTtcblxuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gLy9cbi8vICBQcml2YXRlIGhlbHBlciBmdW5jdGlvbnMgIC8vXG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyAvL1xuY29uc3QgTUVUSE9EU19XSVRIX05PX0JPRFkgPSBbJ0dFVCcsICdIRUFEJywgJ0RFTEVURSddO1xuZnVuY3Rpb24gbWV0aG9kSGFzTm9Cb2R5KG1ldGhvZCkge1xuICAgcmV0dXJuIE1FVEhPRFNfV0lUSF9OT19CT0RZLmluZGV4T2YobWV0aG9kKSAhPT0gLTE7XG59XG5cbmZ1bmN0aW9uIGdldE5leHRQYWdlKGxpbmtzSGVhZGVyID0gJycpIHtcbiAgIGNvbnN0IGxpbmtzID0gbGlua3NIZWFkZXIuc3BsaXQoL1xccyosXFxzKi8pOyAvLyBzcGxpdHMgYW5kIHN0cmlwcyB0aGUgdXJsc1xuICAgcmV0dXJuIGxpbmtzLnJlZHVjZShmdW5jdGlvbihuZXh0VXJsLCBsaW5rKSB7XG4gICAgICBpZiAobGluay5zZWFyY2goL3JlbD1cIm5leHRcIi8pICE9PSAtMSkge1xuICAgICAgICAgcmV0dXJuIChsaW5rLm1hdGNoKC88KC4qKT4vKSB8fCBbXSlbMV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXh0VXJsO1xuICAgfSwgdW5kZWZpbmVkKTtcbn1cblxuZnVuY3Rpb24gY2FsbGJhY2tFcnJvck9yVGhyb3coY2IsIHBhdGgpIHtcbiAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKG9iamVjdCkge1xuICAgICAgbGV0IGVycm9yO1xuICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgnY29uZmlnJykpIHtcbiAgICAgICAgIGNvbnN0IHtyZXNwb25zZToge3N0YXR1cywgc3RhdHVzVGV4dH0sIGNvbmZpZzoge21ldGhvZCwgdXJsfX0gPSBvYmplY3Q7XG4gICAgICAgICBsZXQgbWVzc2FnZSA9IChgJHtzdGF0dXN9IGVycm9yIG1ha2luZyByZXF1ZXN0ICR7bWV0aG9kfSAke3VybH06IFwiJHtzdGF0dXNUZXh0fVwiYCk7XG4gICAgICAgICBlcnJvciA9IG5ldyBSZXNwb25zZUVycm9yKG1lc3NhZ2UsIHBhdGgsIG9iamVjdCk7XG4gICAgICAgICBsb2coYCR7bWVzc2FnZX0gJHtKU09OLnN0cmluZ2lmeShvYmplY3QuZGF0YSl9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgZXJyb3IgPSBvYmplY3Q7XG4gICAgICB9XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgIGxvZygnZ29pbmcgdG8gZXJyb3IgY2FsbGJhY2snKTtcbiAgICAgICAgIGNiKGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBsb2coJ3Rocm93aW5nIGVycm9yJyk7XG4gICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgIH07XG59XG4iXX0=
//# sourceMappingURL=Requestable.js.map
