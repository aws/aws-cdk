'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Requestable2 = require('./Requestable');

var _Requestable3 = _interopRequireDefault(_Requestable2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright  2013 Michael Aufreiter (Development Seed) and 2016 Yahoo Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license    Licensed under {@link https://spdx.org/licenses/BSD-3-Clause-Clear.html BSD-3-Clause-Clear}.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *             Github.js is freely distributable.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var log = (0, _debug2.default)('github:search');

/**
 * Wrap the Search API
 */

var Search = function (_Requestable) {
  _inherits(Search, _Requestable);

  /**
   * Create a Search
   * @param {Object} defaults - defaults for the search
   * @param {Requestable.auth} [auth] - information required to authenticate to Github
   * @param {string} [apiBase=https://api.github.com] - the base Github API URL
   */
  function Search(defaults, auth, apiBase) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, auth, apiBase));

    _this.__defaults = _this._getOptionsWithDefaults(defaults);
    return _this;
  }

  /**
   * Available search options
   * @see https://developer.github.com/v3/search/#parameters
   * @typedef {Object} Search.Params
   * @param {string} q - the query to make
   * @param {string} sort - the sort field, one of `stars`, `forks`, or `updated`.
   *                      Default is [best match](https://developer.github.com/v3/search/#ranking-search-results)
   * @param {string} order - the ordering, either `asc` or `desc`
   */
  /**
   * Perform a search on the GitHub API
   * @private
   * @param {string} path - the scope of the search
   * @param {Search.Params} [withOptions] - additional parameters for the search
   * @param {Requestable.callback} [cb] - will receive the results of the search
   * @return {Promise} - the promise for the http request
   */


  _createClass(Search, [{
    key: '_search',
    value: function _search(path) {
      var _this2 = this;

      var withOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var requestOptions = {};
      Object.keys(this.__defaults).forEach(function (prop) {
        requestOptions[prop] = _this2.__defaults[prop];
      });
      Object.keys(withOptions).forEach(function (prop) {
        requestOptions[prop] = withOptions[prop];
      });

      log('searching ' + path + ' with options:', requestOptions);
      return this._requestAllPages('/search/' + path, requestOptions, cb);
    }

    /**
     * Search for repositories
     * @see https://developer.github.com/v3/search/#search-repositories
     * @param {Search.Params} [options] - additional parameters for the search
     * @param {Requestable.callback} [cb] - will receive the results of the search
     * @return {Promise} - the promise for the http request
     */

  }, {
    key: 'forRepositories',
    value: function forRepositories(options, cb) {
      return this._search('repositories', options, cb);
    }

    /**
     * Search for code
     * @see https://developer.github.com/v3/search/#search-code
     * @param {Search.Params} [options] - additional parameters for the search
     * @param {Requestable.callback} [cb] - will receive the results of the search
     * @return {Promise} - the promise for the http request
     */

  }, {
    key: 'forCode',
    value: function forCode(options, cb) {
      return this._search('code', options, cb);
    }

    /**
     * Search for issues
     * @see https://developer.github.com/v3/search/#search-issues
     * @param {Search.Params} [options] - additional parameters for the search
     * @param {Requestable.callback} [cb] - will receive the results of the search
     * @return {Promise} - the promise for the http request
     */

  }, {
    key: 'forIssues',
    value: function forIssues(options, cb) {
      return this._search('issues', options, cb);
    }

    /**
     * Search for users
     * @see https://developer.github.com/v3/search/#search-users
     * @param {Search.Params} [options] - additional parameters for the search
     * @param {Requestable.callback} [cb] - will receive the results of the search
     * @return {Promise} - the promise for the http request
     */

  }, {
    key: 'forUsers',
    value: function forUsers(options, cb) {
      return this._search('users', options, cb);
    }
  }]);

  return Search;
}(_Requestable3.default);

module.exports = Search;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlYXJjaC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJTZWFyY2giLCJkZWZhdWx0cyIsImF1dGgiLCJhcGlCYXNlIiwiX19kZWZhdWx0cyIsIl9nZXRPcHRpb25zV2l0aERlZmF1bHRzIiwicGF0aCIsIndpdGhPcHRpb25zIiwiY2IiLCJ1bmRlZmluZWQiLCJyZXF1ZXN0T3B0aW9ucyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwicHJvcCIsIl9yZXF1ZXN0QWxsUGFnZXMiLCJvcHRpb25zIiwiX3NlYXJjaCIsIlJlcXVlc3RhYmxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQU9BOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBUkE7Ozs7Ozs7QUFTQSxJQUFNQSxNQUFNLHFCQUFNLGVBQU4sQ0FBWjs7QUFFQTs7OztJQUdNQyxNOzs7QUFDSDs7Ozs7O0FBTUEsa0JBQVlDLFFBQVosRUFBc0JDLElBQXRCLEVBQTRCQyxPQUE1QixFQUFxQztBQUFBOztBQUFBLGdIQUM1QkQsSUFENEIsRUFDdEJDLE9BRHNCOztBQUVsQyxVQUFLQyxVQUFMLEdBQWtCLE1BQUtDLHVCQUFMLENBQTZCSixRQUE3QixDQUFsQjtBQUZrQztBQUdwQzs7QUFFRDs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs0QkFRUUssSSxFQUF3QztBQUFBOztBQUFBLFVBQWxDQyxXQUFrQyx1RUFBcEIsRUFBb0I7QUFBQSxVQUFoQkMsRUFBZ0IsdUVBQVhDLFNBQVc7O0FBQzdDLFVBQUlDLGlCQUFpQixFQUFyQjtBQUNBQyxhQUFPQyxJQUFQLENBQVksS0FBS1IsVUFBakIsRUFBNkJTLE9BQTdCLENBQXFDLFVBQUNDLElBQUQsRUFBVTtBQUM1Q0osdUJBQWVJLElBQWYsSUFBdUIsT0FBS1YsVUFBTCxDQUFnQlUsSUFBaEIsQ0FBdkI7QUFDRixPQUZEO0FBR0FILGFBQU9DLElBQVAsQ0FBWUwsV0FBWixFQUF5Qk0sT0FBekIsQ0FBaUMsVUFBQ0MsSUFBRCxFQUFVO0FBQ3hDSix1QkFBZUksSUFBZixJQUF1QlAsWUFBWU8sSUFBWixDQUF2QjtBQUNGLE9BRkQ7O0FBSUFmLHlCQUFpQk8sSUFBakIscUJBQXVDSSxjQUF2QztBQUNBLGFBQU8sS0FBS0ssZ0JBQUwsY0FBaUNULElBQWpDLEVBQXlDSSxjQUF6QyxFQUF5REYsRUFBekQsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7O29DQU9nQlEsTyxFQUFTUixFLEVBQUk7QUFDMUIsYUFBTyxLQUFLUyxPQUFMLENBQWEsY0FBYixFQUE2QkQsT0FBN0IsRUFBc0NSLEVBQXRDLENBQVA7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs0QkFPUVEsTyxFQUFTUixFLEVBQUk7QUFDbEIsYUFBTyxLQUFLUyxPQUFMLENBQWEsTUFBYixFQUFxQkQsT0FBckIsRUFBOEJSLEVBQTlCLENBQVA7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs4QkFPVVEsTyxFQUFTUixFLEVBQUk7QUFDcEIsYUFBTyxLQUFLUyxPQUFMLENBQWEsUUFBYixFQUF1QkQsT0FBdkIsRUFBZ0NSLEVBQWhDLENBQVA7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs2QkFPU1EsTyxFQUFTUixFLEVBQUk7QUFDbkIsYUFBTyxLQUFLUyxPQUFMLENBQWEsT0FBYixFQUFzQkQsT0FBdEIsRUFBK0JSLEVBQS9CLENBQVA7QUFDRjs7OztFQXBGaUJVLHFCOztBQXVGckJDLE9BQU9DLE9BQVAsR0FBaUJwQixNQUFqQiIsImZpbGUiOiJTZWFyY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlXG4gKiBAY29weXJpZ2h0ICAyMDEzIE1pY2hhZWwgQXVmcmVpdGVyIChEZXZlbG9wbWVudCBTZWVkKSBhbmQgMjAxNiBZYWhvbyBJbmMuXG4gKiBAbGljZW5zZSAgICBMaWNlbnNlZCB1bmRlciB7QGxpbmsgaHR0cHM6Ly9zcGR4Lm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2UtQ2xlYXIuaHRtbCBCU0QtMy1DbGF1c2UtQ2xlYXJ9LlxuICogICAgICAgICAgICAgR2l0aHViLmpzIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlLlxuICovXG5cbmltcG9ydCBSZXF1ZXN0YWJsZSBmcm9tICcuL1JlcXVlc3RhYmxlJztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5jb25zdCBsb2cgPSBkZWJ1ZygnZ2l0aHViOnNlYXJjaCcpO1xuXG4vKipcbiAqIFdyYXAgdGhlIFNlYXJjaCBBUElcbiAqL1xuY2xhc3MgU2VhcmNoIGV4dGVuZHMgUmVxdWVzdGFibGUge1xuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBTZWFyY2hcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0cyAtIGRlZmF1bHRzIGZvciB0aGUgc2VhcmNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmF1dGh9IFthdXRoXSAtIGluZm9ybWF0aW9uIHJlcXVpcmVkIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYXBpQmFzZT1odHRwczovL2FwaS5naXRodWIuY29tXSAtIHRoZSBiYXNlIEdpdGh1YiBBUEkgVVJMXG4gICAgKi9cbiAgIGNvbnN0cnVjdG9yKGRlZmF1bHRzLCBhdXRoLCBhcGlCYXNlKSB7XG4gICAgICBzdXBlcihhdXRoLCBhcGlCYXNlKTtcbiAgICAgIHRoaXMuX19kZWZhdWx0cyA9IHRoaXMuX2dldE9wdGlvbnNXaXRoRGVmYXVsdHMoZGVmYXVsdHMpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEF2YWlsYWJsZSBzZWFyY2ggb3B0aW9uc1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3NlYXJjaC8jcGFyYW1ldGVyc1xuICAgICogQHR5cGVkZWYge09iamVjdH0gU2VhcmNoLlBhcmFtc1xuICAgICogQHBhcmFtIHtzdHJpbmd9IHEgLSB0aGUgcXVlcnkgdG8gbWFrZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHNvcnQgLSB0aGUgc29ydCBmaWVsZCwgb25lIG9mIGBzdGFyc2AsIGBmb3Jrc2AsIG9yIGB1cGRhdGVkYC5cbiAgICAqICAgICAgICAgICAgICAgICAgICAgIERlZmF1bHQgaXMgW2Jlc3QgbWF0Y2hdKGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvc2VhcmNoLyNyYW5raW5nLXNlYXJjaC1yZXN1bHRzKVxuICAgICogQHBhcmFtIHtzdHJpbmd9IG9yZGVyIC0gdGhlIG9yZGVyaW5nLCBlaXRoZXIgYGFzY2Agb3IgYGRlc2NgXG4gICAgKi9cbiAgIC8qKlxuICAgICogUGVyZm9ybSBhIHNlYXJjaCBvbiB0aGUgR2l0SHViIEFQSVxuICAgICogQHByaXZhdGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHNjb3BlIG9mIHRoZSBzZWFyY2hcbiAgICAqIEBwYXJhbSB7U2VhcmNoLlBhcmFtc30gW3dpdGhPcHRpb25zXSAtIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmb3IgdGhlIHNlYXJjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcmVzdWx0cyBvZiB0aGUgc2VhcmNoXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIF9zZWFyY2gocGF0aCwgd2l0aE9wdGlvbnMgPSB7fSwgY2IgPSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCByZXF1ZXN0T3B0aW9ucyA9IHt9O1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fX2RlZmF1bHRzKS5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICByZXF1ZXN0T3B0aW9uc1twcm9wXSA9IHRoaXMuX19kZWZhdWx0c1twcm9wXTtcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmtleXMod2l0aE9wdGlvbnMpLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgIHJlcXVlc3RPcHRpb25zW3Byb3BdID0gd2l0aE9wdGlvbnNbcHJvcF07XG4gICAgICB9KTtcblxuICAgICAgbG9nKGBzZWFyY2hpbmcgJHtwYXRofSB3aXRoIG9wdGlvbnM6YCwgcmVxdWVzdE9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RBbGxQYWdlcyhgL3NlYXJjaC8ke3BhdGh9YCwgcmVxdWVzdE9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBTZWFyY2ggZm9yIHJlcG9zaXRvcmllc1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3NlYXJjaC8jc2VhcmNoLXJlcG9zaXRvcmllc1xuICAgICogQHBhcmFtIHtTZWFyY2guUGFyYW1zfSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgZm9yIHRoZSBzZWFyY2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIHJlc3VsdHMgb2YgdGhlIHNlYXJjaFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBmb3JSZXBvc2l0b3JpZXMob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZWFyY2goJ3JlcG9zaXRvcmllcycsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBTZWFyY2ggZm9yIGNvZGVcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9zZWFyY2gvI3NlYXJjaC1jb2RlXG4gICAgKiBAcGFyYW0ge1NlYXJjaC5QYXJhbXN9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmb3IgdGhlIHNlYXJjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcmVzdWx0cyBvZiB0aGUgc2VhcmNoXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGZvckNvZGUob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZWFyY2goJ2NvZGUnLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogU2VhcmNoIGZvciBpc3N1ZXNcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9zZWFyY2gvI3NlYXJjaC1pc3N1ZXNcbiAgICAqIEBwYXJhbSB7U2VhcmNoLlBhcmFtc30gW29wdGlvbnNdIC0gYWRkaXRpb25hbCBwYXJhbWV0ZXJzIGZvciB0aGUgc2VhcmNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSByZXN1bHRzIG9mIHRoZSBzZWFyY2hcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZm9ySXNzdWVzKG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VhcmNoKCdpc3N1ZXMnLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogU2VhcmNoIGZvciB1c2Vyc1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3NlYXJjaC8jc2VhcmNoLXVzZXJzXG4gICAgKiBAcGFyYW0ge1NlYXJjaC5QYXJhbXN9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmb3IgdGhlIHNlYXJjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcmVzdWx0cyBvZiB0aGUgc2VhcmNoXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGZvclVzZXJzKG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VhcmNoKCd1c2VycycsIG9wdGlvbnMsIGNiKTtcbiAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWFyY2g7XG4iXX0=
//# sourceMappingURL=Search.js.map
