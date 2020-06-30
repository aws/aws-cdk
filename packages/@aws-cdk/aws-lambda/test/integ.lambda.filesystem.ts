import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
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
  throughputMode: efs.ThroughputMode.PROVISIONED,
  provisionedThroughputPerSecond: cdk.Size.mebibytes(1024),
});

fileSystem.connections.allowDefaultPortInternally();

/**
 * create a new accessPoint and create the new /mnt/msg folder with given permission
 * settings.
 *
 * see blog post: https://go.aws/2Y6UgKe
 */
const accessPoint = fileSystem.addAccessPoint('AccessPoint', {
  path: '/mnt/msg',
  // as /mnt/msg does not exist, the efs will create the directory with the following createAcl
  createAcl: {
    ownerUid: '1001',
    ownerGid: '1001',
    permissions: '750',
  },
  // enforce the POSIX identity so lambda function will access with this identity
  posixUser: {
    uid: '1001',
    gid: '1001',
  },
});

// this function will mount '/mnt/msg' and write content into /mnt/msg/content
const handler = new lambda.Function(stack, 'MyLambda', {
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
  filesystems: [
    lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg'),
  ],
});

const api = new apigatewayv2.HttpApi(stack, 'Api', {
  defaultIntegration: new apigatewayv2.LambdaProxyIntegration({ handler })
});

new cdk.CfnOutput(stack, 'ApiUrl', { value: api.url!});

app.synth();
