import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as integ from '@aws-cdk/integ-tests-alpha';

class EfsStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly accessPoint: efs.AccessPoint;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
      natGateways: 1,
    });

    const fileSystem = new efs.FileSystem(this, 'Efs', {
      vpc: this.vpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.accessPoint = fileSystem.addAccessPoint('AccessPoint', {
      createAcl: {
        ownerGid: '1001',
        ownerUid: '1001',
        permissions: '750',
      },
      path: '/export/lambda',
      posixUser: {
        gid: '1001',
        uid: '1001',
      },
    });
  }
}

interface LambdaStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  accessPoint: efs.AccessPoint;
}

class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
      natGateways: 1,
    });

    const fileSystem = new efs.FileSystem(this, 'Efs', {
      vpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // create an access point and expose the root of the filesystem
    const accessPoint = fileSystem.addAccessPoint('AccessPoint', {
      createAcl: {
        ownerGid: '1001',
        ownerUid: '1001',
        permissions: '750',
      },
      path: '/export/lambda',
      posixUser: {
        gid: '1001',
        uid: '1001',
      },
    });

    const lambdaCode = new lambda.InlineCode(`
    import json
    import os
    import string
    import random
    import datetime

    MSG_FILE_PATH = '/mnt/msg/content'

    def randomString(stringLength=10):
      letters = string.ascii_lowercase
      return ''.join(random.choice(letters) for i in range(stringLength))

    def lambda_handler(event, context):
      with open(MSG_FILE_PATH, 'a') as f:
          f.write(f"{datetime.datetime.utcnow():%Y-%m-%d-%H:%M:%S} " + randomString(5) + ' ')

      file = open(MSG_FILE_PATH, "r")
      file_content = file.read()
      file.close()

      return {
        'statusCode': 200,
        'body': str(file_content)
      }
    `);

    // this function will mount the access point to '/mnt/msg' and write content onto /mnt/msg/content
    const lambda1 = new lambda.Function(this, 'MyLambda', {
      code: lambdaCode,
      handler: 'index.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_12,
      vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg'),
    });

    const importedFileSystem = efs.FileSystem.fromFileSystemAttributes(this, 'fileSystemImported', {
      fileSystemId: fileSystem.fileSystemId,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(
        this,
        'securityGroup',
        fileSystem.connections.securityGroups[0].securityGroupId,
      ),
    });

    const importedAccessPoint = efs.AccessPoint.fromAccessPointAttributes(this, 'AccessPointImported', {
      accessPointId: accessPoint.accessPointId,
      fileSystem: importedFileSystem,
    });

    // this function will mount the access point to '/mnt/msg' and write content onto /mnt/msg/content
    const lambda2 = new lambda.Function(this, 'MyLambda2', {
      code: lambdaCode,
      handler: 'index.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_12,
      vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(
        importedAccessPoint,
        '/mnt/msg',
      ),
    });

    // lambda2 doesn't have dependencies on MountTargets because the fileSystem is imported.
    // Ideally, lambda2 would be deployed in another stack but integ doesn't support it.
    // We are adding a dependency on the first lambda to simulate this situation.
    lambda2.node.addDependency(lambda1);

    new lambda.Function(this, 'MyLambda3', {
      code: lambdaCode,
      handler: 'index.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_12,
      vpc: props.vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(props.accessPoint, '/mnt/msg'),
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const efsStack = new EfsStack(app, 'aws-cdk-efs');

const lambdaStack = new LambdaStack(app, 'aws-cdk-lambda', {
  vpc: efsStack.vpc,
  accessPoint: efsStack.accessPoint,
});

new integ.IntegTest(app, 'aws-efs-lambda-test', {
  testCases: [efsStack, lambdaStack],
});

app.synth();
