#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { %name.PascalCased%Stack } from '../lib/%name%-stack';

const app = new cdk.App();
new %name.PascalCased%Stack(app, '%name.PascalCased%Stack');
app.run();
