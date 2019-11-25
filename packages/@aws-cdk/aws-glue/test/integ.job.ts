#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import glue = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue');

const job = new glue.Job(stack, 'MyJob', {});

app.synth();
