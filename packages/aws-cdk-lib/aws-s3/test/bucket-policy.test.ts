import { Template } from '../../assertions';
import { AnyPrincipal, PolicyDocument, PolicyStatement } from '../../aws-iam';
import { App, RemovalPolicy, Stack, Validations } from '../../core';
import * as cxapi from '../../cx-api';
import * as s3 from '../lib';
import type { CfnBucketPolicy } from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable @stylistic/quote-props */

describe('bucket policy', () => {
  test('default properties', () => {
    const stack = new Stack();

    const myBucket = new s3.Bucket(stack, 'MyBucket');
    const myBucketPolicy = new s3.BucketPolicy(stack, 'MyBucketPolicy', {
      bucket: myBucket,
    });
    myBucketPolicy.document.addStatements(new PolicyStatement({
      resources: [myBucket.bucketArn],
      actions: ['s3:GetObject*'],
      principals: [new AnyPrincipal()],
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        'Ref': 'MyBucketF68F3FF0',
      },
      PolicyDocument: {
        'Version': '2012-10-17',
        'Statement': [
          {
            'Action': 's3:GetObject*',
            'Effect': 'Allow',
            'Principal': { AWS: '*' },
            'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
          },
        ],
      },
    });
  });

  test.each([
    [true, { Id: 'bucket-policy-1' }],
    [false, {}],
  ])('keeps the Id of a document from PolicyDocument.fromJson() when the feature flag is %s', (enabled, expectedId) => {
    const app = new App({ context: { [cxapi.IAM_POLICY_DOCUMENT_FROM_JSON_KEEPS_ID]: enabled } });
    const stack = new Stack(app, 'Stack');
    const statement = {
      Effect: 'Allow',
      Principal: { AWS: 'arn:aws:iam::123456789012:root' },
      Action: 's3:GetObject',
      Resource: 'arn:aws:s3:::my-bucket/*',
    };

    new s3.BucketPolicy(stack, 'MyBucketPolicy', {
      bucket: new s3.Bucket(stack, 'MyBucket'),
      document: PolicyDocument.fromJson({ Version: '2012-10-17', Id: 'bucket-policy-1', Statement: [statement] }),
    });

    const policies = Template.fromStack(stack).findResources('AWS::S3::BucketPolicy');
    expect(Object.values(policies)[0].Properties.PolicyDocument).toEqual({ ...expectedId, Version: '2012-10-17', Statement: [statement] });
  });

  test('when specifying a removalPolicy at creation', () => {
    const stack = new Stack();

    const myBucket = new s3.Bucket(stack, 'MyBucket');
    const myBucketPolicy = new s3.BucketPolicy(stack, 'MyBucketPolicy', {
      bucket: myBucket,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    myBucketPolicy.document.addStatements(new PolicyStatement({
      resources: [myBucket.bucketArn],
      actions: ['s3:GetObject*'],
      principals: [new AnyPrincipal()],
    }));

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
        'MyBucketPolicy0AFEFDBE': {
          'Type': 'AWS::S3::BucketPolicy',
          'Properties': {
            'Bucket': {
              'Ref': 'MyBucketF68F3FF0',
            },
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': 's3:GetObject*',
                  'Effect': 'Allow',
                  'Principal': { AWS: '*' },
                  'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                },
              ],
              'Version': '2012-10-17',
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('when specifying a removalPolicy after creation', () => {
    const stack = new Stack();

    const myBucket = new s3.Bucket(stack, 'MyBucket');
    myBucket.addToResourcePolicy(new PolicyStatement({
      resources: [myBucket.bucketArn],
      actions: ['s3:GetObject*'],
      principals: [new AnyPrincipal()],
    }));
    myBucket.policy?.applyRemovalPolicy(RemovalPolicy.RETAIN);

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
        'MyBucketPolicyE7FBAC7B': {
          'Type': 'AWS::S3::BucketPolicy',
          'Properties': {
            'Bucket': {
              'Ref': 'MyBucketF68F3FF0',
            },
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': 's3:GetObject*',
                  'Effect': 'Allow',
                  'Principal': { AWS: '*' },
                  'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                },
              ],
              'Version': '2012-10-17',
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('fails if bucket policy has no actions', () => {
    const stack = new Stack();
    const myBucket = new s3.Bucket(stack, 'MyBucket');
    myBucket.addToResourcePolicy(new PolicyStatement({
      resources: [myBucket.bucketArn],
      principals: [new AnyPrincipal()],
    }));

    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
  });

  test('fails if bucket policy has no IAM principals', () => {
    const stack = new Stack();
    const myBucket = new s3.Bucket(stack, 'MyBucket');
    myBucket.addToResourcePolicy(new PolicyStatement({
      resources: [myBucket.bucketArn],
      actions: ['s3:GetObject*'],
    }));

    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
  });

  test('fails if bucket policy has no resources', () => {
    const app = new App();
    const stack = new Stack(app, 'my-stack');
    const myBucket = new s3.Bucket(stack, 'MyBucket');
    myBucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject*'],
      principals: [new AnyPrincipal()],
      // Missing: resources
    }));

    expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one resource/);
  });

  describe('fromCfnBucketPolicy()', () => {
    const stack = new Stack();

    test('correctly extracts the Document and Bucket from the L1', () => {
      const cfnBucket = new s3.CfnBucket(stack, 'CfnBucket');
      const cfnBucketPolicy = bucketPolicyForBucketNamed(cfnBucket.ref);
      const bucketPolicy = s3.BucketPolicy.fromCfnBucketPolicy(cfnBucketPolicy);

      expect(bucketPolicy.document).not.toBeUndefined();
      expect(bucketPolicy.document.isEmpty).toBeFalsy();

      expect(bucketPolicy.bucket).not.toBeUndefined();
      expect(bucketPolicy.bucket.policy).not.toBeUndefined();
      expect(bucketPolicy.bucket.policy?.document.isEmpty).toBeFalsy();
    });

    test('correctly references a bucket by name', () => {
      const cfnBucketPolicy = bucketPolicyForBucketNamed('hardcoded-name');
      const bucketPolicy = s3.BucketPolicy.fromCfnBucketPolicy(cfnBucketPolicy);

      expect(bucketPolicy.bucket).not.toBeUndefined();
      expect(bucketPolicy.bucket.bucketName).toBe('hardcoded-name');
    });

    test('should synthesize without errors and create duplicate cfn resource', () => {
      const testStack = new Stack();
      Validations.of(testStack).acknowledge({
        id: 'CloudFormation-Validate::E3019',
        reason: 'This test is asserting something pointless',
      });

      const cfnBucketPolicy = new s3.CfnBucketPolicy(testStack, 'TestBucketPolicy', {
        policyDocument: {
          'Statement': [
            {
              'Action': 's3:*',
              'Effect': 'Deny',
              'Principal': {
                'AWS': '*',
              },
              'Resource': '*',
            },
          ],
          'Version': '2012-10-17',
        },
        bucket: 'test-bucket',
      });

      s3.BucketPolicy.fromCfnBucketPolicy(cfnBucketPolicy);

      // Verify that two CfnBucketPolicy resources are created
      const template = Template.fromStack(testStack);
      const bucketPolicies = template.findResources('AWS::S3::BucketPolicy');
      expect(Object.keys(bucketPolicies)).toHaveLength(2);

      // Both should have valid policy documents
      Object.values(bucketPolicies).forEach((policy: any) => {
        expect(policy.Properties.PolicyDocument).toBeDefined();
        expect(policy.Properties.PolicyDocument.Statement).toBeDefined();
      });
    });

    function bucketPolicyForBucketNamed(name: string): CfnBucketPolicy {
      return new s3.CfnBucketPolicy(stack, `CfnBucketPolicy-${name}`, {
        policyDocument: {
          'Statement': [
            {
              'Action': 's3:*',
              'Effect': 'Deny',
              'Principal': {
                'AWS': '*',
              },
              'Resource': '*',
            },
          ],
          'Version': '2012-10-17',
        },
        bucket: name,
      });
    }
  });
});
