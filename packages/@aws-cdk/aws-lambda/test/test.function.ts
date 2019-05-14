import {Test, testCase} from 'nodeunit';
import lambda = require('../lib');
import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
import _ = require('lodash');


export = testCase({
  'add incompatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const func = new lambda.Function(stack, 'myFunc', {
      runtime: lambda.Runtime.Python37,
      handler: 'index.handler',
      code: code,
    });
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code: code,
      compatibleRuntimes: [lambda.Runtime.NodeJS]
    });

    // THEN
    test.throws(() => func.addLayer(layer),
      /This lambda function uses a runtime that is incompatible with this layer/);

    test.done();
  },
  'add compatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const func = new lambda.Function(stack, 'myFunc', {
      runtime: lambda.Runtime.Python37,
      handler: 'index.handler',
      code: code,
    });
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code: code,
      compatibleRuntimes: [lambda.Runtime.Python37]
    });

    // THEN
    // should not throw
    func.addLayer(layer);

    test.done();
  },
  'add compatible layer for deep clone'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const runtime = lambda.Runtime.Python37;
    const func = new lambda.Function(stack, 'myFunc', {
      runtime: runtime,
      handler: 'index.handler',
      code: code,
    });
    const clone = _.cloneDeep(runtime);
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code: code,
      compatibleRuntimes: [clone]
    });

    // THEN
    // should not throw
    func.addLayer(layer);

    test.done();
  },
});
