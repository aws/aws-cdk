/**
 * EFS Permission Integration Test Architecture
 *
 *  AWS-Managed Lambda VPC              Customer VPC
 *  ┌────────────────────┐      ┌─────────────────────────────┐
 *  │                    │      │                             │
 *  │  ┌──────────────┐  │      │                             │
 *  │  │   Write      │──┼──────┼──┐                          │
 *  │  │   Lambda     │  │      │  │                          │
 *  │  │              │  │      │  │                          │
 *  │  │ ✓ Write      │  │      │  │  ┌──────────────┐       │
 *  │  │ ✓ Read       │  │      │  ├─►│  EFS File    │       │
 *  │  └──────────────┘  │      │  │  │   System     │       │
 *  │  grantReadWrite    │      │  │  │              │       │
 *  │                    │      │  │  │  /mnt/efs    │       │
 *  │  ┌──────────────┐  │      │  │  └──────────────┘       │
 *  │  │    Read      │──┼──────┼──┤                          │
 *  │  │   Lambda     │  │      │  │                          │
 *  │  │              │  │      │  │                          │
 *  │  │ ✓ Read       │  │      │  │                          │
 *  │  │ ✗ Write      │  │      │  │                          │
 *  │  └──────────────┘  │      │  │                          │
 *  │    grantRead       │      │  │                          │
 *  │                    │      │  │                          │
 *  │  ┌──────────────┐  │      │  │                          │
 *  │  │  Anonymous   │──┼──────┼──X (no IAM perms)           │
 *  │  │   Lambda     │  │      │                             │
 *  │  │              │  │      │                             │
 *  │  │ ✗ Access     │  │      │                             │
 *  │  └──────────────┘  │      │                             │
 *  │                    │      │                             │
 *  └────────────────────┘      └─────────────────────────────┘
 *
 * Test validates:
 * - WriteLambda: grantReadWrite → can write and read files
 * - ReadLambda: grantRead → can read files, write fails with permission denied
 * - AnonymousLambda: no grant → access denied
 */

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { FileSystem } from 'aws-cdk-lib/aws-efs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-permission-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });

const fileSystem = new FileSystem(stack, 'FileSystem', {
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const accessPoint = fileSystem.addAccessPoint('AccessPoint', {
  path: '/lambda',
  createAcl: {
    ownerGid: '1000',
    ownerUid: '1000',
    permissions: '755',
  },
  posixUser: {
    gid: '1000',
    uid: '1000',
  },
});

// Lambda that can write to EFS
const writeLambda = new lambda.Function(stack, 'WriteLambda', {
  runtime: lambda.Runtime.determineLatestPythonRuntime(stack),
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
import os
import json

def handler(event, context):
    try:
        file_path = '/mnt/efs/integ-test.txt'
        with open(file_path, 'w') as f:
            f.write('Integ Test')
        return {'statusCode': 200, 'body': json.dumps('Write successful')}
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps(f'Error: {str(e)}')}
`),
  vpc,
  filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/efs'),
  timeout: cdk.Duration.seconds(30),
});
fileSystem.grantReadWrite(writeLambda);

// Lambda that can only read from EFS
const readLambda = new lambda.Function(stack, 'ReadLambda', {
  runtime: lambda.Runtime.determineLatestPythonRuntime(stack),
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
import os
import json

def handler(event, context):
    try:
        action = event.get('action', 'read')
        file_path = '/mnt/efs/integ-test.txt'
        
        if action == 'read':
            with open(file_path, 'r') as f:
                content = f.read()
            return {'statusCode': 200, 'body': json.dumps(f'Content: {content}')}
        elif action == 'write':
            with open(file_path, 'w') as f:
                f.write('Should fail')
            return {'statusCode': 200, 'body': json.dumps('Write successful')}
    except PermissionError as e:
        return {'statusCode': 403, 'body': json.dumps(f'Permission denied: {str(e)}')}
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps(f'Error: {str(e)}')}
`),
  vpc,
  filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/efs'),
  timeout: cdk.Duration.seconds(30),
});
fileSystem.grantRead(readLambda);

// Lambda with no EFS permissions
const anonymousLambda = new lambda.Function(stack, 'AnonymousLambda', {
  runtime: lambda.Runtime.determineLatestPythonRuntime(stack),
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
import os
import json

def handler(event, context):
    try:
        file_path = '/mnt/efs/integ-test.txt'
        with open(file_path, 'r') as f:
            content = f.read()
        return {'statusCode': 200, 'body': json.dumps(f'Content: {content}')}
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps(f'Error: {str(e)}')}
`),
  vpc,
  filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/efs'),
  timeout: cdk.Duration.seconds(30),
});

const test = new integ.IntegTest(app, 'EfsPermissionTest', {
  testCases: [stack],
});

// Test 1: WriteLambda can write to EFS
test.assertions.invokeFunction({
  functionName: writeLambda.functionName,
}).expect(integ.ExpectedResult.objectLike({
  Payload: integ.ExpectedResult.stringLikeRegexp('.*Write successful.*'),
}));

// Test 2: ReadLambda can read from EFS
test.assertions.invokeFunction({
  functionName: readLambda.functionName,
  payload: JSON.stringify({ action: 'read' }),
}).expect(integ.ExpectedResult.objectLike({
  Payload: integ.ExpectedResult.stringLikeRegexp('.*Content: Integ Test.*'),
}));

// Test 3: ReadLambda cannot write to EFS (should get permission denied)
test.assertions.invokeFunction({
  functionName: readLambda.functionName,
  payload: JSON.stringify({ action: 'write' }),
}).expect(integ.ExpectedResult.objectLike({
  Payload: integ.ExpectedResult.stringLikeRegexp('.*Permission denied.*'),
}));

// Test 4: AnonymousLambda cannot access EFS
test.assertions.invokeFunction({
  functionName: anonymousLambda.functionName,
}).expect(integ.ExpectedResult.objectLike({
  Payload: integ.ExpectedResult.stringLikeRegexp('.*Error.*'),
}));

app.synth();
