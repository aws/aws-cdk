import { expect, haveOutput } from '@aws-cdk/assert';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as _ from 'lodash';
import {Test, testCase} from 'nodeunit';
import * as path from 'path';
import * as lambda from '../lib';
import { CfnOutput } from '@aws-cdk/core';

export = testCase({
  'add incompatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const func = new lambda.Function(stack, 'myFunc', {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      code,
    });
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code,
      compatibleRuntimes: [lambda.Runtime.NODEJS]
    });

    // THEN
    test.throws(() => func.addLayers(layer),
      /This lambda function uses a runtime that is incompatible with this layer/);

    test.done();
  },
  'add compatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const func = new lambda.Function(stack, 'myFunc', {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      code,
    });
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code,
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7]
    });

    // THEN
    // should not throw
    func.addLayers(layer);

    test.done();
  },
  'add compatible layer for deep clone'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const runtime = lambda.Runtime.PYTHON_3_7;
    const func = new lambda.Function(stack, 'myFunc', {
      runtime,
      handler: 'index.handler',
      code,
    });
    const clone = _.cloneDeep(runtime);
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code,
      compatibleRuntimes: [clone]
    });

    // THEN
    // should not throw
    func.addLayers(layer);

    test.done();
  },

  'empty inline code is not allowed'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN/THEN
    test.throws(() => new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('')
    }), /Lambda inline code cannot be empty/);
    test.done();
  },

  'logGroup is correctly returned'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
    });
    const logGroup = fn.logGroup;
    test.ok(logGroup.logGroupName);
    test.ok(logGroup.logGroupArn);
    test.done();
  },

  'dlq is returned when provided by user'(test: Test) {
    const stack = new cdk.Stack();

    const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriod: cdk.Duration.days(14)
    });

    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      deadLetterQueue: dlQueue,
    });
    const deadLetterQueue = fn.deadLetterQueue;
    test.ok(deadLetterQueue?.queueArn);
    test.ok(deadLetterQueue?.queueName);
    test.ok(deadLetterQueue?.queueUrl);
    test.done();
  },

  'dlq is returned when setup by cdk'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      deadLetterQueueEnabled: true,
    });
    const deadLetterQueue = fn.deadLetterQueue;
    test.ok(deadLetterQueue?.queueArn);
    test.ok(deadLetterQueue?.queueName);
    test.ok(deadLetterQueue?.queueUrl);
    test.done();
  },

  'dlq is undefined when not setup'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
    });
    const deadLetterQueue = fn.deadLetterQueue;
    test.ok(deadLetterQueue === undefined);
    test.done();
  },

  'one and only one child LogRetention construct will be created'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      logRetention: logs.RetentionDays.FIVE_DAYS,
    });

    // tslint:disable:no-unused-expression
    // Call logGroup a few times. If more than one instance of LogRetention was created,
    // the second call will fail on duplicate constructs.
    fn.logGroup;
    fn.logGroup;
    fn.logGroup;
    // tslint:enable:no-unused-expression

    test.done();
  },

  'fails when inline code is specified on an incompatible runtime'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(() => new lambda.Function(stack, 'fn', {
      handler: 'foo',
      runtime: lambda.Runtime.PROVIDED,
      code: lambda.Code.fromInline('foo')
    }), /Inline source not allowed for/);
    test.done();
  },

  'currentVersion': {

    // see test.function-hash.ts for more coverage for this
    'logical id of version is based on the function hash'(test: Test) {
      // GIVEN
      const stack1 = new cdk.Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        handler: 'foo',
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        environment: {
          FOO: 'bar'
        }
      });
      const stack2 = new cdk.Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        handler: 'foo',
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        environment: {
          FOO: 'bear'
        }
      });

      // WHEN
      new CfnOutput(stack1, 'CurrentVersionArn', {
        value: fn1.currentVersion.functionArn
      });
      new CfnOutput(stack2, 'CurrentVersionArn', {
        value: fn2.currentVersion.functionArn
      });

      // THEN
      expect(stack1).to(haveOutput({
        outputName: 'CurrentVersionArn',
        outputValue: {
          Ref: "MyFunctionCurrentVersion197490AF1a9a73cf5c46aec5e40fb202042eb60b"
        }
      }));
      expect(stack2).to(haveOutput({
        outputName: 'CurrentVersionArn',
        outputValue: {
          Ref: "MyFunctionCurrentVersion197490AF8360a045031060e3117269037b7bffd6"
        }
      }));
      test.done();
    }
  },

});
