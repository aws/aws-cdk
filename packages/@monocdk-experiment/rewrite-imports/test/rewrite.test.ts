import { rewriteFile, rewriteLine } from '../lib/rewrite';

describe('rewriteLine', () => {
  test('quotes', () => {
    expect(rewriteLine('import * as s3 from \'@aws-cdk/aws-s3\''))
      .toEqual('import * as s3 from \'monocdk-experiment/aws-s3\'');
  });

  test('double quotes', () => {
    expect(rewriteLine('import * as s3 from "@aws-cdk/aws-s3"'))
      .toEqual('import * as s3 from "monocdk-experiment/aws-s3"');
  });

  test('@aws-cdk/core', () => {
    expect(rewriteLine('import * as s3 from "@aws-cdk/core"'))
      .toEqual('import * as s3 from "monocdk-experiment"');
    expect(rewriteLine('import * as s3 from \'@aws-cdk/core\''))
      .toEqual('import * as s3 from \'monocdk-experiment\'');
  });

  test('non-jsii modules are ignored', () => {
    expect(rewriteLine('import * as cfndiff from \'@aws-cdk/cloudformation-diff\''))
      .toEqual('import * as cfndiff from \'@aws-cdk/cloudformation-diff\'');
    expect(rewriteLine('import * as cfndiff from \'@aws-cdk/assert'))
      .toEqual('import * as cfndiff from \'@aws-cdk/assert');
  });
});

describe('rewriteFile', () => {
  const output = rewriteFile(`
  // something before
  import * as s3 from '@aws-cdk/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import * as s3 from '@aws-cdk/core';
  // something after

  // hello`);

  expect(output).toEqual(`
  // something before
  import * as s3 from 'monocdk-experiment/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import * as s3 from 'monocdk-experiment';
  // something after

  // hello`);
});