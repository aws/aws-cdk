'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Requestable2 = require('./Requestable');

var _Requestable3 = _interopRequireDefault(_Requestable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright  2013 Michael Aufreiter (Development Seed) and 2016 Yahoo Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license    Licensed under {@link https://spdx.org/licenses/BSD-3-Clause-Clear.html BSD-3-Clause-Clear}.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *             Github.js is freely distributable.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * A Gist can retrieve and modify gists.
 */
var Gist = function (_Requestable) {
  _inherits(Gist, _Requestable);

  /**
   * Create a Gist.
   * @param {string} id - the id of the gist (not required when creating a gist)
   * @param {Requestable.auth} [auth] - information required to authenticate to Github
   * @param {string} [apiBase=https://api.github.com] - the base Github API URL
   */
  function Gist(id, auth, apiBase) {
    _classCallCheck(this, Gist);

    var _this = _possibleConstructorReturn(this, (Gist.__proto__ || Object.getPrototypeOf(Gist)).call(this, auth, apiBase));

    _this.__id = id;
    return _this;
  }

  /**
   * Fetch a gist.
   * @see https://developer.github.com/v3/gists/#get-a-single-gist
   * @param {Requestable.callback} [cb] - will receive the gist
   * @return {Promise} - the Promise for the http request
   */


  _createClass(Gist, [{
    key: 'read',
    value: function read(cb) {
      return this._request('GET', '/gists/' + this.__id, null, cb);
    }

    /**
     * Create a new gist.
     * @see https://developer.github.com/v3/gists/#create-a-gist
     * @param {Object} gist - the data for the new gist
     * @param {Requestable.callback} [cb] - will receive the new gist upon creation
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'create',
    value: function create(gist, cb) {
      var _this2 = this;

      return this._request('POST', '/gists', gist, cb).then(function (response) {
        _this2.__id = response.data.id;
        return response;
      });
    }

    /**
     * Delete a gist.
     * @see https://developer.github.com/v3/gists/#delete-a-gist
     * @param {Requestable.callback} [cb] - will receive true if the request succeeds
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'delete',
    value: function _delete(cb) {
      return this._request('DELETE', '/gists/' + this.__id, null, cb);
    }

    /**
     * Fork a gist.
     * @see https://developer.github.com/v3/gists/#fork-a-gist
     * @param {Requestable.callback} [cb] - the function that will receive the gist
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'fork',
    value: function fork(cb) {
      return this._request('POST', '/gists/' + this.__id + '/forks', null, cb);
    }

    /**
     * Update a gist.
     * @see https://developer.github.com/v3/gists/#edit-a-gist
     * @param {Object} gist - the new data for the gist
     * @param {Requestable.callback} [cb] - the function that receives the API result
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'update',
    value: function update(gist, cb) {
      return this._request('PATCH', '/gists/' + this.__id, gist, cb);
    }

    /**
     * Star a gist.
     * @see https://developer.github.com/v3/gists/#star-a-gist
     * @param {Requestable.callback} [cb] - will receive true if the request is successful
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'star',
    value: function star(cb) {
      return this._request('PUT', '/gists/' + this.__id + '/star', null, cb);
    }

    /**
     * Unstar a gist.
     * @see https://developer.github.com/v3/gists/#unstar-a-gist
     * @param {Requestable.callback} [cb] - will receive true if the request is successful
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'unstar',
    value: function unstar(cb) {
      return this._request('DELETE', '/gists/' + this.__id + '/star', null, cb);
    }

    /**
     * Check if a gist is starred by the user.
     * @see https://developer.github.com/v3/gists/#check-if-a-gist-is-starred
     * @param {Requestable.callback} [cb] - will receive true if the gist is starred and false if the gist is not starred
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'isStarred',
    value: function isStarred(cb) {
      return this._request204or404('/gists/' + this.__id + '/star', null, cb);
    }

    /**
     * List the gist's commits
     * @see https://developer.github.com/v3/gists/#list-gist-commits
     * @param {Requestable.callback} [cb] - will receive the array of commits
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'listCommits',
    value: function listCommits(cb) {
      return this._requestAllPages('/gists/' + this.__id + '/commits', null, cb);
    }

    /**
     * Fetch one of the gist's revision.
     * @see https://developer.github.com/v3/gists/#get-a-specific-revision-of-a-gist
     * @param {string} revision - the id of the revision
     * @param {Requestable.callback} [cb] - will receive the revision
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'getRevision',
    value: function getRevision(revision, cb) {
      return this._request('GET', '/gists/' + this.__id + '/' + revision, null, cb);
    }

    /**
     * List the gist's comments
     * @see https://developer.github.com/v3/gists/comments/#list-comments-on-a-gist
     * @param {Requestable.callback} [cb] - will receive the array of comments
     * @return {Promise} - the promise for the http request
     */

  }, {
    key: 'listComments',
    value: function listComments(cb) {
      return this._requestAllPages('/gists/' + this.__id + '/comments', null, cb);
    }

    /**
     * Fetch one of the gist's comments
     * @see https://developer.github.com/v3/gists/comments/#get-a-single-comment
     * @param {number} comment - the id of the comment
     * @param {Requestable.callback} [cb] - will receive the comment
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'getComment',
    value: function getComment(comment, cb) {
      return this._request('GET', '/gists/' + this.__id + '/comments/' + comment, null, cb);
    }

    /**
     * Comment on a gist
     * @see https://developer.github.com/v3/gists/comments/#create-a-comment
     * @param {string} comment - the comment to add
     * @param {Requestable.callback} [cb] - the function that receives the API result
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'createComment',
    value: function createComment(comment, cb) {
      return this._request('POST', '/gists/' + this.__id + '/comments', { body: comment }, cb);
    }

    /**
     * Edit a comment on the gist
     * @see https://developer.github.com/v3/gists/comments/#edit-a-comment
     * @param {number} comment - the id of the comment
     * @param {string} body - the new comment
     * @param {Requestable.callback} [cb] - will receive the modified comment
     * @return {Promise} - the promise for the http request
     */

  }, {
    key: 'editComment',
    value: function editComment(comment, body, cb) {
      return this._request('PATCH', '/gists/' + this.__id + '/comments/' + comment, { body: body }, cb);
    }

    /**
     * Delete a comment on the gist.
     * @see https://developer.github.com/v3/gists/comments/#delete-a-comment
     * @param {number} comment - the id of the comment
     * @param {Requestable.callback} [cb] - will receive true if the request succeeds
     * @return {Promise} - the Promise for the http request
     */

  }, {
    key: 'deleteComment',
    value: function deleteComment(comment, cb) {
      return this._request('DELETE', '/gists/' + this.__id + '/comments/' + comment, null, cb);
    }
  }]);

  return Gist;
}(_Requestable3.default);

module.exports = Gist;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdpc3QuanMiXSwibmFtZXMiOlsiR2lzdCIsImlkIiwiYXV0aCIsImFwaUJhc2UiLCJfX2lkIiwiY2IiLCJfcmVxdWVzdCIsImdpc3QiLCJ0aGVuIiwicmVzcG9uc2UiLCJkYXRhIiwiX3JlcXVlc3QyMDRvcjQwNCIsIl9yZXF1ZXN0QWxsUGFnZXMiLCJyZXZpc2lvbiIsImNvbW1lbnQiLCJib2R5IiwiUmVxdWVzdGFibGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBT0E7Ozs7Ozs7Ozs7K2VBUEE7Ozs7Ozs7QUFTQTs7O0lBR01BLEk7OztBQUNIOzs7Ozs7QUFNQSxnQkFBWUMsRUFBWixFQUFnQkMsSUFBaEIsRUFBc0JDLE9BQXRCLEVBQStCO0FBQUE7O0FBQUEsNEdBQ3RCRCxJQURzQixFQUNoQkMsT0FEZ0I7O0FBRTVCLFVBQUtDLElBQUwsR0FBWUgsRUFBWjtBQUY0QjtBQUc5Qjs7QUFFRDs7Ozs7Ozs7Ozt5QkFNS0ksRSxFQUFJO0FBQ04sYUFBTyxLQUFLQyxRQUFMLENBQWMsS0FBZCxjQUErQixLQUFLRixJQUFwQyxFQUE0QyxJQUE1QyxFQUFrREMsRUFBbEQsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7OzJCQU9PRSxJLEVBQU1GLEUsRUFBSTtBQUFBOztBQUNkLGFBQU8sS0FBS0MsUUFBTCxDQUFjLE1BQWQsRUFBc0IsUUFBdEIsRUFBZ0NDLElBQWhDLEVBQXNDRixFQUF0QyxFQUNIRyxJQURHLENBQ0UsVUFBQ0MsUUFBRCxFQUFjO0FBQ2pCLGVBQUtMLElBQUwsR0FBWUssU0FBU0MsSUFBVCxDQUFjVCxFQUExQjtBQUNBLGVBQU9RLFFBQVA7QUFDRixPQUpHLENBQVA7QUFLRjs7QUFFRDs7Ozs7Ozs7OzRCQU1PSixFLEVBQUk7QUFDUixhQUFPLEtBQUtDLFFBQUwsQ0FBYyxRQUFkLGNBQWtDLEtBQUtGLElBQXZDLEVBQStDLElBQS9DLEVBQXFEQyxFQUFyRCxDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozt5QkFNS0EsRSxFQUFJO0FBQ04sYUFBTyxLQUFLQyxRQUFMLENBQWMsTUFBZCxjQUFnQyxLQUFLRixJQUFyQyxhQUFtRCxJQUFuRCxFQUF5REMsRUFBekQsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7OzJCQU9PRSxJLEVBQU1GLEUsRUFBSTtBQUNkLGFBQU8sS0FBS0MsUUFBTCxDQUFjLE9BQWQsY0FBaUMsS0FBS0YsSUFBdEMsRUFBOENHLElBQTlDLEVBQW9ERixFQUFwRCxDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozt5QkFNS0EsRSxFQUFJO0FBQ04sYUFBTyxLQUFLQyxRQUFMLENBQWMsS0FBZCxjQUErQixLQUFLRixJQUFwQyxZQUFpRCxJQUFqRCxFQUF1REMsRUFBdkQsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7MkJBTU9BLEUsRUFBSTtBQUNSLGFBQU8sS0FBS0MsUUFBTCxDQUFjLFFBQWQsY0FBa0MsS0FBS0YsSUFBdkMsWUFBb0QsSUFBcEQsRUFBMERDLEVBQTFELENBQVA7QUFDRjs7QUFFRDs7Ozs7Ozs7OzhCQU1VQSxFLEVBQUk7QUFDWCxhQUFPLEtBQUtNLGdCQUFMLGFBQWdDLEtBQUtQLElBQXJDLFlBQWtELElBQWxELEVBQXdEQyxFQUF4RCxDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7OztnQ0FNWUEsRSxFQUFJO0FBQ2IsYUFBTyxLQUFLTyxnQkFBTCxhQUFnQyxLQUFLUixJQUFyQyxlQUFxRCxJQUFyRCxFQUEyREMsRUFBM0QsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7O2dDQU9ZUSxRLEVBQVVSLEUsRUFBSTtBQUN2QixhQUFPLEtBQUtDLFFBQUwsQ0FBYyxLQUFkLGNBQStCLEtBQUtGLElBQXBDLFNBQTRDUyxRQUE1QyxFQUF3RCxJQUF4RCxFQUE4RFIsRUFBOUQsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7aUNBTWFBLEUsRUFBSTtBQUNkLGFBQU8sS0FBS08sZ0JBQUwsYUFBZ0MsS0FBS1IsSUFBckMsZ0JBQXNELElBQXRELEVBQTREQyxFQUE1RCxDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7K0JBT1dTLE8sRUFBU1QsRSxFQUFJO0FBQ3JCLGFBQU8sS0FBS0MsUUFBTCxDQUFjLEtBQWQsY0FBK0IsS0FBS0YsSUFBcEMsa0JBQXFEVSxPQUFyRCxFQUFnRSxJQUFoRSxFQUFzRVQsRUFBdEUsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7O2tDQU9jUyxPLEVBQVNULEUsRUFBSTtBQUN4QixhQUFPLEtBQUtDLFFBQUwsQ0FBYyxNQUFkLGNBQWdDLEtBQUtGLElBQXJDLGdCQUFzRCxFQUFDVyxNQUFNRCxPQUFQLEVBQXRELEVBQXVFVCxFQUF2RSxDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O2dDQVFZUyxPLEVBQVNDLEksRUFBTVYsRSxFQUFJO0FBQzVCLGFBQU8sS0FBS0MsUUFBTCxDQUFjLE9BQWQsY0FBaUMsS0FBS0YsSUFBdEMsa0JBQXVEVSxPQUF2RCxFQUFrRSxFQUFDQyxNQUFNQSxJQUFQLEVBQWxFLEVBQWdGVixFQUFoRixDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7a0NBT2NTLE8sRUFBU1QsRSxFQUFJO0FBQ3hCLGFBQU8sS0FBS0MsUUFBTCxDQUFjLFFBQWQsY0FBa0MsS0FBS0YsSUFBdkMsa0JBQXdEVSxPQUF4RCxFQUFtRSxJQUFuRSxFQUF5RVQsRUFBekUsQ0FBUDtBQUNGOzs7O0VBNUtlVyxxQjs7QUErS25CQyxPQUFPQyxPQUFQLEdBQWlCbEIsSUFBakIiLCJmaWxlIjoiR2lzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEBjb3B5cmlnaHQgIDIwMTMgTWljaGFlbCBBdWZyZWl0ZXIgKERldmVsb3BtZW50IFNlZWQpIGFuZCAyMDE2IFlhaG9vIEluYy5cbiAqIEBsaWNlbnNlICAgIExpY2Vuc2VkIHVuZGVyIHtAbGluayBodHRwczovL3NwZHgub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZS1DbGVhci5odG1sIEJTRC0zLUNsYXVzZS1DbGVhcn0uXG4gKiAgICAgICAgICAgICBHaXRodWIuanMgaXMgZnJlZWx5IGRpc3RyaWJ1dGFibGUuXG4gKi9cblxuaW1wb3J0IFJlcXVlc3RhYmxlIGZyb20gJy4vUmVxdWVzdGFibGUnO1xuXG4vKipcbiAqIEEgR2lzdCBjYW4gcmV0cmlldmUgYW5kIG1vZGlmeSBnaXN0cy5cbiAqL1xuY2xhc3MgR2lzdCBleHRlbmRzIFJlcXVlc3RhYmxlIHtcbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgR2lzdC5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHRoZSBpZCBvZiB0aGUgZ2lzdCAobm90IHJlcXVpcmVkIHdoZW4gY3JlYXRpbmcgYSBnaXN0KVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5hdXRofSBbYXV0aF0gLSBpbmZvcm1hdGlvbiByZXF1aXJlZCB0byBhdXRoZW50aWNhdGUgdG8gR2l0aHViXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW2FwaUJhc2U9aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbV0gLSB0aGUgYmFzZSBHaXRodWIgQVBJIFVSTFxuICAgICovXG4gICBjb25zdHJ1Y3RvcihpZCwgYXV0aCwgYXBpQmFzZSkge1xuICAgICAgc3VwZXIoYXV0aCwgYXBpQmFzZSk7XG4gICAgICB0aGlzLl9faWQgPSBpZDtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBGZXRjaCBhIGdpc3QuXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvI2dldC1hLXNpbmdsZS1naXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBnaXN0XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHJlYWQoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL2dpc3RzLyR7dGhpcy5fX2lkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgZ2lzdC5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy8jY3JlYXRlLWEtZ2lzdFxuICAgICogQHBhcmFtIHtPYmplY3R9IGdpc3QgLSB0aGUgZGF0YSBmb3IgdGhlIG5ldyBnaXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBuZXcgZ2lzdCB1cG9uIGNyZWF0aW9uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZShnaXN0LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCAnL2dpc3RzJywgZ2lzdCwgY2IpXG4gICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX19pZCA9IHJlc3BvbnNlLmRhdGEuaWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICB9KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSBnaXN0LlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzLyNkZWxldGUtYS1naXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZHNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9naXN0cy8ke3RoaXMuX19pZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRm9yayBhIGdpc3QuXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvI2ZvcmstYS1naXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCByZWNlaXZlIHRoZSBnaXN0XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGZvcmsoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9naXN0cy8ke3RoaXMuX19pZH0vZm9ya3NgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogVXBkYXRlIGEgZ2lzdC5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy8jZWRpdC1hLWdpc3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBnaXN0IC0gdGhlIG5ldyBkYXRhIGZvciB0aGUgZ2lzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHRoZSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSBBUEkgcmVzdWx0XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVwZGF0ZShnaXN0LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9naXN0cy8ke3RoaXMuX19pZH1gLCBnaXN0LCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogU3RhciBhIGdpc3QuXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvI3N0YXItYS1naXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcXVlc3QgaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBzdGFyKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUFVUJywgYC9naXN0cy8ke3RoaXMuX19pZH0vc3RhcmAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBVbnN0YXIgYSBnaXN0LlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzLyN1bnN0YXItYS1naXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcXVlc3QgaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1bnN0YXIoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL2dpc3RzLyR7dGhpcy5fX2lkfS9zdGFyYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENoZWNrIGlmIGEgZ2lzdCBpcyBzdGFycmVkIGJ5IHRoZSB1c2VyLlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzLyNjaGVjay1pZi1hLWdpc3QtaXMtc3RhcnJlZFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBnaXN0IGlzIHN0YXJyZWQgYW5kIGZhbHNlIGlmIHRoZSBnaXN0IGlzIG5vdCBzdGFycmVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGlzU3RhcnJlZChjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QyMDRvcjQwNChgL2dpc3RzLyR7dGhpcy5fX2lkfS9zdGFyYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGdpc3QncyBjb21taXRzXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvI2xpc3QtZ2lzdC1jb21taXRzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBhcnJheSBvZiBjb21taXRzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RDb21taXRzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdEFsbFBhZ2VzKGAvZ2lzdHMvJHt0aGlzLl9faWR9L2NvbW1pdHNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRmV0Y2ggb25lIG9mIHRoZSBnaXN0J3MgcmV2aXNpb24uXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvI2dldC1hLXNwZWNpZmljLXJldmlzaW9uLW9mLWEtZ2lzdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJldmlzaW9uIC0gdGhlIGlkIG9mIHRoZSByZXZpc2lvblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcmV2aXNpb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UmV2aXNpb24ocmV2aXNpb24sIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9naXN0cy8ke3RoaXMuX19pZH0vJHtyZXZpc2lvbn1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgZ2lzdCdzIGNvbW1lbnRzXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvY29tbWVudHMvI2xpc3QtY29tbWVudHMtb24tYS1naXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBhcnJheSBvZiBjb21tZW50c1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0Q29tbWVudHMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0QWxsUGFnZXMoYC9naXN0cy8ke3RoaXMuX19pZH0vY29tbWVudHNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRmV0Y2ggb25lIG9mIHRoZSBnaXN0J3MgY29tbWVudHNcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy9jb21tZW50cy8jZ2V0LWEtc2luZ2xlLWNvbW1lbnRcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb21tZW50IC0gdGhlIGlkIG9mIHRoZSBjb21tZW50XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBjb21tZW50XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbW1lbnQoY29tbWVudCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL2dpc3RzLyR7dGhpcy5fX2lkfS9jb21tZW50cy8ke2NvbW1lbnR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENvbW1lbnQgb24gYSBnaXN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvY29tbWVudHMvI2NyZWF0ZS1hLWNvbW1lbnRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50IC0gdGhlIGNvbW1lbnQgdG8gYWRkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gdGhlIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgdGhlIEFQSSByZXN1bHRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlQ29tbWVudChjb21tZW50LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL2dpc3RzLyR7dGhpcy5fX2lkfS9jb21tZW50c2AsIHtib2R5OiBjb21tZW50fSwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEVkaXQgYSBjb21tZW50IG9uIHRoZSBnaXN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvY29tbWVudHMvI2VkaXQtYS1jb21tZW50XG4gICAgKiBAcGFyYW0ge251bWJlcn0gY29tbWVudCAtIHRoZSBpZCBvZiB0aGUgY29tbWVudFxuICAgICogQHBhcmFtIHtzdHJpbmd9IGJvZHkgLSB0aGUgbmV3IGNvbW1lbnRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIG1vZGlmaWVkIGNvbW1lbnRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZWRpdENvbW1lbnQoY29tbWVudCwgYm9keSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvZ2lzdHMvJHt0aGlzLl9faWR9L2NvbW1lbnRzLyR7Y29tbWVudH1gLCB7Ym9keTogYm9keX0sIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSBjb21tZW50IG9uIHRoZSBnaXN0LlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzL2NvbW1lbnRzLyNkZWxldGUtYS1jb21tZW50XG4gICAgKiBAcGFyYW0ge251bWJlcn0gY29tbWVudCAtIHRoZSBpZCBvZiB0aGUgY29tbWVudFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL2dpc3RzLyR7dGhpcy5fX2lkfS9jb21tZW50cy8ke2NvbW1lbnR9YCwgbnVsbCwgY2IpO1xuICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdpc3Q7XG4iXX0=
//# sourceMappingURL=Gist.js.map
