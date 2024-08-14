import { Template } from '../../../assertions';
import * as logs from '../../../aws-logs';
import * as s3 from '../../../aws-s3';
import * as s3deploy from '../../../aws-s3-deployment';
import * as cdk from '../../../core';
import { CustomResourceConfig } from '../../lib/custom-resource-config/custom-resource-config';

describe('when a singleton-backed custom resource does not have logging defined', () => {
  test('addLogRetentionLifetime creates a new log group with the correct retention period if one does not already exist', () => {
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
          Ref: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756ClogGroupD6937F08',
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

describe('when a singleton-backed custom resource logRetention is specified', () => {
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

describe('when a singleton-backed custom resource log group is specified', () => {
  test('addLogRetentionLifetime modifies the retention period of a singleton-backed custom resource log group.', () => {
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

  test('addLogRetentionLifetime only modifies the singleton-backed custom resource log group', () => {
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
          Ref: 'LogGroup106AAD846',
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

test('addLogRetentionLifetime modifies the retention period of the custom resources in two top-level stacks', () => {
  const customResourceLogRetention = logs.RetentionDays.TEN_YEARS;
  const app = new cdk.App();
  CustomResourceConfig.of(app).addLogRetentionLifetime(customResourceLogRetention);

  const stackA = new cdk.Stack(app, 'stackA');
  let websiteBucketA = new s3.Bucket(stackA, 'WebsiteBucketA', {});
  new s3deploy.BucketDeployment(stackA, 's3deployA', {
    sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
    destinationBucket: websiteBucketA,
    logRetention: logs.RetentionDays.ONE_DAY,
  });

  const stackB = new cdk.Stack(app, 'stackB');
  let websiteBucketB = new s3.Bucket(stackB, 'WebsiteBucketA', {});
  new s3deploy.BucketDeployment(stackB, 's3deployB', {
    sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
    destinationBucket: websiteBucketB,
    logRetention: logs.RetentionDays.ONE_DAY,
  });

  const templateA = Template.fromStack(stackA);
  templateA.hasResourceProperties('Custom::LogRetention', {
    RetentionInDays: customResourceLogRetention,
  });
  templateA.resourceCountIs('AWS::Logs::LogGroup', 1);
  templateA.hasResourceProperties('AWS::Logs::LogGroup', {
    RetentionInDays: customResourceLogRetention,
  });

  const templateB = Template.fromStack(stackB);
  templateB.hasResourceProperties('Custom::LogRetention', {
    RetentionInDays: customResourceLogRetention,
  });
  templateB.resourceCountIs('AWS::Logs::LogGroup', 1);
  templateB.hasResourceProperties('AWS::Logs::LogGroup', {
    RetentionInDays: customResourceLogRetention,
  });
});

test('addLogRetentionLifetime modifies the retention period of the custom resources in the nested stack', () => {
  const customResourceLogRetention = logs.RetentionDays.TEN_YEARS;
  const app = new cdk.App();
  CustomResourceConfig.of(app).addLogRetentionLifetime(customResourceLogRetention);
  const stack = new cdk.Stack(app, 'Stack');

  const nestedStackA = new cdk.NestedStack(stack, 'NestedStackA');
  let websiteBucketA = new s3.Bucket(nestedStackA, 'WebsiteBucketA', {});
  new s3deploy.BucketDeployment(nestedStackA, 's3deployA', {
    sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
    destinationBucket: websiteBucketA,
    logRetention: logs.RetentionDays.ONE_DAY,
  });

  const nestedStackB = new cdk.NestedStack(stack, 'NestedStackB');
  let websiteBucketB = new s3.Bucket(nestedStackB, 'WebsiteBucketB', {});
  new s3deploy.BucketDeployment(nestedStackB, 's3deployB', {
    sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
    destinationBucket: websiteBucketB,
    logRetention: logs.RetentionDays.ONE_DAY,
  });

  const templateA = Template.fromStack(nestedStackA);
  templateA.hasResourceProperties('Custom::LogRetention', {
    RetentionInDays: customResourceLogRetention,
  });
  templateA.resourceCountIs('AWS::Logs::LogGroup', 1);
  templateA.hasResourceProperties('AWS::Logs::LogGroup', {
    RetentionInDays: customResourceLogRetention,
  });

  const templateB = Template.fromStack(nestedStackB);
  templateB.hasResourceProperties('Custom::LogRetention', {
    RetentionInDays: customResourceLogRetention,
  });
  templateB.resourceCountIs('AWS::Logs::LogGroup', 1);
  templateB.hasResourceProperties('AWS::Logs::LogGroup', {
    RetentionInDays: customResourceLogRetention,
  });
});
