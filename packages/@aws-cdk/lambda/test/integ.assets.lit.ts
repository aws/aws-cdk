import cdk = require('@aws-cdk/core');
import path = require('path');
import { Lambda, LambdaCode, LambdaRuntime } from '../lib';

class TestStack extends cdk.Stack {
    constructor(parent: cdk.App, id: string) {
        super(parent, id);

        /// !show
        new Lambda(this, 'MyLambda', {
            code: LambdaCode.asset(path.join(__dirname, 'my-lambda-handler')),
            handler: 'index.main',
            runtime: LambdaRuntime.Python36
        });
        /// !hide
    }
}

const app = new cdk.App(process.argv);

new TestStack(app, 'lambda-test-assets');

process.stdout.write(app.run());