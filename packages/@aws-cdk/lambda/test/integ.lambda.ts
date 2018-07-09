import { App, PolicyStatement, Stack } from '@aws-cdk/core';
import { Alias, Function, FunctionInlineCode, FunctionRuntime } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-lambda-1');

const fn = new Function(stack, 'MyLambda', {
    code: new FunctionInlineCode('foo'),
    handler: 'index.handler',
    runtime: FunctionRuntime.NodeJS610,
});

fn.addToRolePolicy(new PolicyStatement().addResource('*').addAction('*'));

const version = fn.addVersion('1');

new Alias(stack, 'Alias', {
    aliasName: 'prod',
    version,
});

process.stdout.write(app.run());
