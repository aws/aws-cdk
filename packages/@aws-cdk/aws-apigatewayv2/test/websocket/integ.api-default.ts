#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as apigw from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websockets');

new apigw.WebSocketApi(stack, 'MyWebsocketApi');

app.synth();