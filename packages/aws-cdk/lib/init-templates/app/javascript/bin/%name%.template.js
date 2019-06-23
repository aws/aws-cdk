#!/usr/bin/env node

// @ts-ignore: Cannot find declaration file
require('source-map-support/register');
const cdk = require('@aws-cdk/core');
const { %name.PascalCased%Stack } = require('../lib/%name%-stack');

const app = new cdk.App();
new %name.PascalCased%Stack(app, '%name.PascalCased%Stack');
