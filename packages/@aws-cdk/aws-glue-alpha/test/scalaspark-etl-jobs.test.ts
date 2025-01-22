import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

describe('Job', () => {
  let stack: cdk.Stack;
  let role: iam.IRole;
  let script: glue.Code;
  let codeBucket: s3.IBucket;
  let job: glue.IJob;
  let className: string;
  let sparkUIBucket: s3.Bucket;

  beforeEach(() => {
    stack = new cdk.Stack();
    role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
    codeBucket = s3.Bucket.fromBucketName(stack, 'CodeBucket', 'bucketname');
    script = glue.Code.fromBucket(codeBucket, 'script');
    className = 'com.example.HelloWorld';
  });

  describe('Create new Scala Spark ETL Job with default parameters', () => {

    beforeEach(() => {
      job = new glue.ScalaSparkEtlJob(stack, 'ImportedJob', { role, script, className });
    });

    test('Test default attributes', () => {
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: job.jobName,
      }));
      expect(job.grantPrincipal).toEqual(role);
    });

    test('Default Glue Version should be 4.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: glue.GlueVersion.V4_0,
      });
    });

    test('Default numberOfWorkers should be 10', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 10,
      });
    });

    test('Default WorkerType should be G.1X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: 'G.1X',
      });
    });

    test('Has Continuous Logging Enabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'scala',
          '--enable-continuous-cloudwatch-log': 'true',
        }),
      });
    });

    test('Default numberOfWorkers should be 10', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 10,
      });
    });

    test('Default job run queuing should be diabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        JobRunQueuingEnabled: false,
      });
    });
  });

  describe('Create new Scala ETL Job with log override parameters', () => {

    beforeEach(() => {
      job = new glue.ScalaSparkEtlJob(stack, 'ScalaSparkEtlJob', {
        jobName: 'ScalaSparkEtlJob',
        role,
        script,
        className: 'com.example.HelloWorld',
        continuousLogging: {
          enabled: true,
          quiet: true,
          logGroup: new LogGroup(stack, 'logGroup', {
            logGroupName: '/aws-glue/jobs/${job.jobName}',
          }),
          logStreamPrefix: 'logStreamPrefix',
          conversionPattern: 'convert',
        },
      });
    });

    test('Has Continuous Logging enabled with optional args', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'scala',
          '--continuous-log-logGroup': Match.objectLike({
            Ref: Match.anyValue(),
          }),
          '--enable-continuous-cloudwatch-log': 'true',
          '--enable-continuous-log-filter': 'true',
          '--continuous-log-logStreamPrefix': 'logStreamPrefix',
          '--continuous-log-conversionPattern': 'convert',
        }),
      });
    });

  });

  describe('Create new Scala ETL Job with logging explicitly disabled', () => {

    beforeEach(() => {
      job = new glue.ScalaSparkEtlJob(stack, 'ScalaSparkEtlJob', {
        jobName: 'ScalaSparkEtlJob',
        role,
        script,
        className: 'com.example.HelloWorld',
        continuousLogging: {
          enabled: false,
        },
      });
    });

    test('Has Continuous Logging Disabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: {
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'scala',
        },
      });
    });

  });

  describe('Create ScalaSpark ETL Job with optional properties', () => {

    beforeEach(() => {
      job = new glue.ScalaSparkEtlJob(stack, 'ScalaSparkEtlJob', {
        jobName: 'ScalaSparkEtlJob',
        description: 'This is a description',
        role,
        script,
        className,
        glueVersion: glue.GlueVersion.V3_0,
        continuousLogging: { enabled: false },
        workerType: glue.WorkerType.G_2X,
        maxConcurrentRuns: 100,
        timeout: cdk.Duration.hours(2),
        connections: [glue.Connection.fromConnectionName(stack, 'Connection', 'connectionName')],
        securityConfiguration: glue.SecurityConfiguration.fromSecurityConfigurationName(stack, 'SecurityConfig', 'securityConfigName'),
        tags: {
          FirstTagName: 'FirstTagValue',
          SecondTagName: 'SecondTagValue',
          XTagName: 'XTagValue',
        },
        numberOfWorkers: 2,
        maxRetries: 2,
      });
    });

    test('Test job attributes', () => {
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: job.jobName,
      }));
      expect(job.grantPrincipal).toEqual(role);
    });

    test('Custom Job Name and Description', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Name: 'ScalaSparkEtlJob',
        Description: 'This is a description',
      });
    });

    test('Overriden Glue Version should be 3.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '3.0',
      });
    });

    test('Verify Default Arguemnts', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'scala',
        }),
      });
    });

    test('Overriden numberOfWorkers should be 2', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 2,
      });
    });

    test('Overriden WorkerType should be G.2X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: glue.WorkerType.G_2X,
      });
    });

    test('Overriden max retries should be 2', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxRetries: 2,
      });
    });

    test('Overriden max concurrent runs should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        ExecutionProperty: {
          MaxConcurrentRuns: 100,
        },
      });
    });

    test('Overriden timeout should be 2 hours', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Timeout: 120,
      });
    });

    test('Overriden connections should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Connections: {
          Connections: ['connectionName'],
        },
      });
    });

    test('Overriden security configuration should be set', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        SecurityConfiguration: 'securityConfigName',
      });
    });

    test('Should have tags', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Tags: {
          FirstTagName: 'FirstTagValue',
          SecondTagName: 'SecondTagValue',
          XTagName: 'XTagValue',
        },
      });
    });
  });

  describe('Create ScalaSpark ETL Job with job run queuing enabled', () => {

    beforeEach(() => {
      job = new glue.ScalaSparkEtlJob(stack, 'ScalaSparkEtlJob', {
        jobName: 'ScalaSparkEtlJob',
        description: 'This is a description',
        role,
        script,
        className,
        glueVersion: glue.GlueVersion.V3_0,
        continuousLogging: { enabled: false },
        workerType: glue.WorkerType.G_2X,
        maxConcurrentRuns: 100,
        timeout: cdk.Duration.hours(2),
        connections: [glue.Connection.fromConnectionName(stack, 'Connection', 'connectionName')],
        securityConfiguration: glue.SecurityConfiguration.fromSecurityConfigurationName(stack, 'SecurityConfig', 'securityConfigName'),
        tags: {
          FirstTagName: 'FirstTagValue',
          SecondTagName: 'SecondTagValue',
          XTagName: 'XTagValue',
        },
        numberOfWorkers: 2,
        maxRetries: 2,
        jobRunQueuingEnabled: true,
      });
    });

    test('Test job attributes', () => {
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: job.jobName,
      }));
      expect(job.grantPrincipal).toEqual(role);
    });

    test('Custom Job Name and Description', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Name: 'ScalaSparkEtlJob',
        Description: 'This is a description',
      });
    });

    test('Overriden Glue Version should be 3.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '3.0',
      });
    });

    test('Verify Default Arguemnts', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'scala',
        }),
      });
    });

    test('Overriden numberOfWorkers should be 2', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 2,
      });
    });

    test('Overriden WorkerType should be G.2X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: glue.WorkerType.G_2X,
      });
    });

    test('Overriden job run queuing should be enabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        JobRunQueuingEnabled: true,
      });
    });

    test('Default max retries with job run queuing enabled should be 0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxRetries: 0,
      });
    });

    test('Overriden max concurrent runs should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        ExecutionProperty: {
          MaxConcurrentRuns: 100,
        },
      });
    });

    test('Overriden timeout should be 2 hours', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Timeout: 120,
      });
    });

    test('Overriden connections should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Connections: {
          Connections: ['connectionName'],
        },
      });
    });

    test('Overriden security configuration should be set', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        SecurityConfiguration: 'securityConfigName',
      });
    });

    test('Should have tags', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Tags: {
          FirstTagName: 'FirstTagValue',
          SecondTagName: 'SecondTagValue',
          XTagName: 'XTagValue',
        },
      });
    });
  });

  describe('Create ScalaSpark ETL Job with extraJars', () => {

    beforeEach(() => {
      job = new glue.ScalaSparkEtlJob(stack, 'ScalaSparkEtlJob', {
        role,
        script,
        jobName: 'ScalaSparkEtlJob',
        className,
        extraJars: [
          glue.Code.fromBucket(
            s3.Bucket.fromBucketName(stack, 'extraJarsBucket', 'extra-jars-bucket'),
            'prefix/file.jar'),
        ],
      });
    });

    test('Test default attributes', () => {
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: job.jobName,
      }));
      expect(job.grantPrincipal).toEqual(role);
    });

    test('Default Glue Version should be 4.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: glue.GlueVersion.V4_0,
      });
    });

    test('Verify Default Arguemnts', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'scala',
          '--enable-continuous-cloudwatch-log': 'true',
          '--extra-jars': 's3://extra-jars-bucket/prefix/file.jar',
        }),
      });
    });

    test('Default numberOfWorkers should be 10', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 10,
      });
    });

    test('Default WorkerType should be G.1X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: 'G.1X',
      });
    });
  });

  describe('Override SparkUI properties for ScalaSpark ETL Job', () => {

    beforeEach(() => {
      sparkUIBucket = new s3.Bucket(stack, 'sparkUIbucket', { bucketName: 'bucket-name' });
      job = new glue.ScalaSparkEtlJob(stack, 'ScalaSparkEtlJob', {
        role,
        script,
        jobName: 'ScalaSparkEtlJob',
        className,
        sparkUI: {
          bucket: sparkUIBucket,
          prefix: '/prefix',
        },
      });
    });

    test('Test default attributes', () => {
      expect(job.jobArn).toEqual(stack.formatArn({
        service: 'glue',
        resource: 'job',
        resourceName: job.jobName,
      }));
      expect(job.grantPrincipal).toEqual(role);
    });

    test('Default Glue Version should be 4.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: glue.GlueVersion.V4_0,
      });
    });

    test('Has Continuous Logging and SparkUIEnabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'scala',
          '--enable-continuous-cloudwatch-log': 'true',
          '--enable-spark-ui': 'true',
          '--spark-event-logs-path': Match.objectLike({
            'Fn::Join': [
              '',
              [
                's3://',
                { Ref: Match.anyValue() },
                '/prefix/',
              ],
            ],
          }),
        }),
      });
    });
  });
});
