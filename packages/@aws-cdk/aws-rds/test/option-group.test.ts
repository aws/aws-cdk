import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { DatabaseInstanceEngine, OptionGroup, OracleEngineVersion } from '../lib';

describe('option group', () => {
  test('create an option group', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe2({
        version: OracleEngineVersion.VER_12_1,
      }),
      configurations: [
        {
          name: 'XMLDB',
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
      EngineName: 'oracle-se2',
      MajorEngineVersion: '12.1',
      OptionConfigurations: [
        {
          OptionName: 'XMLDB',
        },
      ],
    });
  });

  test('option group with new security group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const optionGroup = new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe2({
        version: OracleEngineVersion.VER_12_1,
      }),
      configurations: [
        {
          name: 'OEM',
          port: 1158,
          vpc,
        },
      ],
    });
    optionGroup.optionConnections.OEM.connections.allowDefaultPortFromAnyIpv4();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
      OptionConfigurations: [
        {
          OptionName: 'OEM',
          Port: 1158,
          VpcSecurityGroupMemberships: [
            {
              'Fn::GetAtt': [
                'OptionsSecurityGroupOEM6C9FE79D',
                'GroupId',
              ],
            },
          ],
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Security group for OEM option',
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'from 0.0.0.0/0:1158',
          FromPort: 1158,
          IpProtocol: 'tcp',
          ToPort: 1158,
        },
      ],
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });
  });

  test('option group with existing security group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const securityGroup = new ec2.SecurityGroup(stack, 'CustomSecurityGroup', { vpc });
    new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe2({
        version: OracleEngineVersion.VER_12_1,
      }),
      configurations: [
        {
          name: 'OEM',
          port: 1158,
          vpc,
          securityGroups: [securityGroup],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
      OptionConfigurations: [
        {
          OptionName: 'OEM',
          Port: 1158,
          VpcSecurityGroupMemberships: [
            {
              'Fn::GetAtt': [
                'CustomSecurityGroupE5E500E5',
                'GroupId',
              ],
            },
          ],
        },
      ],
    });
  });

  test('throws when using an option with port and no vpc', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe2({
        version: OracleEngineVersion.VER_12_1,
      }),
      configurations: [
        {
          name: 'OEM',
          port: 1158,
        },
      ],
    })).toThrow(/`port`.*`vpc`/);
  });
});
