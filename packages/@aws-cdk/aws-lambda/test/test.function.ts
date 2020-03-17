import { expect, haveResource } from '@aws-cdk/assert';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as _ from 'lodash';
import {Test, testCase} from 'nodeunit';
import * as path from 'path';
import * as lambda from '../lib';

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

  'codeHash returns a value for supporting assets and inline code'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const asset = new lambda.Function(stack, 'Asset', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler'
    });
    const inline = new lambda.Function(stack, 'Inline', {
      code: lambda.Code.fromInline('boom bam'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler'
    });
    const params = new lambda.Function(stack, 'CfnParams', {
      code: lambda.Code.fromCfnParameters(),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler'
    });

    // THEN
    test.deepEqual(asset.codeHash, '9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232');
    test.deepEqual(inline.codeHash, 'e07117e0bca42f0f84f0b2cf044d45352808b2dbdde5358c0b9f770166cb1515');
    test.deepEqual(params.codeHash, undefined);
    test.done();
  },

  'addAlias defines an alias against the latest version of your function'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyFunction', {
      code: lambda.Code.fromInline('inline horray'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler'
    });

    // WHEN
    fn.addAlias('latest');

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Alias', {
      FunctionName: {
        Ref: "MyFunction3BAA72D1"
      },
      FunctionVersion: {
        "Fn::GetAtt": [
          "MyFunctionVersion756d30f6e614451d9c4fed107d9c1ee3030fabf54768b61af9c54f8b2d90ad0c14F79D34",
          "Version"
        ]
      },
      Name: "latest"
    }));

    test.done();
  }

});
