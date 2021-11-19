import { rewriteMonoPackageImports, rewriteReadmeImports } from '../lib/rewrite';

describe(rewriteMonoPackageImports, () => {
  test('correctly rewrites naked "import"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    import '@aws-cdk/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    import 'aws-cdk-lib/aws-s3/hello';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites naked "require"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    require('@aws-cdk/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    require('aws-cdk-lib/aws-s3/hello');
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import from"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    import * as s3 from '@aws-cdk/aws-s3';
    import * as cfndiff from '@aws-cdk/cloudformation-diff';
    import { Construct } from "@aws-cdk/core";
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import * as cfndiff from '@aws-cdk/cloudformation-diff';
    import { Construct } from "aws-cdk-lib";
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites "import = require"', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    import s3 = require('@aws-cdk/aws-s3');
    import cfndiff = require('@aws-cdk/cloudformation-diff');
    import { Construct } = require("@aws-cdk/core");
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    import s3 = require('aws-cdk-lib/aws-s3');
    import cfndiff = require('@aws-cdk/cloudformation-diff');
    import { Construct } = require("aws-cdk-lib");
    // something after

    console.log('Look! I did something!');`);
  });

  test('does not rewrite @aws-cdk/assert', () => {
    const output = rewriteMonoPackageImports(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites Cfn imports', () => {
    // Codestar example
    const codestar = rewriteMonoPackageImports(`
    // something before
    import * as codestar from './codestar.generated';
    import { CfnY } from '../codestar.generated';
    import { CfnX } from '../lib/codestar.generated';
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts', {
      rewriteCfnImports: true,
      packageUnscopedName: 'aws-codestar',
    });

    expect(codestar).toBe(`
    // something before
    import * as codestar from 'aws-cdk-lib/aws-codestar';
    import { CfnY } from 'aws-cdk-lib/aws-codestar';
    import { CfnX } from 'aws-cdk-lib/aws-codestar';
    // something after

    console.log('Look! I did something!');`);
  });

  test('correctly rewrites Cfn imports from an alpha module', () => {
    const customModules = {
      '@aws-cdk/aws-kinesisfirehose': 'aws-kinesisfirehose-alpha',
    };
    const output = rewriteMonoPackageImports(`
    // something before
    import * as firehose from '@aws-cdk/aws-kinesisfirehose';
    import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
    // something after

    console.log('Look! I did something!');`, 'aws-cdk-lib', 'subject.ts', {
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

describe(rewriteReadmeImports, () => {
  test('parses ts code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`ts
    import * as s3 from '@aws-cdk/aws-s3';
    import { Construct } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`ts
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import { Construct } from "aws-cdk-lib";
    \`\`\`
    Some more README text.`);
  });

  test('parses typescript code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`typescript
    import * as s3 from '@aws-cdk/aws-s3';
    import { Construct } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`typescript
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import { Construct } from "aws-cdk-lib";
    \`\`\`
    Some more README text.`);
  });

  test('parses text code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`text
    import * as s3 from '@aws-cdk/aws-s3';
    import { Construct } from "@aws-cdk/core";
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`text
    import * as s3 from 'aws-cdk-lib/aws-s3';
    import { Construct } from "aws-cdk-lib";
    \`\`\`
    Some more README text.`);
  });

  test('ignores non ts|typescript|text code snippet', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`java
    import * as s3 from '@aws-cdk/aws-s3';
    \`\`\`
    Some more README text.`, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`java
    import * as s3 from '@aws-cdk/aws-s3';
    \`\`\`
    Some more README text.`);
  });

  test('parses multiple snippets', () => {
    const output = rewriteReadmeImports(`
    Some README text.
    \`\`\`ts
    import * as s3 from '@aws-cdk/aws-s3';
    \`\`\`
    Some more README text.
    \`\`\`ts
    import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
    \`\`\``, 'aws-cdk-lib', 'subject.ts');

    expect(output).toBe(`
    Some README text.
    \`\`\`ts
    import * as s3 from 'aws-cdk-lib/aws-s3';
    \`\`\`
    Some more README text.
    \`\`\`ts
    import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
    \`\`\``);
  });
});
