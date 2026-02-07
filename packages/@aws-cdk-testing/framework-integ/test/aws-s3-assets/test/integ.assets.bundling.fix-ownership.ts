import * as path from 'path';
import { App, DockerImage, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as assets from 'aws-cdk-lib/aws-s3-assets';

const app = new App();
const stack = new Stack(app, 'cdk-integ-assets-bundling-fix-ownership');

new assets.Asset(stack, 'BundledAsset', {
    path: path.join(__dirname, 'markdown-asset'),
    bundling: {
        image: DockerImage.fromRegistry('public.ecr.aws/docker/library/alpine:latest'),
        command: [
            'sh', '-c', 'echo "hello" > /asset-output/index.html',
        ],
        fixOwnership: true,
    },
});

new integ.IntegTest(app, 'cdk-integ-s3-assets-bundling-fix-ownership', {
    testCases: [stack],
});

app.synth();
