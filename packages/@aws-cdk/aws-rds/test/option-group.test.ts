import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { DatabaseInstanceEngine, OptionGroup, OracleEngineVersion, OracleLegacyEngineVersion } from '../lib';

nodeunitShim({
  'create an option group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe1({
        version: OracleLegacyEngineVersion.VER_11_2,
      }),
      configurations: [
        {
          name: 'XMLDB',
        },
      ],
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::OptionGroup', {
      EngineName: 'oracle-se1',
      MajorEngineVersion: '11.2',
      OptionGroupDescription: 'Option group for oracle-se1 11.2',
      OptionConfigurations: [
        {
          OptionName: 'XMLDB',
        },
      ],
    }));

    test.done();
  },

  'option group with new security group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const optionGroup = new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe({
        version: OracleLegacyEngineVersion.VER_11_2,
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
    expect(stack).to(haveResource('AWS::RDS::OptionGroup', {
      EngineName: 'oracle-se',
      MajorEngineVersion: '11.2',
      OptionGroupDescription: 'Option group for oracle-se 11.2',
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
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
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
    }));

    test.done();
  },

  'option group with existing security group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const securityGroup = new ec2.SecurityGroup(stack, 'CustomSecurityGroup', { vpc });
    new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe({
        version: OracleLegacyEngineVersion.VER_11_2,
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
    expect(stack).to(haveResource('AWS::RDS::OptionGroup', {
      EngineName: 'oracle-se',
      MajorEngineVersion: '11.2',
      OptionGroupDescription: 'Option group for oracle-se 11.2',
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
    }));

    test.done();
  },

  'throws when using an option with port and no vpc'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new OptionGroup(stack, 'Options', {
      engine: DatabaseInstanceEngine.oracleSe2({
        version: OracleEngineVersion.VER_12_1,
      }),
      configurations: [
        {
          name: 'OEM',
          port: 1158,
        },
      ],
    }), /`port`.*`vpc`/);

    test.done();
  },
});
