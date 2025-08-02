import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rum from 'aws-cdk-lib/aws-rum';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'RumAppMonitorDeobfuscationIntegrationTestStack');

// Create an S3 bucket for source maps
const sourceMapsBundle = new s3.Bucket(stack, 'SourceMapsBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});

// App monitor with JavaScript source maps enabled
const appMonitorWithSourceMaps = new rum.AppMonitor(stack, 'AppMonitorWithSourceMaps', {
    appMonitorName: 'integ-test-app-with-source-maps',
    domain: 'example.com',
    deobfuscationConfiguration: {
        javaScriptSourceMaps: {
            enabled: true,
            s3Uri: `s3://${sourceMapsBundle.bucketName}/source-maps/`,
        },
    },
});

// App monitor with source maps disabled
const appMonitorWithoutSourceMaps = new rum.AppMonitor(stack, 'AppMonitorWithoutSourceMaps', {
    appMonitorName: 'integ-test-app-without-source-maps',
    domain: 'example.com',
    deobfuscationConfiguration: {
        javaScriptSourceMaps: {
            enabled: false,
        },
    },
});

// Outputs for verification
new cdk.CfnOutput(stack, 'AppMonitorWithSourceMapsId', {
    value: appMonitorWithSourceMaps.appMonitorId,
});

new cdk.CfnOutput(stack, 'AppMonitorWithoutSourceMapsId', {
    value: appMonitorWithoutSourceMaps.appMonitorId,
});

new cdk.CfnOutput(stack, 'SourceMapsBucketName', {
    value: sourceMapsBundle.bucketName,
});

new integ.IntegTest(app, 'RumAppMonitorDeobfuscationIntegrationTest', {
    testCases: [stack],
});