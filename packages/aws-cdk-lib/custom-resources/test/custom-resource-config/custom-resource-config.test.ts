import { Template, Match } from '../../../assertions';
import * as logs from '../../../aws-logs';
import * as s3 from '../../../aws-s3';
import * as s3deploy from '../../../aws-s3-deployment';
import * as cdk from '../../../core';
import { CustomResourceConfig } from '../../lib/custom-resource-config/custom-resource-config';

describe('when logging is undefined', () => {
  test('when CustomResourceConfig.addLogRetentionLifetime is called, singleton-backed custom resource has new logGroup with retention period specified', () => {
    const customResourceLogRetention = logs.RetentionDays.TEN_YEARS;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(customResourceLogRetention);
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
      RetentionInDays: customResourceLogRetention,
    });
  });

  test('addLogRetentionLifetime only modifies custom resource log groups', () => {
    const customResourceLogRetention = logs.RetentionDays.TEN_YEARS;
    const nonCustomResourceLogRetention = logs.RetentionDays.TWO_YEARS;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(customResourceLogRetention);
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
      RetentionInDays: customResourceLogRetention,
    });
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: nonCustomResourceLogRetention,
    });
  });
});

describe('when logRetention is specified', () => {
  test('addLogRetentionLifetime overrides log retention', () => {
    const customResourceLogRetention = logs.RetentionDays.TEN_YEARS;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(customResourceLogRetention);
    const stack = new cdk.Stack(app);

    const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployLogRetention', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logRetention: logs.RetentionDays.ONE_WEEK,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::LogRetention', {
      RetentionInDays: customResourceLogRetention,
    });
    template.resourceCountIs('AWS::Logs::LogGroup', 1);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: customResourceLogRetention,
    });
  });
});

describe('when logGroup is specified', () => {
  test('when CustomResourceConfig.addLogRetentionLifetime is called, singleton-backed custom resource logGroup period modified', () => {
    const customResourceLogRetention = logs.RetentionDays.TEN_YEARS;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(customResourceLogRetention);
    const stack = new cdk.Stack(app);

    const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployLogGroup', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logGroup: new logs.LogGroup(stack, 'LogGroup', {
        retention: logs.RetentionDays.ONE_WEEK,
      }),
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Logs::LogGroup', 1);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: customResourceLogRetention,
    });
  });

  test('when duplicate custom resource with logGroup, only one singleton-Lambda associated logGroup is modified, and the other ignored', () => {
    const customResourceLogRetention = logs.RetentionDays.TEN_YEARS;
    const app = new cdk.App();
    CustomResourceConfig.of(app).addLogRetentionLifetime(customResourceLogRetention);
    const stack = new cdk.Stack(app);

    const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployLogGroup1', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logGroup: new logs.LogGroup(stack, 'LogGroup1', {
        retention: logs.RetentionDays.ONE_WEEK,
      }),
    });
    new s3deploy.BucketDeployment(stack, 's3deployLogGroup2', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
      logGroup: new logs.LogGroup(stack, 'LogGroup2', {
        retention: logs.RetentionDays.ONE_WEEK,
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
      RetentionInDays: customResourceLogRetention,
    });
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.ONE_WEEK,
    });
  });
});


