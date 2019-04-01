import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { ClusterParameterGroup, DatabaseCluster, DatabaseClusterEngine } from '../lib';

export = {
  'check that instantiation works'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.Aurora,
      masterUser: {
        username: 'admin',
        password: 'tooshort',
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: "aurora",
        DBSubnetGroupName: { Ref: "DatabaseSubnets56F17B9A" },
        MasterUsername: "admin",
        MasterUserPassword: "tooshort",
        VpcSecurityGroupIds: [ {"Fn::GetAtt": ["DatabaseSecurityGroup5C91FDCB", "GroupId"]}]
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain'
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain'
    }, ResourcePart.CompleteDefinition));

    test.done();
  },
  'check that exporting/importing works'(test: Test) {
    // GIVEN
    const stack1 = testStack();
    const stack2 = testStack();

    const cluster = new DatabaseCluster(stack1, 'Database', {
      engine: DatabaseClusterEngine.Aurora,
      masterUser: {
        username: 'admin',
        password: 'tooshort',
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc: new ec2.VpcNetwork(stack1, 'VPC')
      }
    });

    // WHEN
    DatabaseCluster.import(stack2, 'Database', cluster.export());

    // THEN: No error

    test.done();
  },
  'can create a cluster with a single instance'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.Aurora,
      instances: 1,
      masterUser: {
        username: 'admin',
        password: 'tooshort',
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: "aurora",
      DBSubnetGroupName: { Ref: "DatabaseSubnets56F17B9A" },
      MasterUsername: "admin",
      MasterUserPassword: "tooshort",
      VpcSecurityGroupIds: [ {"Fn::GetAtt": ["DatabaseSecurityGroup5C91FDCB", "GroupId"]}]
    }));

    test.done();
  },

  'can create a cluster with imported vpc and security group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.VpcNetwork.importFromContext(stack, 'VPC', {
      vpcId: "VPC12345"
    });
    const sg = ec2.SecurityGroup.import(stack, 'SG', {
      securityGroupId: "SecurityGroupId12345"
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.Aurora,
      instances: 1,
      masterUser: {
        username: 'admin',
        password: 'tooshort',
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc,
        securityGroup: sg
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: "aurora",
      DBSubnetGroupName: { Ref: "DatabaseSubnets56F17B9A" },
      MasterUsername: "admin",
      MasterUserPassword: "tooshort",
      VpcSecurityGroupIds: [ "SecurityGroupId12345" ]
    }));

    test.done();
  },

  'cluster with parameter group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    const group = new ClusterParameterGroup(stack, 'Params', {
      family: 'hello',
      description: 'bye',
      parameters: {
        param: 'value'
      }
    });
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.Aurora,
      masterUser: {
        username: 'admin',
        password: 'tooshort',
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc
      },
      parameterGroup: group
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: { Ref: 'ParamsA8366201' },
    }));

    test.done();
  },

  'import/export cluster parameter group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const group = new ClusterParameterGroup(stack, 'Params', {
      family: 'hello',
      description: 'desc'
    });

    // WHEN
    const exported = group.export();
    const imported = ClusterParameterGroup.import(stack, 'ImportParams', exported);

    // THEN
    test.deepEqual(stack.node.resolve(exported), { parameterGroupName: { 'Fn::ImportValue': 'Stack:ParamsParameterGroupNameA6B808D7' } });
    test.deepEqual(stack.node.resolve(imported.parameterGroupName), { 'Fn::ImportValue': 'Stack:ParamsParameterGroupNameA6B808D7' });
    test.done();
  },

  'creates a secret when master credentials are not specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AuroraMysql,
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      MasterUsername: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195'
            },
            ':SecretString:username::}}'
          ]
        ]
      },
      MasterUserPassword: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195'
            },
            ':SecretString:password::}}'
          ]
        ]
      },
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeCharacters: '\"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"admin"}'
      }
    }));

    test.done();
  },

  'create an encrypted cluster with custom KMS key'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AuroraMysql,
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc
      },
      kmsKey: new kms.EncryptionKey(stack, 'Key')
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      KmsKeyId: {
        'Fn::GetAtt': [
          'Key961B73FD',
          'Arn'
        ]
      }
    }));

    test.done();
  }
};

function testStack() {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' }});
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
