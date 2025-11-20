import { Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Bucket, BucketPolicy } from 'aws-cdk-lib/aws-s3';
import { tryFindBucketPolicy, XRayDeliveryDestinationPolicy } from '../../../lib/services/aws-logs/vended-logs-helpers';
import { AccountRootPrincipal, Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

describe('getOrCreateBucketPolicy', () => {
  test('if a bucket policy exists on a bucket, return it', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'TestBucket');

    new BucketPolicy(stack, 'S3BucketPolicy', {
      bucket: bucket,
      document: new PolicyDocument({
        statements: [new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new AccountRootPrincipal()],
          actions: ['s3:GetObject'],
          resources: [bucket.arnForObjects('*')],
        })],
      }),
    });

    const output = tryFindBucketPolicy(bucket);

    expect(output).toBeDefined();
  });

  test('if a bucket policy does not exist on a bucket, return undefined', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'TestBucket');

    const output = tryFindBucketPolicy(bucket);

    expect(output).toBeUndefined();
  });
});

describe('XRayDeliveryDestinationPolicy', () => {
  test('creates an XRay delivery policy', () => {
    const stack = new Stack();

    new XRayDeliveryDestinationPolicy(stack, 'CDKXRayPolicyGenerator');

    Template.fromStack(stack).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::XRay::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          [
            '{"Version":"2012-10-17","Statement":[{"Sid":"CDKLogsDeliveryWrite","Effect":"Allow","Principal":{"Service":"delivery.logs.amazonaws.com"},"Action":"xray:PutTraceSegments","Resource":"*","Condition":{"StringEquals":{"aws:SourceAccount":"',
            {
              Ref: 'AWS::AccountId',
            },
            '"},"ForAllValues:ArnLike":{"logs:LogGeneratingResourceArns":[]},"ArnLike":{"aws:SourceArn":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':logs:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':delivery-source:*"}}}]}',
          ],
        ],
      },
    });
  });

  test('XRay Delivery resource policy gets updated with log delivery sources', () => {
    const stack = new Stack();

    const xray = new XRayDeliveryDestinationPolicy(stack, 'CDKXRayPolicyGenerator');

    const bucket = new Bucket(stack, 'XRayTestBucket');
    const secret = new Secret(stack, 'XRayTestSecret', {
      description: 'Sample secret with arn to use for XRay',
    });

    xray.allowSource(bucket.bucketArn);
    xray.allowSource(secret.secretArn);

    Template.fromStack(stack).hasResourceProperties('AWS::XRay::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('.*logs:LogGeneratingResourceArns.*'),
            { 'Fn::GetAtt': ['XRayTestBucketEE28F545', 'Arn'] },
            { Ref: 'XRayTestSecret0AF068A2' },
          ]),
        ],
      },
    });
  });
});
