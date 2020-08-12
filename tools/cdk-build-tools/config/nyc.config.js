'use strict';
const { join } = require('path');
const { cwd } = require('process');

const packageJson = require(join(cwd(), 'package.json'));
const nycConfig = packageJson.nyc || {};

module.exports = {
  "check-coverage": true,
  "all": true,
  "statements": 80,
  "lines": 0,
  "branches": 50,
  "reporter": [
    "html",
    "lcov",
    "text-summary"
  ],
  "excludeAfterRemap": false,
  "cache": true,
  "exclude": [
    "coverage/**",
    "test/**",
    "examples/**",
    "lambda-packages/**",
    "lib/*.generated.js",
    "build-tools/**",
    ".eslintrc.js",
    "nyc.config.js"
  ],
  // Configuration in package.json supercedes that of the defaults above.
  ...nycConfig,
};
