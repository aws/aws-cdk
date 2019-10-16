import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/core');
import { SecretValue } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import rds = require('../lib');
import { SecretRotationApplication } from '../lib';

/* eslint-disable quote-props */

export = {
  'add a rds rotation single user to a cluster'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // WHEN
    cluster.addRotationSingleUser('Rotation');

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
      "IpProtocol": "tcp",
      "Description": "from DatabaseRotationSecurityGroup1C5A8031:{IndirectPort}",
      "FromPort": {
        "Fn::GetAtt": [
          "DatabaseB269D8BB",
          "Endpoint.Port"
        ]
      },
      "GroupId": {
        "Fn::GetAtt": [
          "DatabaseSecurityGroup5C91FDCB",
          "GroupId"
        ]
      },
      "SourceSecurityGroupId": {
        "Fn::GetAtt": [
          "DatabaseRotationSecurityGroup17736B63",
          "GroupId"
        ]
      },
      "ToPort": {
        "Fn::GetAtt": [
          "DatabaseB269D8BB",
          "Endpoint.Port"
        ]
      }
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::RotationSchedule', {
      "SecretId": {
        "Ref": "DatabaseSecretAttachedSecretE6CAC445"
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
            ":function:DatabaseRotation0D47EBD2"
          ]
        ]
      },
      "RotationRules": {
        "AutomaticallyAfterDays": 30
      }
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      "GroupDescription": "Database/Rotation/SecurityGroup"
    }));

    expect(stack).to(haveResource('AWS::Serverless::Application', {
      "Location": {
        "ApplicationId": "arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSMySQLRotationSingleUser",
        "SemanticVersion": "1.0.85"
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
        "functionName": "DatabaseRotation0D47EBD2",
        "vpcSecurityGroupIds": {
          "Fn::GetAtt": [
            "DatabaseRotationSecurityGroup17736B63",
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
            ]
          ]
        }
      }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      "Action": "lambda:InvokeFunction",
      "FunctionName": "DatabaseRotation0D47EBD2",
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

  'throws when trying to add rotation to a cluster without secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      masterUser: {
        username: 'admin',
        password: SecretValue.plainText('tooshort')
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // THEN
    test.throws(() => cluster.addRotationSingleUser('Rotation'), /without secret/);

    test.done();
  },

  'throws when connections object has no default port range'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc,
    });

    // WHEN
    const target = new ec2.Connections({
      securityGroups: [securityGroup]
    });

    // THEN
    test.throws(() => new rds.SecretRotation(stack, 'Rotation', {
      secret,
      application: SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      vpc,
      target
    }), /`target`.+default port range/);

    test.done();
  },

  'add a rds rotation single user to an instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const instance = new rds.DatabaseInstance(stack, 'Database', {
      engine: rds.DatabaseInstanceEngine.MARIADB,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'syscdk',
      vpc
    });

    // WHEN
    instance.addRotationSingleUser('Rotation');

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
      "IpProtocol": "tcp",
      "Description": "from DatabaseRotationSecurityGroup1C5A8031:{IndirectPort}",
      "FromPort": {
        "Fn::GetAtt": [
          "DatabaseB269D8BB",
          "Endpoint.Port"
        ]
      },
      "GroupId": {
        "Fn::GetAtt": [
          "DatabaseSecurityGroup5C91FDCB",
          "GroupId"
        ]
      },
      "SourceSecurityGroupId": {
        "Fn::GetAtt": [
          "DatabaseRotationSecurityGroup17736B63",
          "GroupId"
        ]
      },
      "ToPort": {
        "Fn::GetAtt": [
          "DatabaseB269D8BB",
          "Endpoint.Port"
        ]
      }
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::RotationSchedule', {
      "SecretId": {
        "Ref": "DatabaseSecretAttachedSecretE6CAC445"
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
            ":function:DatabaseRotation0D47EBD2"
          ]
        ]
      },
      "RotationRules": {
        "AutomaticallyAfterDays": 30
      }
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      "GroupDescription": "Database/Rotation/SecurityGroup"
    }));

    expect(stack).to(haveResource('AWS::Serverless::Application', {
      "Location": {
        "ApplicationId": "arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSMariaDBRotationSingleUser",
        "SemanticVersion": "1.0.57"
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
        "functionName": "DatabaseRotation0D47EBD2",
        "vpcSecurityGroupIds": {
          "Fn::GetAtt": [
            "DatabaseRotationSecurityGroup17736B63",
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
            ]
          ]
        }
      }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      "Action": "lambda:InvokeFunction",
      "FunctionName": "DatabaseRotation0D47EBD2",
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

  'throws when trying to add rotation to an instance without secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const instance = new rds.DatabaseInstance(stack, 'Database', {
      engine: rds.DatabaseInstanceEngine.SQL_SERVER_EE,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'syscdk',
      masterUserPassword: SecretValue.plainText('tooshort'),
      vpc
    });

    // THEN
    test.throws(() => instance.addRotationSingleUser('Rotation'), /without secret/);

    test.done();
  },
};
