import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import rds = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'create a rds rotation single user'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc,
    });
    const target = new ec2.Connections({
      defaultPortRange: new ec2.TcpPort(1521),
      securityGroups: [securityGroup]
    });
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    new rds.RotationSingleUser(stack, 'Rotation', {
      secret,
      engine: rds.DatabaseEngine.Oracle,
      vpc,
      target
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
      "IpProtocol": "tcp",
      "Description": "from RotationSecurityGroup29D01037:1521",
      "FromPort": 1521,
      "GroupId": {
        "Fn::GetAtt": [
          "SecurityGroupDD263621",
          "GroupId"
        ]
      },
      "SourceSecurityGroupId": {
        "Fn::GetAtt": [
          "RotationSecurityGroup3D2AB776",
          "GroupId"
        ]
      },
      "ToPort": 1521
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::RotationSchedule', {
      "SecretId": {
        "Ref": "SecretA720EF05"
      },
      "RotationLambdaARN": {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              "Ref": "AWS::Partition"
            },
            ":lambda:",
            {
              "Ref": "AWS::Region"
            },
            ":",
            {
              "Ref": "AWS::AccountId"
            },
            ":function:Rotation"
          ]
        ]
      },
      "RotationRules": {
        "AutomaticallyAfterDays": 30
      }
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      "GroupDescription": "Rotation/SecurityGroup"
    }));

    expect(stack).to(haveResource('AWS::Serverless::Application', {
      "Location": {
        "ApplicationId": "arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSOracleRotationSingleUser",
        "SemanticVersion": "1.0.45"
      },
      "Parameters": {
        "endpoint": {
          "Fn::Join": [
            "",
            [
              "https://secretsmanager.",
              {
                "Ref": "AWS::Region"
              },
              ".",
              {
                "Ref": "AWS::URLSuffix"
              }
            ]
          ]
        },
        "functionName": "Rotation",
        "vpcSecurityGroupIds": {
          "Fn::GetAtt": [
            "RotationSecurityGroup3D2AB776",
            "GroupId"
          ]
        },
        "vpcSubnetIds": {
          "Fn::Join": [
            "",
            [
              {
                "Ref": "VPCPrivateSubnet1Subnet8BCA10E0"
              },
              ",",
              {
                "Ref": "VPCPrivateSubnet2SubnetCFCDAA7A"
              },
              ",",
              {
                "Ref": "VPCPrivateSubnet3Subnet3EDCD457"
              }
            ]
          ]
        }
      }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      "Action": "lambda:InvokeFunction",
      "FunctionName": "Rotation",
      "Principal": {
        "Fn::Join": [
          "",
          [
            "secretsmanager.",
            {
              "Ref": "AWS::URLSuffix"
            }
          ]
        ]
      }
    }));

    test.done();
  },

  'throws when both application location and engine are not specified'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc,
    });
    const target = new ec2.Connections({
      defaultPortRange: new ec2.TcpPort(1521),
      securityGroups: [securityGroup]
    });
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // THEN
    test.throws(() => new rds.RotationSingleUser(stack, 'Rotation', {
      secret,
      vpc,
      target
    }), /`serverlessApplicationLocation`.+`engine`/);

    test.done();
  },

  'throws when connections object has no default port range'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc,
    });

    // WHEN
    const target = new ec2.Connections({
      securityGroups: [securityGroup]
    });

    // THEN
    test.throws(() => new rds.RotationSingleUser(stack, 'Rotation', {
      secret,
      engine: rds.DatabaseEngine.Mysql,
      vpc,
      target
    }), /`target`.+default port range/);

    test.done();
  }
};
