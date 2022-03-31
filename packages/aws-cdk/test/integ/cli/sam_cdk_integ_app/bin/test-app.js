#!/usr/bin/env node
if (process.env.PACKAGE_LAYOUT_VERSION === '1') {
    var { App } = require('@aws-cdk/core');
} else {
    var { App } = require('aws-cdk-lib');
}
var test_stack_1 = require('../lib/test-stack');
var app = new App();
const stackPrefix = process.env.STACK_NAME_PREFIX;
new test_stack_1.CDKSupportDemoRootStack(app, `${stackPrefix}-TestStack`);
app.synth();
