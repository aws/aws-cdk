import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as s3deploy from '../lib';
import { Template } from '../../assertions';

const { Fn, CfnMapping } = cdk;

test('BucketDeployment with Fn::FindInMap', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'FindInMapDeploymentTest');

  const bucket = new s3.Bucket(stack, 'Bucket');

  new CfnMapping(stack, 'ResponseMap', {
    mapping: {
      DefaultResponse: {
        Message: 'Hello from mapping!',
      },
    },
  });

  new s3deploy.BucketDeployment(stack, 'DeployWithMapping', {
    sources: [
      s3deploy.Source.jsonData('config.json', {
        message: Fn.findInMap('ResponseMap', 'DefaultResponse', 'Message'),
      }),
    ],
    destinationBucket: bucket,
  });

  // Correct: Template comes from @aws-cdk/assertions, not from cdk.core
  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});


