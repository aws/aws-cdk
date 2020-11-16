#!/usr/bin/env node
const path = require('path');
const ROOTDIR = path.resolve(__dirname, '..');
const resolveVersion = require('./resolve-version-lib');
module.exports = resolveVersion(ROOTDIR);
