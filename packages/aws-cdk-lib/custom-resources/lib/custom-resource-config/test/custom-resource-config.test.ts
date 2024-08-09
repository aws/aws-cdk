import { Capture, Template, Match } from '../../../../assertions';
import * as logs from '../../../../aws-logs';
import * as s3 from '../../../../aws-s3';
import * as s3deploy from '../../../../aws-s3-deployment';
import * as cdk from '../../../../core';
import { CustomResourceConfig } from '../custom-resource-config';

describe('when logging is undefined', () => {

  test('when CustomResourceConfig.addLogRetentionLifetime is called, singleton-backed custom resource has new logGroup with retention period specified', () => {
    const set_log_retention = logs.RetentionDays.TEN_YEARS;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(set_log_retention);
    const stack = new cdk.Stack(app);

    let websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployNone', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogGroup: {
          Ref: Match.stringLikeRegexp('CustomCDKBucketDeployment'),
        },
      },
    });
    template.resourceCountIs('AWS::Logs::LogGroup', 1);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: set_log_retention,
    });
  });

  test('when CustomResourceConfig.addLogRetentionLifetime is called with extra logGroup, extra logGroup remain unmodified by CustomResourceConfig', () => {
    const set_log_retention = logs.RetentionDays.TEN_YEARS;
    const default_log_group_retention = logs.RetentionDays.TWO_YEARS;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(set_log_retention);
    const stack = new cdk.Stack(app);

    const ignored = new logs.LogGroup(stack, 'ignored', {});
    let websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployNone', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Logs::LogGroup', 2);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: set_log_retention,
    });
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: default_log_group_retention,
    });
  });

});

describe('when logRetention is specified', () => {
  test('when CustomResourceConfig.addLogRetentionLifetime is called, singleton-backed custom resource logRetention period modified', () => {
    const set_log_retention = logs.RetentionDays.TEN_YEARS;
    const locally_set_log_retention = logs.RetentionDays.ONE_WEEK;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(set_log_retention);
    const stack = new cdk.Stack(app);

    const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployLogRetention', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logRetention: locally_set_log_retention,
    });
    const template = Template.fromStack(stack);

    const captureRetentionInDays = new Capture();
    template.hasResourceProperties('Custom::LogRetention', {
      RetentionInDays: captureRetentionInDays,
    });
    expect(captureRetentionInDays.asNumber()).toEqual(set_log_retention);
    expect(captureRetentionInDays.asNumber()).not.toEqual(
      locally_set_log_retention,
    );
    template.resourceCountIs('AWS::Logs::LogGroup', 1);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: set_log_retention,
    });
  });

});

describe('when logGroup is specified', () => {
  test('when CustomResourceConfig.addLogRetentionLifetime is called, singleton-backed custom resource logGroup period modified', () => {
    const set_log_retention = logs.RetentionDays.TEN_YEARS;
    const locally_set_log_retention = logs.RetentionDays.ONE_WEEK;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(set_log_retention);
    const stack = new cdk.Stack(app);

    const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployLogGroup', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logGroup: new logs.LogGroup(stack, 'LogGroup', {
        retention: locally_set_log_retention,
      }),
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Logs::LogGroup', 1);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: set_log_retention,
    });
  });

  test('when duplicate custom resource with logGroup, only one singleton-Lambda associated logGroup is modified, and the other ignored', () => {
    const set_log_retention = logs.RetentionDays.TEN_YEARS;
    const locally_set_log_retention = logs.RetentionDays.ONE_WEEK;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(set_log_retention);
    const stack = new cdk.Stack(app);

    const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployLogGroup1', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logGroup: new logs.LogGroup(stack, 'LogGroup1', {
        retention: locally_set_log_retention,
      }),
    });
    new s3deploy.BucketDeployment(stack, 's3deployLogGroup2', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logGroup: new logs.LogGroup(stack, 'LogGroup2', {
        retention: locally_set_log_retention,
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogGroup: {
          Ref: Match.stringLikeRegexp('LogGroup1'),
        },
      },
    });
    template.resourceCountIs('AWS::Logs::LogGroup', 2);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: set_log_retention,
    });
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: locally_set_log_retention,
    });
  });

});
