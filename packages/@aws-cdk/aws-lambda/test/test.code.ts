import assets = require('@aws-cdk/assets');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import lambda = require('../lib');

export = {
  'lambda.Code.inline': {
    'fails if used with unsupported runtimes'(test: Test) {
      test.throws(() => defineFunction(lambda.Code.inline('boom'), lambda.Runtime.Go1x), /Inline source not allowed for go1\.x/);
      test.throws(() => defineFunction(lambda.Code.inline('boom'), lambda.Runtime.Java8), /Inline source not allowed for java8/);
      test.throws(() => defineFunction(lambda.Code.inline('boom'), lambda.Runtime.NodeJS810), /Inline source not allowed for nodejs8\.10/);
      test.done();
    },
    'fails if larger than 4096 bytes'(test: Test) {
      test.throws(
        () => defineFunction(lambda.Code.inline(generateRandomString(4097)), lambda.Runtime.NodeJS610),
        /Lambda source is too large, must be <= 4096 but is 4097/);
      test.done();
    }
  },
  'lambda.Code.asset': {
    'determines packaging type from file type'(test: Test) {
      // WHEN
      const fileAsset = lambda.Code.asset(path.join(__dirname, 'handler.zip'));
      const directoryAsset = lambda.Code.asset(path.join(__dirname, 'my-lambda-handler'));

      // THEN
      test.deepEqual(fileAsset.packaging, assets.AssetPackaging.File);
      test.deepEqual(directoryAsset.packaging, assets.AssetPackaging.ZipDirectory);
      test.done();
    },

    'fails if a non-zip asset is used'(test: Test) {
      // GIVEN
      const fileAsset = lambda.Code.asset(path.join(__dirname, 'my-lambda-handler', 'index.py'));

      // THEN
      test.throws(() => defineFunction(fileAsset), /Asset must be a \.zip file or a directory/);
      test.done();
    }
  }
};

function defineFunction(code: lambda.Code, runtime: lambda.Runtime = lambda.Runtime.NodeJS810) {
  const stack = new cdk.Stack();
  return new lambda.Function(stack, 'Func', {
    handler: 'foom',
    code, runtime
  });
}

function generateRandomString(bytes: number) {
  let s = '';
  for (let i = 0; i < bytes; ++i) {
    s += String.fromCharCode(Math.round(Math.random() * 256));
  }
  return s;
}