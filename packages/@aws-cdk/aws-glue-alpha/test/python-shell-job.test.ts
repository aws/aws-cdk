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

  describe('Create new Python Shell Job with default parameters', () => {

    beforeEach(() => {
      job = new glue.PythonShellJob(stack, 'ImportedJob', { role, script });
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

    test('Default Max Retries should be 0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxRetries: 0,
      });
    });

    test('Default job run queuing should be diabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        JobRunQueuingEnabled: false,
      });
    });

    test('Default Max Capacity should be 0.0625', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxCapacity: 0.0625,
      });
    });

    test('Default Python version should be 3.9', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          Name: glue.JobType.PYTHON_SHELL,
          ScriptLocation: 's3://bucketname/script',
          PythonVersion: glue.PythonVersion.THREE_NINE,
        },
      });
    });

    test('Has Continuous Logging Enabled', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--enable-continuous-cloudwatch-log': 'true',
          '--job-language': 'python',
          'library-set': 'analytics',
        }),
      });
    });

  });

  describe('Create new Python Shell Job with log override parameters', () => {

    beforeEach(() => {
      job = new glue.PythonShellJob(stack, 'PythonShellJob', {
        jobName: 'PythonShellJob',
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
          '--job-language': 'python',
        }),
      });
    });

  });

  describe('Create new Python Shell Job with logging explicitly disabled', () => {

    beforeEach(() => {
      job = new glue.PythonShellJob(stack, 'PythonShellJob', {
        jobName: 'PythonShellJob',
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
          '--job-language': 'python',
        },
      });
    });

  });

  describe('Create Python Shell Job with overridden Python verion and max capacity', () => {

    beforeEach(() => {
      job = new glue.PythonShellJob(stack, 'PythonShellJob', {
        role,
        script,
        jobName: 'PythonShellJob',
        pythonVersion: glue.PythonVersion.TWO,
        maxCapacity: glue.MaxCapacity.DPU_1,
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

    test('Overridden Python version should be 2', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          Name: glue.JobType.PYTHON_SHELL,
          ScriptLocation: 's3://bucketname/script',
          PythonVersion: glue.PythonVersion.TWO,
        },
      });
    });

    test('Overridden Max Capacity should be 1', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxCapacity: 1,
      });
    });

  });

  describe('Create Python Shell Job with optional properties', () => {

    beforeEach(() => {
      job = new glue.PythonShellJob(stack, 'PythonShellJob', {
        jobName: 'PythonShellJobCustomName',
        description: 'This is a description',
        pythonVersion: glue.PythonVersion.TWO,
        maxCapacity: glue.MaxCapacity.DPU_1,
        role,
        script,
        glueVersion: glue.GlueVersion.V2_0,
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
        Name: 'PythonShellJobCustomName',
        Description: 'This is a description',
      });
    });

    test('Overriden Glue Version should be 2.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '2.0',
      });
    });

    test('Verify Default Arguemnts', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'python',
        }),
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

    test('Overridden Python version should be 2', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          Name: glue.JobType.PYTHON_SHELL,
          ScriptLocation: 's3://bucketname/script',
          PythonVersion: glue.PythonVersion.TWO,
        },
      });
    });

    test('Overridden Max Capacity should be 1', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxCapacity: 1,
      });
    });
  });

  describe('Create Python Shell Job with job run queuing enabled', () => {

    beforeEach(() => {
      job = new glue.PythonShellJob(stack, 'PythonShellJob', {
        jobName: 'PythonShellJobCustomName',
        description: 'This is a description',
        pythonVersion: glue.PythonVersion.TWO,
        maxCapacity: glue.MaxCapacity.DPU_1,
        role,
        script,
        glueVersion: glue.GlueVersion.V2_0,
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
        Name: 'PythonShellJobCustomName',
        Description: 'This is a description',
      });
    });

    test('Overriden Glue Version should be 2.0', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        GlueVersion: '2.0',
      });
    });

    test('Verify Default Arguemnts', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        DefaultArguments: Match.objectLike({
          '--enable-metrics': '',
          '--enable-observability-metrics': 'true',
          '--job-language': 'python',
        }),
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

    test('Overridden Python version should be 2', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          Name: glue.JobType.PYTHON_SHELL,
          ScriptLocation: 's3://bucketname/script',
          PythonVersion: glue.PythonVersion.TWO,
        },
      });
    });

    test('Overridden Max Capacity should be 1', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        MaxCapacity: 1,
      });
    });
  });
});
