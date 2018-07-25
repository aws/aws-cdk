import cdk = require('@aws-cdk/cdk');
import path = require('path');
import { Lambda, LambdaCode, LambdaRuntime } from '../lib';

class TestStack extends cdk.Stack {
    constructor(parent: cdk.App, id: string) {
        super(parent, id);

        /// !show
        new Lambda(this, 'MyLambda', {
            code: LambdaCode.file(path.join(__dirname, 'handler.zip')),
            handler: 'index.main',
            runtime: LambdaRuntime.Python36
        });
        /// !hide
    }
}

const app = new cdk.App(process.argv);

new TestStack(app, 'lambda-test-assets-file');

process.stdout.write(app.run());