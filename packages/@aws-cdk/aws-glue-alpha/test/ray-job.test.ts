
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

  beforeEach(() => {
    stack = new cdk.Stack();
    role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
    codeBucket = s3.Bucket.fromBucketName(stack, 'CodeBucket', 'bucketname');
    script = glue.Code.fromBucket(codeBucket, 'script');
  });

  describe('Create new Ray Job with default parameters', () => {
    beforeEach(() => {
      job = new glue.RayJob(stack, 'ImportedJob', { role, script });
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
        GlueVersion: '4.0',
      });
    });

    test('Default number of workers should be 3', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 3,
      });
    });

    test('Default worker type should be Z.2X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: 'Z.2X',
      });
    });

    test('Has Continuous Logging Enabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--enable-continuous-cloudwatch-log': 'true',
        }),
      });
    });

    test('Default job run queuing should be diabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        JobRunQueuingEnabled: false,
      });
    });
  });

  describe('Create new Ray Job with log override parameters', () => {
    beforeEach(() => {
      job = new glue.RayJob(stack, 'RayJob', {
        jobName: 'RayJob',
        role,
        script,
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

  describe('Create new Ray Job with logging explicitly disabled', () => {
    beforeEach(() => {
      job = new glue.RayJob(stack, 'RayJob', {
        jobName: 'RayJob',
        role,
        script,
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
        },
      });
    });
  });

  describe('Create Ray Job with optional override parameters', () => {
    beforeEach(() => {
      job = new glue.RayJob(stack, 'ImportedJob', {
        role,
        script,
        jobName: 'RayCustomJobName',
        description: 'This is a description',
        workerType: glue.WorkerType.Z_2X,
        numberOfWorkers: 5,
        runtime: glue.Runtime.RAY_TWO_FOUR,
        maxRetries: 3,
        maxConcurrentRuns: 100,
        timeout: cdk.Duration.hours(2),
        connections: [glue.Connection.fromConnectionName(stack, 'Connection', 'connectionName')],
        securityConfiguration: glue.SecurityConfiguration.fromSecurityConfigurationName(stack, 'SecurityConfig', 'securityConfigName'),
        tags: {
          FirstTagName: 'FirstTagValue',
          SecondTagName: 'SecondTagValue',
          XTagName: 'XTagValue',
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

    test('Cannot override Glue Version should be 4.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '4.0',
      });
    });

    test('Overridden number of workers should be 5', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 5,
      });
    });

    test('Cannot override worker type should be Z.2X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: 'Z.2X',
      });
    });

    test('Has Continuous Logging Enabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--enable-continuous-cloudwatch-log': 'true',
        }),
      });
    });

    test('Custom Job Name and Description', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Name: 'RayCustomJobName',
        Description: 'This is a description',
      });
    });

    test('Verify Default Arguemnts', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
        }),
      });
    });

    test('Overridden max retries should be 3', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxRetries: 3,
      });
    });

    test('Overridden max concurrent runs should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        ExecutionProperty: {
          MaxConcurrentRuns: 100,
        },
      });
    });

    test('Overridden timeout should be 2 hours', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Timeout: 120,
      });
    });

    test('Overridden connections should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Connections: {
          Connections: ['connectionName'],
        },
      });
    });

    test('Overridden security configuration should be set', () => {
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

  describe('Create Ray Job with job run queuing enabled', () => {
    beforeEach(() => {
      job = new glue.RayJob(stack, 'ImportedJob', {
        role,
        script,
        jobName: 'RayCustomJobName',
        description: 'This is a description',
        workerType: glue.WorkerType.Z_2X,
        numberOfWorkers: 5,
        runtime: glue.Runtime.RAY_TWO_FOUR,
        maxRetries: 3,
        maxConcurrentRuns: 100,
        timeout: cdk.Duration.hours(2),
        connections: [glue.Connection.fromConnectionName(stack, 'Connection', 'connectionName')],
        securityConfiguration: glue.SecurityConfiguration.fromSecurityConfigurationName(stack, 'SecurityConfig', 'securityConfigName'),
        tags: {
          FirstTagName: 'FirstTagValue',
          SecondTagName: 'SecondTagValue',
          XTagName: 'XTagValue',
        },
        jobRunQueuingEnabled: true,
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

    test('Cannot override Glue Version should be 4.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '4.0',
      });
    });

    test('Overridden number of workers should be 5', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        NumberOfWorkers: 5,
      });
    });

    test('Cannot override worker type should be Z.2X', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        WorkerType: 'Z.2X',
      });
    });

    test('Has Continuous Logging Enabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--enable-continuous-cloudwatch-log': 'true',
        }),
      });
    });

    test('Custom Job Name and Description', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Name: 'RayCustomJobName',
        Description: 'This is a description',
      });
    });

    test('Verify Default Arguemnts', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
        }),
      });
    });

    test('Overridden job run queuing should be enabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        JobRunQueuingEnabled: true,
      });
    });

    test('Default max retries with job run queuing enabled should be 0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxRetries: 0,
      });
    });

    test('Overridden max concurrent runs should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        ExecutionProperty: {
          MaxConcurrentRuns: 100,
        },
      });
    });

    test('Overridden timeout should be 2 hours', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Timeout: 120,
      });
    });

    test('Overridden connections should be 100', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Connections: {
          Connections: ['connectionName'],
        },
      });
    });

    test('Overridden security configuration should be set', () => {
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

  describe('Invalid overrides should cause errors', () => {
    test('Create Ray Job overriding only workerType to cause an Error', () => {
      expect(() => {
        job = new glue.RayJob(stack, 'RayJob', {
          role,
          script,
          workerType: glue.WorkerType.G_025X,
        });
      }).toThrow(new Error('Ray jobs only support Z.2X worker type'));
    });
  });
});
