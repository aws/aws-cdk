import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/cdk');
import { SecretValue } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import rds = require('../lib');
import { SecretRotationApplication } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'add a rds rotation single user to a cluster'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.AuroraMysql,
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
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
        "SemanticVersion": "1.0.74"
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
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.AuroraMysql,
      masterUser: {
        username: 'admin',
        password: SecretValue.plainText('tooshort')
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
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
    test.throws(() => new rds.SecretRotation(stack, 'Rotation', {
      secret,
      application: SecretRotationApplication.MysqlRotationSingleUser,
      vpc,
      target
    }), /`target`.+default port range/);

    test.done();
  },

  'add a rds rotation single user to an instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new rds.DatabaseInstance(stack, 'Database', {
      engine: rds.DatabaseInstanceEngine.MariaDb,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
      masterUsername: 'syscdk',
      vpc
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
        "ApplicationId": "arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSMariaDBRotationSingleUser",
        "SemanticVersion": "1.0.46"
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
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    const instance = new rds.DatabaseInstance(stack, 'Database', {
      engine: rds.DatabaseInstanceEngine.SqlServerEE,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
      masterUsername: 'syscdk',
      masterUserPassword: SecretValue.plainText('tooshort'),
      vpc
    });

    // THEN
    test.throws(() => instance.addRotationSingleUser('Rotation'), /without secret/);

    test.done();
  },
};
