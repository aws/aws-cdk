/**
 * Integration tests for encryption-at-rest mixins.
 *
 * Tests cover:
 * - S3 bucket encryption
 * - DynamoDB table encryption
 * - SQS queue encryption
 * - SNS topic encryption
 * - Lambda function encryption
 * - Cross-service mixin on multiple resources
 */

import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { EncryptionAtRest } from '../lib/mixins/encryption-at-rest.generated';
import '../lib/with';
import type { Construct } from 'constructs';

const app = new cdk.App();

/**
 * Stack for testing S3 bucket encryption
 */
class S3EncryptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'EncryptionKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3.CfnBucket(this, 'EncryptedBucket', {
      bucketName: `integ-test-encrypted-bucket-${this.account}`,
    });

    this.with(new EncryptionAtRest(kmsKey));
  }
}

/**
 * Stack for testing DynamoDB table encryption
 */
class DynamoDBEncryptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'EncryptionKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new dynamodb.CfnTable(this, 'EncryptedTable', {
      tableName: 'integ-test-encrypted-table',
      keySchema: [{
        attributeName: 'pk',
        keyType: 'HASH',
      }],
      attributeDefinitions: [{
        attributeName: 'pk',
        attributeType: 'S',
      }],
      billingMode: 'PAY_PER_REQUEST',
    });

    this.with(new EncryptionAtRest(kmsKey));
  }
}

/**
 * Stack for testing SQS queue encryption
 */
class SQSEncryptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'EncryptionKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new sqs.CfnQueue(this, 'EncryptedQueue', {
      queueName: 'integ-test-encrypted-queue',
    });

    this.with(new EncryptionAtRest(kmsKey));
  }
}

/**
 * Stack for testing SNS topic encryption
 */
class SNSEncryptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'EncryptionKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new sns.CfnTopic(this, 'EncryptedTopic', {
      topicName: 'integ-test-encrypted-topic',
    });

    this.with(new EncryptionAtRest(kmsKey));
  }
}

/**
 * Stack for testing Lambda function encryption
 */
class LambdaEncryptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'EncryptionKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const role = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    kmsKey.grantEncryptDecrypt(role);

    new lambda.CfnFunction(this, 'EncryptedFunction', {
      functionName: 'integ-test-encrypted-function',
      runtime: 'nodejs18.x',
      handler: 'index.handler',
      role: role.roleArn,
      code: {
        zipFile: 'exports.handler = async () => ({ statusCode: 200 });',
      },
    });

    this.with(new EncryptionAtRest(kmsKey));
  }
}

/**
 * Stack for testing cross-service mixin on multiple resources
 */
class CrossServiceEncryptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'SharedEncryptionKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      description: 'Shared KMS key for cross-service encryption',
    });

    new s3.CfnBucket(this, 'Bucket', {
      bucketName: `integ-cross-service-bucket-${this.account}`,
    });

    new dynamodb.CfnTable(this, 'Table', {
      tableName: 'integ-cross-service-table',
      keySchema: [{
        attributeName: 'pk',
        keyType: 'HASH',
      }],
      attributeDefinitions: [{
        attributeName: 'pk',
        attributeType: 'S',
      }],
      billingMode: 'PAY_PER_REQUEST',
    });

    new sqs.CfnQueue(this, 'Queue', {
      queueName: 'integ-cross-service-queue',
    });

    new sns.CfnTopic(this, 'Topic', {
      topicName: 'integ-cross-service-topic',
    });

    // Single mixin applied to all resources via .with()
    this.with(new EncryptionAtRest(kmsKey));
  }
}

// Create all test stacks
const s3Stack = new S3EncryptionStack(app, 'S3EncryptionIntegTest');
const dynamoStack = new DynamoDBEncryptionStack(app, 'DynamoDBEncryptionIntegTest');
const sqsStack = new SQSEncryptionStack(app, 'SQSEncryptionIntegTest');
const snsStack = new SNSEncryptionStack(app, 'SNSEncryptionIntegTest');
const lambdaStack = new LambdaEncryptionStack(app, 'LambdaEncryptionIntegTest');
const crossServiceStack = new CrossServiceEncryptionStack(app, 'CrossServiceEncryptionIntegTest');

new integ.IntegTest(app, 'EncryptionAtRestTest', {
  testCases: [
    s3Stack,
    dynamoStack,
    sqsStack,
    snsStack,
    lambdaStack,
    crossServiceStack,
  ],
});
