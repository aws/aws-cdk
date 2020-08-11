#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { %name.PascalCased%Stack } from './stacks/%name%-stack';

const app = new cdk.App();
new %name.PascalCased%Stack(app, '%name.PascalCased%Stack', {
  // Configure your stack here
  
  // We recommend to pin your stack to a defined account and region 
  // to prevent deploying it to the wrong environment by accident
  // env: {
  //   account: 'YOUR_ACCOUNT_ID',
  //   region: 'YOUR_REGION',
  // },
});
