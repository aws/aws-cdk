# Maintainers wanted
[Apply within](https://github.com/github-tools/github/issues/539)

# Github.js

[![Downloads per month](https://img.shields.io/npm/dm/github-api.svg?maxAge=2592000)][npm-package]
[![Latest version](https://img.shields.io/npm/v/github-api.svg?maxAge=3600)][npm-package]
[![Gitter](https://img.shields.io/gitter/room/github-tools/github.js.svg?maxAge=2592000)][gitter]
[![Travis](https://img.shields.io/travis/github-tools/github.svg?maxAge=60)][travis-ci]
[![Codecov](https://img.shields.io/codecov/c/github/github-tools/github.svg?maxAge=2592000)][codecov]

`Github.js` provides a minimal higher-level wrapper around Github's API.

## Usage

```javascript
/*
   Data can be retrieved from the API either using callbacks (as in versions < 1.0)
   or using a new promise-based API. The promise-based API returns the raw Axios
   request promise.
 */
import GitHub from 'github-api';

// unauthenticated client
const gh = new GitHub();
let gist = gh.getGist(); // not a gist yet
gist.create({
   public: true,
   description: 'My first gist',
   files: {
      "file1.txt": {
         content: "Aren't gists great!"
      }
   }
}).then(function({data}) {
   // Promises!
   let createdGist = data;
   return gist.read();
}).then(function({data}) {
   let retrievedGist = data;
   // do interesting things
});
```

```javascript
var GitHub = require('github-api');

// basic auth
var gh = new GitHub({
   username: 'FOO',
   password: 'NotFoo'
   /* also acceptable:
      token: 'MY_OAUTH_TOKEN'
    */
});

var me = gh.getUser(); // no user specified defaults to the user for whom credentials were provided
me.listNotifications(function(err, notifications) {
   // do some stuff
});

var clayreimann = gh.getUser('clayreimann');
clayreimann.listStarredRepos(function(err, repos) {
   // look at all the starred repos!
});
```

## API Documentation

[API documentation][docs] is hosted on github pages, and is generated from JSDoc; any contributions
should include updated JSDoc.

## Installation
`Github.js` is available from `npm` or [unpkg][unpkg].

```shell
npm install github-api
```

```html
<!-- just github-api source (5.3kb) -->
<script src="https://unpkg.com/github-api/dist/GitHub.min.js"></script>

<!-- standalone (20.3kb) -->
<script src="https://unpkg.com/github-api/dist/GitHub.bundle.min.js"></script>
```

## Compatibility
`Github.js` is tested on node's LTS and current versions.

[codecov]: https://codecov.io/github/github-tools/github?branch=master
[docs]: http://github-tools.github.io/github/
[gitter]: https://gitter.im/github-tools/github
[npm-package]: https://www.npmjs.com/package/github-api/
[unpkg]: https://unpkg.com/github-api/
[travis-ci]: https://travis-ci.org/github-tools/github
