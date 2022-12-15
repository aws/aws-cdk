import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { CfnParameter, Fn, RemovalPolicy, Stack } from '@aws-cdk/core';
import { LogGroup, RetentionDays } from '../lib';

describe('log group', () => {
  test('set kms key when provided', () => {
    // GIVEN
    const stack = new Stack();
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      encryptionKey,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
    });
  });

  test('fixed retention', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: RetentionDays.ONE_WEEK,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 7,
    });
  });

  test('default retention', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 731,
    });
  });

  test('infinite retention/dont delete log group by default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: RetentionDays.INFINITE,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        LogGroupF5B46931: {
          Type: 'AWS::Logs::LogGroup',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });
  });

  test('infinite retention via legacy method', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      // Don't know why TypeScript doesn't complain about passing Infinity to
      // something where an enum is expected, but better keep this behavior for
      // existing clients.
      retention: Infinity,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        LogGroupF5B46931: {
          Type: 'AWS::Logs::LogGroup',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });
  });

  test('unresolved retention', () => {
    // GIVEN
    const stack = new Stack();
    const parameter = new CfnParameter(stack, 'RetentionInDays', { default: 30, type: 'Number' });

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: parameter.valueAsNumber,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: {
        Ref: 'RetentionInDays',
      },
    });
  });

  test('will delete log group if asked to', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: Infinity,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        LogGroupF5B46931: {
          Type: 'AWS::Logs::LogGroup',
          DeletionPolicy: 'Delete',
          UpdateReplacePolicy: 'Delete',
        },
      },
    });
  });

  test('import from ARN, same region', () => {
    // GIVEN
    const stack2 = new Stack();

    // WHEN
    const imported = LogGroup.fromLogGroupArn(stack2, 'lg', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group');
    imported.addStream('MakeMeAStream');

    // THEN
    expect(imported.logGroupName).toEqual('my-log-group');
    expect(imported.logGroupArn).toEqual('arn:aws:logs:us-east-1:123456789012:log-group:my-log-group:*');
    Template.fromStack(stack2).hasResourceProperties('AWS::Logs::LogStream', {
      LogGroupName: 'my-log-group',
    });
  });

  test('import from ARN, different region', () => {
    // GIVEN
    const stack = new Stack();
    const importRegion = 'asgard-1';

    // WHEN
    const imported = LogGroup.fromLogGroupArn(stack, 'lg',
      `arn:aws:logs:${importRegion}:123456789012:log-group:my-log-group`);
    imported.addStream('MakeMeAStream');

    // THEN
    expect(imported.logGroupName).toEqual('my-log-group');
    expect(imported.logGroupArn).toEqual(`arn:aws:logs:${importRegion}:123456789012:log-group:my-log-group:*`);
    expect(imported.env.region).not.toEqual(stack.region);
    expect(imported.env.region).toEqual(importRegion);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogStream', {
      LogGroupName: 'my-log-group',
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
  });

  test('import from name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imported = LogGroup.fromLogGroupName(stack, 'lg', 'my-log-group');
    imported.addStream('MakeMeAStream');

    // THEN
    expect(imported.logGroupName).toEqual('my-log-group');
    expect(imported.logGroupArn).toMatch(/^arn:.+:logs:.+:.+:log-group:my-log-group:\*$/);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogStream', {
      LogGroupName: 'my-log-group',
    });
  });

  describe('loggroups imported by name have stream wildcard appended to grant ARN', () => void dataDrivenTests([
    // Regardless of whether the user put :* there already because of this bug, we
    // don't want to append it twice.
    '',
    ':*',
  ], (suffix: string) => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'Role');
    const imported = LogGroup.fromLogGroupName(stack, 'lg', `my-log-group${suffix}`);

    // WHEN
    imported.grantWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':logs:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':log-group:my-log-group:*',
              ]],
            },
          },
        ],
      },
    });

    expect(imported.logGroupName).toEqual('my-log-group');
  }));

  describe('loggroups imported by ARN have stream wildcard appended to grant ARN', () => void dataDrivenTests([
    // Regardless of whether the user put :* there already because of this bug, we
    // don't want to append it twice.
    '',
    ':*',
  ], (suffix: string) => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'Role');
    const imported = LogGroup.fromLogGroupArn(stack, 'lg', `arn:aws:logs:us-west-1:123456789012:log-group:my-log-group${suffix}`);

    // WHEN
    imported.grantWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: 'arn:aws:logs:us-west-1:123456789012:log-group:my-log-group:*',
          },
        ],
      },
    });

    expect(imported.logGroupName).toEqual('my-log-group');
  }));

  test('extractMetric', () => {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    const metric = lg.extractMetric('$.myField', 'MyService', 'Field');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      FilterPattern: '{ $.myField = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
      MetricTransformations: [
        {
          MetricName: 'Field',
          MetricNamespace: 'MyService',
          MetricValue: '$.myField',
        },
      ],
    });

    expect(metric.namespace).toEqual('MyService');
    expect(metric.metricName).toEqual('Field');
  });

  test('extractMetric allows passing in namespaces with "/"', () => {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    const metric = lg.extractMetric('$.myField', 'MyNamespace/MyService', 'Field');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      FilterPattern: '{ $.myField = "*" }',
      MetricTransformations: [
        {
          MetricName: 'Field',
          MetricNamespace: 'MyNamespace/MyService',
          MetricValue: '$.myField',
        },
      ],
    });

    expect(metric.namespace).toEqual('MyNamespace/MyService');
    expect(metric.metricName).toEqual('Field');
  });

  test('grant write', () => {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');
    const user = new iam.User(stack, 'User');

    // WHEN
    lg.grantWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grant read', () => {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');
    const user = new iam.User(stack, 'User');

    // WHEN
    lg.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['logs:FilterLogEvents', 'logs:GetLogEvents', 'logs:GetLogGroupFields', 'logs:DescribeLogGroups', 'logs:DescribeLogStreams'],
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grant to service principal', () => {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');
    const sp = new iam.ServicePrincipal('es.amazonaws.com');

    // WHEN
    lg.grantWrite(sp);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          [
            '{"Statement":[{"Action":["logs:CreateLogStream","logs:PutLogEvents"],"Effect":"Allow","Principal":{"Service":"es.amazonaws.com"},"Resource":"',
            {
              'Fn::GetAtt': [
                'LogGroupF5B46931',
                'Arn',
              ],
            },
            '"}],"Version":"2012-10-17"}',
          ],
        ],
      },
      PolicyName: 'LogGroupPolicy643B329C',
    });
  });

  test('when added to log groups, IAM users are converted into account IDs in the resource policy', () => {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    lg.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['logs:PutLogEvents'],
      principals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:user/user-name')],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
      PolicyDocument: '{"Statement":[{"Action":"logs:PutLogEvents","Effect":"Allow","Principal":{"AWS":"123456789012"},"Resource":"*"}],"Version":"2012-10-17"}',
      PolicyName: 'LogGroupPolicy643B329C',
    });
  });

  test('imported values are treated as if they are ARNs and converted to account IDs via CFN pseudo parameters', () => {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    lg.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['logs:PutLogEvents'],
      principals: [iam.Role.fromRoleArn(stack, 'Role', Fn.importValue('SomeRole'))],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          [
            '{\"Statement\":[{\"Action\":\"logs:PutLogEvents\",\"Effect\":\"Allow\",\"Principal\":{\"AWS\":\"',
            {
              'Fn::Select': [
                4,
                { 'Fn::Split': [':', { 'Fn::ImportValue': 'SomeRole' }] },
              ],
            },
            '\"},\"Resource\":\"*\"}],\"Version\":\"2012-10-17\"}',
          ],
        ],
      },
    });
  });

  test('correctly returns physical name of the log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'LogGroup', {
      logGroupName: 'my-log-group',
    });

    // THEN
    expect(logGroup.logGroupPhysicalName()).toEqual('my-log-group');
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: 'my-log-group',
    });
  });
});

function dataDrivenTests(cases: string[], body: (suffix: string) => void): void {
  for (let i = 0; i < cases.length; i++) {
    const args = cases[i]; // Need to capture inside loop for safe use inside closure.
    test(`case ${i + 1}`, () => {
      body(args);
    });
  }
}
