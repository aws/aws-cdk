import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-1');


const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 3,
  natGateways: 1,
});

const fileSystem = new efs.FileSystem(stack, 'Efs', {
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
const lambda1 = new lambda.Function(stack, 'MyLambda', {
  code: lambdaCode,
  handler: 'index.lambda_handler',
  runtime: lambda.Runtime.PYTHON_3_7,
  vpc,
  filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg'),
});

let importedFileSystem = efs.FileSystem.fromFileSystemAttributes(stack, 'fileSystemImported', {
  fileSystemId: fileSystem.fileSystemId,
  securityGroup: ec2.SecurityGroup.fromSecurityGroupId(
    stack,
    'securityGroup',
    fileSystem.connections.securityGroups[0].securityGroupId,
  ),
});

let importedAccessPoint = efs.AccessPoint.fromAccessPointAttributes(stack, 'AccessPointImported', {
  accessPointId: accessPoint.accessPointId,
  fileSystem: importedFileSystem,
});

// this function will mount the access point to '/mnt/msg' and write content onto /mnt/msg/content
const lambda2 = new lambda.Function(stack, 'MyLambda2', {
  code: lambdaCode,
  handler: 'index.lambda_handler',
  runtime: lambda.Runtime.PYTHON_3_7,
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

app.synth();
