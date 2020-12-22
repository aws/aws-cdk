#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { %name.PascalCased%Stack } from '../lib/%name%-stack';

const app = new cdk.App();
new %name.PascalCased%Stack(app, '%name.PascalCased%Stack');
