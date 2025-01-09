import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ENABLE_ADDITIONAL_METADATA_COLLECTION } from 'aws-cdk-lib/cx-api';
import { MetadataType } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * This test creates resources using alphanumeric logical IDs.
 */

const app = new cdk.App({
  analyticsReporting: true,
  postCliContext: {
    [ENABLE_ADDITIONAL_METADATA_COLLECTION]: true,
  },
});

const stack = new cdk.Stack(app, 'EnableTelemtryStack');

const queueProp = {
  visibilityTimeout: cdk.Duration.seconds(300),
};
const queue = new sqs.Queue(stack, '01234test', queueProp);
queue.node.addMetadata(MetadataType.CONSTRUCT, queueProp);

const funcProp = {
  runtime: lambda.Runtime.PYTHON_3_8,
  handler: 'index.handler',
  code: lambda.Code.fromInline('def handler(event, context):\n\tprint(\'The function has been invoked.\')'),
};
const func = new lambda.Function(stack, 'MyFunction', funcProp);
func.node.addMetadata(MetadataType.CONSTRUCT, funcProp);

new integ.IntegTest(app, 'Enable Additional Metadata', {
  testCases: [stack],
});
