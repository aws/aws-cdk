import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stack } from '../../core';
import * as s3express from '../lib';

describe('DirectoryBucketAccessPoint', () => {
  let stack: Stack;
  let bucket: s3express.DirectoryBucket;

  beforeEach(() => {
    stack = new Stack();
    bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });
  });

  test('create access point with default settings', () => {
    // WHEN
    new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
      bucket,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::AccessPoint', {
      Bucket: {
        Ref: 'MyBucketF68F3FF0',
      },
    });
  });

  test('create access point with custom name', () => {
    // WHEN
    new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
      bucket,
      accessPointName: 'my-access-point--useast1-az1--x-s3',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::AccessPoint', {
      Bucket: {
        Ref: 'MyBucketF68F3FF0',
      },
      Name: 'my-access-point--useast1-az1--x-s3',
    });
  });

  test('create access point with bucket account ID', () => {
    // WHEN
    new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
      bucket,
      bucketAccountId: '123456789012',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::AccessPoint', {
      Bucket: {
        Ref: 'MyBucketF68F3FF0',
      },
      BucketAccountId: '123456789012',
    });
  });

  test('grantRead grants correct permissions', () => {
    // GIVEN
    const accessPoint = new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
      bucket,
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    accessPoint.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject',
              's3:ListBucket',
            ],
            Effect: 'Allow',
          },
          {
            Action: [
              's3express:CreateSession',
              's3:GetObject',
              's3:ListBucket',
            ],
            Effect: 'Allow',
          },
        ],
      },
    });
  });

  test('grantWrite grants correct permissions', () => {
    // GIVEN
    const accessPoint = new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
      bucket,
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    accessPoint.grantWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:PutObject',
              's3:DeleteObject',
              's3:AbortMultipartUpload',
            ],
            Effect: 'Allow',
          },
          {
            Action: [
              's3express:CreateSession',
              's3:GetObject',
              's3:ListBucket',
            ],
            Effect: 'Allow',
          },
        ],
      },
    });
  });

  test('grantReadWrite grants correct permissions', () => {
    // GIVEN
    const accessPoint = new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
      bucket,
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    accessPoint.grantReadWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject',
              's3:ListBucket',
              's3:PutObject',
              's3:DeleteObject',
              's3:AbortMultipartUpload',
            ],
            Effect: 'Allow',
          },
          {
            Action: [
              's3express:CreateSession',
              's3:GetObject',
              's3:ListBucket',
            ],
            Effect: 'Allow',
          },
        ],
      },
    });
  });

  test('fromAccessPointArn imports access point correctly', () => {
    // WHEN
    const accessPoint = s3express.DirectoryBucketAccessPoint.fromAccessPointArn(
      stack,
      'ImportedAccessPoint',
      'arn:aws:s3express:us-east-1:123456789012:accesspoint/my-ap--useast1-az1--x-s3',
    );

    // THEN
    expect(accessPoint.accessPointArn).toBe('arn:aws:s3express:us-east-1:123456789012:accesspoint/my-ap--useast1-az1--x-s3');
    expect(accessPoint.accessPointName).toBe('my-ap--useast1-az1--x-s3');
  });

  test('fromAccessPointName imports access point correctly', () => {
    // WHEN
    const accessPoint = s3express.DirectoryBucketAccessPoint.fromAccessPointName(
      stack,
      'ImportedAccessPoint',
      'my-ap--useast1-az1--x-s3',
    );

    // THEN
    expect(accessPoint.accessPointName).toBe('my-ap--useast1-az1--x-s3');
    expect(accessPoint.accessPointArn).toContain('arn:');
    expect(accessPoint.accessPointArn).toContain(':s3express:');
    expect(accessPoint.accessPointArn).toContain(':accesspoint/my-ap--useast1-az1--x-s3');
  });

  test('imported access point can grant permissions', () => {
    // GIVEN
    const accessPoint = s3express.DirectoryBucketAccessPoint.fromAccessPointArn(
      stack,
      'ImportedAccessPoint',
      'arn:aws:s3express:us-east-1:123456789012:accesspoint/my-ap--useast1-az1--x-s3',
    );
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    accessPoint.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject',
              's3:ListBucket',
            ],
            Resource: [
              'arn:aws:s3express:us-east-1:123456789012:accesspoint/my-ap--useast1-az1--x-s3',
              'arn:aws:s3express:us-east-1:123456789012:accesspoint/my-ap--useast1-az1--x-s3/object/*',
            ],
          },
        ],
      },
    });
  });

  test('access point attributes are correctly exposed', () => {
    // GIVEN
    const accessPoint = new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
      bucket,
      accessPointName: 'my-ap--useast1-az1--x-s3',
    });

    // THEN
    expect(accessPoint.accessPointName).toBeDefined();
    expect(accessPoint.accessPointArn).toBeDefined();
    expect(accessPoint.accessPointArn).toContain(':s3express:');
  });
});
