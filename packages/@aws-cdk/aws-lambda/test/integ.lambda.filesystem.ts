import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-4');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 3,
  natGateways: 1,
});

const fileSystem = new efs.FileSystem(stack, 'Efs', {
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE,
  },
  throughputMode: efs.ThroughputMode.PROVISIONED,
  provisionedThroughputPerSecond: cdk.Size.mebibytes(1024),
});

fileSystem.connections.allowDefaultPortInternally();

const accessPoint = new efs.AccessPoint(stack, 'AccessPoint', {
  fileSystem,
  createAcl: {
    ownerGid: '1000',
    ownerUid: '1000',
    permissions: '755',
  },
  path: '/lambda',
  posixUser: {
    uid: '1000',
    gid: '1000',
  },
});

const fn = new lambda.Function(stack, 'MyLambda', {
  // sample code below from the blog post: https://go.aws/2Y6UgKe
  code: new lambda.InlineCode(`
import os
import fcntl

MSG_FILE_PATH = '/mnt/msg/content'

def get_messages():
    try:
        with open(MSG_FILE_PATH, 'r') as msg_file:
            fcntl.flock(msg_file, fcntl.LOCK_SH)
            messages = msg_file.read()
            fcntl.flock(msg_file, fcntl.LOCK_UN)
    except:
        messages = 'No message yet.'
    return messages

def add_message(new_message):
    with open(MSG_FILE_PATH, 'a') as msg_file:
        fcntl.flock(msg_file, fcntl.LOCK_EX)
        msg_file.write(new_message + "\\n")
        fcntl.flock(msg_file, fcntl.LOCK_UN)

def delete_messages():
    try:
        os.remove(MSG_FILE_PATH)
    except:
        pass

def lambda_handler(event, context):
    method = event['requestContext']['http']['method']
    if method == 'GET':
        messages = get_messages()
    elif method == 'POST':
        new_message = event['body']
        add_message(new_message)
        messages = get_messages()
    elif method == 'DELETE':
        delete_messages()
        messages = 'Messages deleted.'
    else:
        messages = 'Method unsupported.'
    return messages
  `),
  handler: 'index.lambda_handler',
  runtime: lambda.Runtime.PYTHON_3_7,
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE,
  },
  securityGroups: fileSystem.connections.securityGroups,
  filesystems: {
    filesystem: lambda.LambdaFileSystem.fromEfsFileSystem(accessPoint),
    localMountPath: '/mnt/msg',
  },
});

fn.node.addDependency(accessPoint, fileSystem);

app.synth();
