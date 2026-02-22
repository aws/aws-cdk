import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-function-hash');

const layer = new lambda.LayerVersion(stack, 'MyLayer', {
    code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code'), { exclude: ['*.ts'] }),
    compatibleRuntimes: [STANDARD_NODEJS_RUNTIME],
});

new lambda.Function(stack, 'MyFunction', {
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: STANDARD_NODEJS_RUNTIME,
    layers: [layer],
});

// Adding an unattached layer should not change the function hash
// with the feature flag enabled (which is default in new projects)
new lambda.LayerVersion(stack, 'UnattachedLayer', {
    code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code'), { exclude: ['*.ts'] }),
    compatibleRuntimes: [STANDARD_NODEJS_RUNTIME],
});

app.synth();
