#!/usr/bin/env node
import assets = require('@aws-cdk/assets');
import cdk = require('@aws-cdk/cdk');
import { Project } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-shell');

new Project(stack, 'MyProject', {
  buildScriptAsset: new assets.ZipDirectoryAsset(stack, 'Bundle', { path: 'script_bundle' })
});

app.synth();
