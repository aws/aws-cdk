import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as sagemaker from '../lib';

describe('When instantiating SageMaker Model', () => {
  test('with more than 15 containers, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const testRepo = ecr.Repository.fromRepositoryName(stack, 'testRepo', '123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel');
    const containers = [{ image: sagemaker.ContainerImage.fromEcrRepository(testRepo) }];
    for (let i = 0; i < 15; i++) {
      const containerDefinition = {
        image: sagemaker.ContainerImage.fromEcrRepository(testRepo),
      };
      containers.push(containerDefinition);
    }

    // WHEN
    const when = () => new sagemaker.Model(stack, 'Model', { containers });

    // THEN
    expect(when).toThrow(/Cannot have more than 15 containers in inference pipeline/);
  });

  test('with no containers, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () => new sagemaker.Model(stack, 'Model');

    // THEN
    expect(when).toThrow(/Must configure at least 1 container for model/);
  });

  test('with a ContainerImage implementation which adds constructs of its own, the new constructs are present', () => {
    // GIVEN
    const stack = new cdk.Stack();
    class ConstructCreatingContainerImage extends sagemaker.ContainerImage {
      public bind(scope: constructs.Construct, _model: sagemaker.Model): sagemaker.ContainerImageConfig {
        new iam.User(scope, 'User', {
          userName: 'ExtraConstructUserName',
        });
        return {
          imageName: 'anything',
        };
      }
    }

    // WHEN
    new sagemaker.Model(stack, 'Model', {
      containers: [{
        image: new ConstructCreatingContainerImage(),
      }],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::SageMaker::Model', {});
    template.hasResourceProperties('AWS::IAM::User', {
      UserName: 'ExtraConstructUserName',
    });
  });

  describe('with a VPC', () => {
    test('and security groups, no security group is created', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'testVPC');

      // WHEN
      new sagemaker.Model(stack, 'Model', {
        containers: [{ image: sagemaker.ContainerImage.fromEcrRepository(new ecr.Repository(stack, 'Repo')) }],
        vpc,
        securityGroups: [new ec2.SecurityGroup(stack, 'SG', { vpc })],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', Match.not({
        GroupDescription: 'Default/Model/SecurityGroup',
      }));
    });

    test('but no security groups, a security group is created', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new sagemaker.Model(stack, 'Model', {
        containers: [{ image: sagemaker.ContainerImage.fromEcrRepository(new ecr.Repository(stack, 'Repo')) }],
        vpc: new ec2.Vpc(stack, 'testVPC'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/Model/SecurityGroup',
      });
    });

    test('and both security groups and allowAllOutbound are specified, an exception is thrown', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'testVPC');

      // WHEN
      const when = () =>
        new sagemaker.Model(stack, 'Model', {
          containers: [{ image: sagemaker.ContainerImage.fromEcrRepository(new ecr.Repository(stack, 'Repo')) }],
          vpc,
          securityGroups: [new ec2.SecurityGroup(stack, 'SG', { vpc })],
          allowAllOutbound: false,
        });

      // THEN
      expect(when).toThrow(/Configure 'allowAllOutbound' directly on the supplied SecurityGroups/);
    });
  });

  describe('without a VPC', () => {
    test('but security groups are specified, an exception is thrown', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpcNotSpecified = new ec2.Vpc(stack, 'VPC');

      // WHEN
      const when = () =>
        new sagemaker.Model(stack, 'Model', {
          containers: [{ image: sagemaker.ContainerImage.fromEcrRepository(new ecr.Repository(stack, 'Repo')) }],
          securityGroups: [new ec2.SecurityGroup(stack, 'SG', { vpc: vpcNotSpecified })],
        });

      // THEN
      expect(when).toThrow(/Cannot configure 'securityGroups' or 'allowAllOutbound' without configuring a VPC/);
    });

    test('but allowAllOutbound is specified, an exception is thrown', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const when = () =>
        new sagemaker.Model(stack, 'Model', {
          containers: [{ image: sagemaker.ContainerImage.fromEcrRepository(new ecr.Repository(stack, 'Repo')) }],
          allowAllOutbound: false,
        });

      // THEN
      expect(when).toThrow(/Cannot configure 'securityGroups' or 'allowAllOutbound' without configuring a VPC/);
    });
  });
});

describe('When accessing Connections object', () => {
  test('from a model with no VPC, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const modelWithoutVpc = new sagemaker.Model(stack, 'Model', {
      containers: [{ image: sagemaker.ContainerImage.fromEcrRepository(new ecr.Repository(stack, 'Repo')) }],
    });

    // WHEN
    const when = () => modelWithoutVpc.connections;

    // THEN
    expect(when).toThrow(/Cannot manage network access without configuring a VPC/);
  });

  test('from an imported model with no security groups specified, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const importedModel = sagemaker.Model.fromModelAttributes(stack, 'Model', {
      modelName: 'MyModel',
    });

    // WHEN
    const when = () => importedModel.connections;

    // THEN
    expect(when).toThrow(/Cannot manage network access without configuring a VPC/);
  });
});

test('When adding security group after model instantiation, it is reflected in VpcConfig of Model', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'testVPC');
  const model = new sagemaker.Model(stack, 'Model', {
    containers: [{ image: sagemaker.ContainerImage.fromEcrRepository(new ecr.Repository(stack, 'Repo')) }],
    vpc,
  });

  // WHEN
  model.connections.addSecurityGroup(new ec2.SecurityGroup(stack, 'AdditionalGroup', { vpc }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SageMaker::Model', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'ModelSecurityGroup2A7C9E10',
            'GroupId',
          ],
        },
        {
          'Fn::GetAtt': [
            'AdditionalGroup4973CFAA',
            'GroupId',
          ],
        },
      ],
    },
  });
});

test('When allowing traffic from an imported model with a security group, an S3 egress rule should be present', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const model = sagemaker.Model.fromModelAttributes(stack, 'Model', {
    modelName: 'MyModel',
    securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
      allowAllOutbound: false,
    })],
  });

  // WHEN
  model.connections.allowToAnyIpv4(ec2.Port.tcp(443));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
    GroupId: 'sg-123456789',
  });
});

test('When importing a model by name, the ARN is constructed correctly', () => {
  // GIVEN
  const stack = new cdk.Stack(undefined, undefined, {
    env:
      {
        region: 'us-west-2',
        account: '123456789012',
      },
  });

  // WHEN
  const model = sagemaker.Model.fromModelName(stack, 'Model', 'my-name');

  // THEN
  expect(model.modelArn).toMatch(/arn:.+:sagemaker:us-west-2:123456789012:model\/my-name/);
});
