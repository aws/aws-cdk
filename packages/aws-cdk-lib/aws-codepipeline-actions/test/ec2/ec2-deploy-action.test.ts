import { Match, Template } from '../../../assertions';
import * as codepipeline from '../../../aws-codepipeline';
import * as ec2 from '../../../aws-ec2';
import * as elbv2 from '../../../aws-elasticloadbalancingv2';
import * as s3 from '../../../aws-s3';
import * as cdk from '../../../core';
import * as cpactions from '../../lib';

let stack: cdk.Stack;
let artifact: codepipeline.Artifact;
let bucket: s3.Bucket;
let source: cpactions.S3SourceAction;

beforeEach(() => {
  stack = new cdk.Stack();
  artifact = new codepipeline.Artifact('Artifact');
  bucket = new s3.Bucket(stack, 'PipelineBucket');
  source = new cpactions.S3SourceAction({ actionName: 'Source', output: artifact, bucket, bucketKey: 'key' });
});

describe('EC2 deploy action', () => {
  test.each([
    [cpactions.Ec2InstanceType.EC2, 'EC2'],
    [cpactions.Ec2InstanceType.SSM_MANAGED_NODE, 'SSM_MANAGED_NODE'],
  ])('can be created with instanceType %s with action deploy specifications, without load balancers', (instanceType, templateValue) => {
    // WHEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        preScript: 'scripts/pre-deploy.sh',
        postScript: 'scripts/post-deploy.sh',
      }),
    });
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Actions: [
            {
              Name: 'EC2',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'EC2',
              },
              Configuration: {
                InstanceTagKey: 'Target',
                InstanceTagValue: 'MyDeployTarget',
                InstanceType: templateValue,
                TargetDirectory: '/home/ec2-user/deploy',
                PreScript: 'scripts/pre-deploy.sh',
                PostScript: 'scripts/post-deploy.sh',
              },
            },
          ],
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Effect: 'Allow',
            Action: [
              'ec2:DescribeInstances',
              'elasticloadbalancing:DescribeTargetGroupAttributes',
              'elasticloadbalancing:DescribeTargetGroups',
              'elasticloadbalancing:DescribeTargetHealth',
              'ssm:CancelCommand',
              'ssm:DescribeInstanceInformation',
              'ssm:ListCommandInvocations',
            ],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Resource: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':logs:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':log-group:/aws/codepipeline/', { Ref: 'PipelineC660917D' }, ':*']] },
          },
          {
            Effect: 'Allow',
            Action: 'ssm:SendCommand',
            Resource: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ec2:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':instance/*']] },
            Condition: {
              StringEquals: { 'aws:ResourceTag/Target': 'MyDeployTarget' },
            },
          },
          {
            Effect: 'Allow',
            Action: 'ssm:SendCommand',
            Resource: [
              { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, '::document/AWS-RunPowerShellScript']] },
              { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, '::document/AWS-RunShellScript']] },
            ],
          },
        ]),
      },
    });
  });

  test.each([
    [cpactions.Ec2InstanceType.EC2, 'EC2'],
    [cpactions.Ec2InstanceType.SSM_MANAGED_NODE, 'SSM_MANAGED_NODE'],
  ])('can be created with instanceType %s with action deploy specifications, with load balancers', (instanceType, templateValue) => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const albTg = new elbv2.ApplicationTargetGroup(stack, 'ALB-TG', { vpc });
    const nlbTg = new elbv2.NetworkTargetGroup(stack, 'NLB-TG', { vpc, port: 80 });

    // WHEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      targetGroups: [albTg, nlbTg],
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
    });
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Actions: [
            {
              Name: 'EC2',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'EC2',
              },
              Configuration: {
                InstanceTagKey: 'Target',
                InstanceTagValue: 'MyDeployTarget',
                InstanceType: templateValue,
                TargetDirectory: '/home/ec2-user/deploy',
                TargetGroupNameList: {
                  'Fn::Join': ['', [
                    { 'Fn::GetAtt': ['ALBTG9414664F', 'TargetGroupName'] }, ',',
                    { 'Fn::GetAtt': ['NLBTG89886EBE', 'TargetGroupName'] },
                  ]],
                },
                PostScript: 'scripts/post-deploy.sh',
              },
            },
          ],
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Effect: 'Allow',
            Action: ['elasticloadbalancing:DeregisterTargets', 'elasticloadbalancing:RegisterTargets'],
            Resource: [{ Ref: 'ALBTG9414664F' }, { Ref: 'NLBTG89886EBE' }],
          },
        ]),
      },
    });
  });

  test('can be created without instanceTagValue', () => {
    // WHEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
    });
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Actions: [
            {
              Name: 'EC2',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'EC2',
              },
              Configuration: {
                InstanceType: 'EC2',
                InstanceTagKey: 'Target',
                TargetDirectory: '/home/ec2-user/deploy',
                PostScript: 'scripts/post-deploy.sh',
              },
            },
          ],
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Effect: 'Allow',
            Action: 'ssm:SendCommand',
            Resource: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ec2:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':instance/*']] },
            Condition: {
              Null: { 'aws:ResourceTag/Target': 'false' },
            },
          },
        ]),
      },
    });
  });

  test('can be created with targets maxBatch and maxError', () => {
    // WHEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxBatch: cpactions.Ec2MaxInstances.targets(2),
      maxError: cpactions.Ec2MaxInstances.targets(1),
    });
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Actions: [
            {
              Configuration: {
                MaxBatch: '2',
                MaxError: '1',
              },
            },
          ],
        },
      ],
    });
  });

  test('can be created with targets maxBatch and maxError (token)', () => {
    // GIVEN
    const maxBatchParam = new cdk.CfnParameter(stack, 'MaxBatchParam', { type: 'Number' });
    const maxErrorParam = new cdk.CfnParameter(stack, 'MaxErrorParam', { type: 'Number' });

    // WHEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxBatch: cpactions.Ec2MaxInstances.targets(maxBatchParam.valueAsNumber),
      maxError: cpactions.Ec2MaxInstances.targets(maxErrorParam.valueAsNumber),
    });
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Actions: [
            {
              Configuration: {
                MaxBatch: { Ref: 'MaxBatchParam' },
                MaxError: { Ref: 'MaxErrorParam' },
              },
            },
          ],
        },
      ],
    });
  });

  test('can be created with percentage maxBatch and maxError', () => {
    // WHEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxBatch: cpactions.Ec2MaxInstances.percentage(50),
      maxError: cpactions.Ec2MaxInstances.percentage(20),
    });
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Actions: [
            {
              Configuration: {
                MaxBatch: '50%',
                MaxError: '20%',
              },
            },
          ],
        },
      ],
    });
  });

  test('can be created with percentage maxBatch and maxError (token)', () => {
    // GIVEN
    const maxBatchParam = new cdk.CfnParameter(stack, 'MaxBatchParam', { type: 'Number' });
    const maxErrorParam = new cdk.CfnParameter(stack, 'MaxErrorParam', { type: 'Number' });

    // WHEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxBatch: cpactions.Ec2MaxInstances.percentage(maxBatchParam.valueAsNumber),
      maxError: cpactions.Ec2MaxInstances.percentage(maxErrorParam.valueAsNumber),
    });
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Actions: [
            {
              Configuration: {
                MaxBatch: { 'Fn::Join': ['', [{ Ref: 'MaxBatchParam' }, '%']] },
                MaxError: { 'Fn::Join': ['', [{ Ref: 'MaxErrorParam' }, '%']] },
              },
            },
          ],
        },
      ],
    });
  });

  test('throws when tag key is a token', () => {
    // GIVEN
    const tagKey = new cdk.CfnParameter(stack, 'TagKey');
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: tagKey.valueAsString,
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
    });

    // THEN
    expect(() => new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    })).toThrow('The instanceTagKey must be a non-empty concrete value.');
  });

  test('throws when targetDirectory is not an absolute path', () => {
    // GIVEN
    const action = new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: 'deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
    });

    // THEN
    expect(() => new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        { stageName: 'Source', actions: [source] },
        { stageName: 'Deploy', actions: [action] },
      ],
    })).toThrow('The targetDirectory must be an absolute path.');
  });

  test.each([[0], [1.5]])('throws when maxBatch is %s targets', (maxBatch) => {
    expect(() => new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxBatch: cpactions.Ec2MaxInstances.targets(maxBatch),
    })).toThrow(`targets must be a positive integer. got ${maxBatch}`);
  });

  test.each([[0], [1.5], [101]])('throws when maxBatch is %s percent', (maxBatch) => {
    expect(() => new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxBatch: cpactions.Ec2MaxInstances.percentage(maxBatch),
    })).toThrow(`percentage must be a positive integer between 1 and 100. got ${maxBatch}`);
  });

  test.each([[0], [1.5]])('throws when maxError is %s targets', (maxError) => {
    expect(() => new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxError: cpactions.Ec2MaxInstances.targets(maxError),
    })).toThrow(`targets must be a positive integer. got ${maxError}`);
  });

  test.each([[0], [1.5], [101]])('throws when maxError is %s percent', (maxError) => {
    expect(() => new cpactions.Ec2DeployAction({
      actionName: 'EC2',
      input: artifact,
      instanceType: cpactions.Ec2InstanceType.EC2,
      instanceTagKey: 'Target',
      instanceTagValue: 'MyDeployTarget',
      deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
        targetDirectory: '/home/ec2-user/deploy',
        postScript: 'scripts/post-deploy.sh',
      }),
      maxError: cpactions.Ec2MaxInstances.percentage(maxError),
    })).toThrow(`percentage must be a positive integer between 1 and 100. got ${maxError}`);
  });
});
