import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

describe('lambda + vpc', () => {
  describe('lambda in vpc', () => {
    let app: cdk.App;
    let stack: cdk.Stack;
    let vpc: ec2.Vpc;
    let fn: lambda.Function;

    beforeEach(() => {
      // GIVEN
      app = new cdk.App();
      stack = new cdk.Stack(app, 'stack');
      vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      fn = new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        vpc: vpc,
        allowAllOutbound: false,
      });
    });

    test('has subnet and securitygroup', () => {
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
          SecurityGroupIds: [
            { 'Fn::GetAtt': ['LambdaSecurityGroupE74659A1', 'GroupId'] },
          ],
          SubnetIds: [
            { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
            { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
          ],
        },
      });
    });

    testDeprecated('has securitygroup that is passed in props', () => {
      // WHEN
      new lambda.Function(stack, 'LambdaWithCustomSG', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        vpc,
        securityGroup: new ec2.SecurityGroup(stack, 'CustomSecurityGroupX', { vpc }),
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
          SecurityGroupIds: [
            { 'Fn::GetAtt': ['CustomSecurityGroupX6C7F3A78', 'GroupId'] },
          ],
          SubnetIds: [
            { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
            { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
          ],
        },
      });
    });

    test('has all the securitygroups that are passed as a list of SG in props', () => {
      // WHEN
      new lambda.Function(stack, 'LambdaWithCustomSGList', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        vpc,
        securityGroups: [
          new ec2.SecurityGroup(stack, 'CustomSecurityGroupA', { vpc }),
          new ec2.SecurityGroup(stack, 'CustomSecurityGroupB', { vpc }),
        ],
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
          SecurityGroupIds: [
            { 'Fn::GetAtt': ['CustomSecurityGroupA267F62DE', 'GroupId'] },
            { 'Fn::GetAtt': ['CustomSecurityGroupB1118D0D5', 'GroupId'] },
          ],
          SubnetIds: [
            { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
            { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
          ],
        },
      });
    });

    testDeprecated('fails if both of securityGroup and securityGroups are passed in props at once', () => {
      // THEN
      expect(() => {
        new lambda.Function(stack, 'LambdaWithWrongProps', {
          code: new lambda.InlineCode('foo'),
          handler: 'index.handler',
          runtime: lambda.Runtime.NODEJS_14_X,
          vpc,
          securityGroup: new ec2.SecurityGroup(stack, 'CustomSecurityGroupB', { vpc }),
          securityGroups: [
            new ec2.SecurityGroup(stack, 'CustomSecurityGroupC', { vpc }),
            new ec2.SecurityGroup(stack, 'CustomSecurityGroupD', { vpc }),
          ],
        });
      }).toThrow(/Only one of the function props, securityGroup or securityGroups, is allowed/);
    });

    test('participates in Connections objects', () => {
      // GIVEN
      const securityGroup = new ec2.SecurityGroup(stack, 'SomeSecurityGroup', { vpc });
      const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroups: [securityGroup] }));

      // WHEN
      fn.connections.allowTo(somethingConnectable, ec2.Port.allTcp(), 'Lambda can call connectable');

      // THEN: Lambda can connect to SomeSecurityGroup
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
        GroupId: { 'Fn::GetAtt': ['LambdaSecurityGroupE74659A1', 'GroupId'] },
        IpProtocol: 'tcp',
        Description: 'Lambda can call connectable',
        DestinationSecurityGroupId: { 'Fn::GetAtt': ['SomeSecurityGroupEF219AD6', 'GroupId'] },
        FromPort: 0,
        ToPort: 65535,
      });

      // THEN: SomeSecurityGroup accepts connections from Lambda
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        IpProtocol: 'tcp',
        Description: 'Lambda can call connectable',
        FromPort: 0,
        GroupId: { 'Fn::GetAtt': ['SomeSecurityGroupEF219AD6', 'GroupId'] },
        SourceSecurityGroupId: { 'Fn::GetAtt': ['LambdaSecurityGroupE74659A1', 'GroupId'] },
        ToPort: 65535,
      });
    });

    test('can still make Connections after export/import', () => {
      // GIVEN
      const stack2 = new cdk.Stack(app, 'stack2');
      const securityGroup = new ec2.SecurityGroup(stack2, 'SomeSecurityGroup', { vpc });
      const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroups: [securityGroup] }));

      // WHEN
      somethingConnectable.connections.allowFrom(fn.connections, ec2.Port.allTcp(), 'Lambda can call connectable');

      // THEN: SomeSecurityGroup accepts connections from Lambda
      Template.fromStack(stack2).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
        GroupId: {
          'Fn::ImportValue': 'stack:ExportsOutputFnGetAttLambdaSecurityGroupE74659A1GroupId8F3EC6F1',
        },
        IpProtocol: 'tcp',
        Description: 'Lambda can call connectable',
        DestinationSecurityGroupId: {
          'Fn::GetAtt': [
            'SomeSecurityGroupEF219AD6',
            'GroupId',
          ],
        },
        FromPort: 0,
        ToPort: 65535,
      });

      // THEN: Lambda can connect to SomeSecurityGroup
      Template.fromStack(stack2).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        IpProtocol: 'tcp',
        Description: 'Lambda can call connectable',
        FromPort: 0,
        GroupId: {
          'Fn::GetAtt': [
            'SomeSecurityGroupEF219AD6',
            'GroupId',
          ],
        },
        SourceSecurityGroupId: {
          'Fn::ImportValue': 'stack:ExportsOutputFnGetAttLambdaSecurityGroupE74659A1GroupId8F3EC6F1',
        },
        ToPort: 65535,
      });
    });
  });

  test('lambda without VPC throws Error upon accessing connections', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const lambdaFn = new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    // WHEN
    expect(() => {
      lambdaFn.connections.allowToAnyIpv4(ec2.Port.allTcp(), 'Reach for the world Lambda!');
    }).toThrow();
  });

  test('can pick public subnet for Lambda', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new lambda.Function(stack, 'PublicLambda', {
      allowPublicSubnet: true,
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      VpcConfig: {
        SecurityGroupIds: [
          { 'Fn::GetAtt': ['PublicLambdaSecurityGroup61D896FD', 'GroupId'] },
        ],
        SubnetIds: [
          { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
          { Ref: 'VPCPublicSubnet2Subnet74179F39' },
        ],
      },
    });
  });

  test('can pick private subnet for Lambda', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new lambda.Function(stack, 'PrivateLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT },
    });

    // THEN

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      VpcConfig: {
        SecurityGroupIds: [
          { 'Fn::GetAtt': ['PrivateLambdaSecurityGroupF53C8342', 'GroupId'] },
        ],
        SubnetIds: [
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ],
      },
    });
  });

  test('can pick isolated subnet for Lambda', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [
        {
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // WHEN
    new lambda.Function(stack, 'IsolatedLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });

    // THEN

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      VpcConfig: {
        SecurityGroupIds: [
          { 'Fn::GetAtt': ['IsolatedLambdaSecurityGroupCE25B6A9', 'GroupId'] },
        ],
        SubnetIds: [
          { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
          { Ref: 'VPCIsolatedSubnet2Subnet4B1C8CAA' },
        ],
      },
    });
  });

  test('picking public subnet type is not allowed if not overriding allowPublicSubnet', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
        {
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // WHEN
    expect(() => {
      new lambda.Function(stack, 'PublicLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      });
    }).toThrow(/Lambda Functions in a public subnet/);
  });
});

class SomethingConnectable implements ec2.IConnectable {
  constructor(public readonly connections: ec2.Connections) {
  }
}
