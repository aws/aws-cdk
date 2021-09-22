import { rewriteImports } from '../lib/rewrite';

describe(rewriteImports, () => {
  test('correctly rewrites naked "import"', () => {
    const output = rewriteImports(`
    // something before
    import '@aws-cdk/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`, 'subhect.ts');

    expect(output).toBe(`
    // something before
    import 'aws-cdk-lib/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites naked "require"', () => {
    const output = rewriteImports(`
    // something before
    require('@aws-cdk/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`, 'subhect.ts');

    expect(output).toBe(`
    // something before
    require('aws-cdk-lib/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import from"', () => {
    const output = rewriteImports(`
  // something before
  import * as s3 from '@aws-cdk/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Construct } from "@aws-cdk/core";
  // something after

  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import * as s3 from 'aws-cdk-lib/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Construct } from "aws-cdk-lib";
  // something after

  console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import = require"', () => {
    const output = rewriteImports(`
  // something before
  import s3 = require('@aws-cdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("@aws-cdk/core");
  // something after

  console.log('Look! I did something!');`, 'subject.ts');

    expect(output).toBe(`
  // something before
  import s3 = require('aws-cdk-lib/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("aws-cdk-lib");
  // something after

  console.log('Look! I did something!');`);
  });

  test('does not rewrite @aws-cdk/assert', () => {
    const output = rewriteImports(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`, 'subhect.ts');

    expect(output).toBe(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites Cfn imports', () => {
    // Codestar example
    const codestar = rewriteImports(`
    // something before
    import * as codestar from './codestar.generated';
    // something after

    console.log('Look! I did something!');`, 'subject.ts', {
      rewriteCfnImports: true,
      packageUnscopedName: 'aws-codestar',
    });

    expect(codestar).toBe(`
    // something before
    import * as codestar from 'aws-cdk-lib/aws-codestar';
    // something after

    console.log('Look! I did something!');`);

    // Glue example
    const glue = rewriteImports(`
    // something before
    import { CfnConnection } from './glue.generated';
    // something after

    console.log('Look! I did something!');`, 'subject.ts', {
      rewriteCfnImports: true,
      packageUnscopedName: 'aws-glue',
    });

    expect(glue).toBe(`
    // something before
    import { CfnConnection } from 'aws-cdk-lib/aws-glue';
    // something after

    console.log('Look! I did something!');`);

    // ApiGatewayV2 example
    const apigatewayv2 = rewriteImports(`
    // something before
    import { CfnApi } from '../apigatewayv2.generated';
    // something after

    console.log('Look! I did something!');`, 'subject.ts', {
      rewriteCfnImports: true,
      packageUnscopedName: 'aws-apigatewayv2',
    });

    expect(apigatewayv2).toBe(`
    // something before
    import { CfnApi } from 'aws-cdk-lib/aws-apigatewayv2';
    // something after

    console.log('Look! I did something!');`);

    // Cloud9 example
    const cloud9 = rewriteImports(`
    // something before
    import { CfnEnvironmentEC2 } from '../lib/cloud9.generated';
    // something after

    console.log('Look! I did something!');`, 'subject.ts', {
      rewriteCfnImports: true,
      packageUnscopedName: 'aws-cloud9',
    });

    expect(cloud9).toBe(`
    // something before
    import { CfnEnvironmentEC2 } from 'aws-cdk-lib/aws-cloud9';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites Cfn imports from an alpha module', () => {
    const customModules = {
      '@aws-cdk/aws-kinesisfirehose': 'aws-kinesisfirehose-alpha',
    };
    const output = rewriteImports(`
    // something before
    import * as firehose from '@aws-cdk/aws-kinesisfirehose';
    import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
    // something after

    console.log('Look! I did something!');`, 'subject.ts', {
      rewriteCfnImports: true,
      customModules: customModules,
    });

    expect(output).toBe(`
    // something before
    import * as firehose from 'aws-kinesisfirehose-alpha';
    import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
    // something after

    console.log('Look! I did something!');`);
  });
});
