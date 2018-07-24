import { App, PolicyStatement, Stack } from '@aws-cdk/cdk';
import { Alias, Lambda, LambdaInlineCode, LambdaRuntime } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-lambda-1');

const fn = new Lambda(stack, 'MyLambda', {
    code: new LambdaInlineCode('foo'),
    handler: 'index.handler',
    runtime: LambdaRuntime.NodeJS610,
});

fn.addToRolePolicy(new PolicyStatement().addResource('*').addAction('*'));

const version = fn.addVersion('1');

new Alias(stack, 'Alias', {
    aliasName: 'prod',
    version,
});

process.stdout.write(app.run());
