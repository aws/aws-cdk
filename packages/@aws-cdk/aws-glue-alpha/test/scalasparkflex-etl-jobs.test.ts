import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Template } from 'aws-cdk-lib/assertions';

describe('Job', () => {
  let stack: cdk.Stack;
  let role: iam.IRole;
  let script: glue.Code;
  let codeBucket: s3.IBucket;
  let job: glue.IJob;
  let className: string;

  beforeEach(() => {
    stack = new cdk.Stack();
    role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
    codeBucket = s3.Bucket.fromBucketName(stack, 'CodeBucket', 'bucketname');
    script = glue.Code.fromBucket(codeBucket, 'script');
    className = 'com.example.HelloWorld';
  });

  describe('Create new Scala Spark ETL Flex Job with default parameters', () => {

    beforeEach(() => {
      job = new glue.ScalaSparkFlexEtlJob(stack, 'ImportedJob', { role, script, className });
    });

    test('Test default attributes', () => {
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: job.jobName,
      }));
      expect(job.grantPrincipal).toEqual(role);
    });

    test('Default Glue Version should be 3.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '3.0',
      });
    });

    test('Default WorkerType should be G.2X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: 'G.2X',
      });
    });

    test('ExecutionClass should be Flex', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        ExecutionClass: 'FLEX',
      });
    });

  });
});