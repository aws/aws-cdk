import * as fs from 'fs';
import * as path from 'path';
import { Template } from '../../assertions';
import * as s3 from '../../aws-s3';
import { App, Stage, Stack, DockerImage } from '../../core';
import * as cxapi from '../../cx-api';
import * as synthetics from '../lib';

describe(synthetics.Code.fromInline, () => {
  test('fromInline works', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // WHEN
    const inline = synthetics.Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`);

    // THEN
    expect(inline.bind(stack, 'index.handler', synthetics.RuntimeFamily.NODEJS).inlineCode).toEqual(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`);
  });

  test('fails if empty', () => {
    expect(() => synthetics.Code.fromInline(''))
      .toThrow('Canary inline code cannot be empty');
  });

  test('fails if handler is not "index.handler"', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // THEN
    expect(() => synthetics.Code.fromInline('code').bind(stack, 'canary.handler', synthetics.RuntimeFamily.NODEJS))
      .toThrow('The handler for inline code must be "index.handler" (got "canary.handler")');
  });
});

describe(synthetics.Code.fromAsset, () => {
  test('fromAsset works for node runtimes', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // WHEN
    const directoryAsset = synthetics.Code.fromAsset(path.join(__dirname, 'canaries'));
    new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
      Code: {
        Handler: 'canary.handler',
        S3Bucket: stack.resolve(directoryAsset.bind(stack, 'canary.handler', synthetics.RuntimeFamily.NODEJS).s3Location?.bucketName),
        S3Key: stack.resolve(directoryAsset.bind(stack, 'canary.handler', synthetics.RuntimeFamily.NODEJS).s3Location?.objectKey),
      },
    });
  });

  test('fromAsset works for python runtimes', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // WHEN
    const directoryAsset = synthetics.Code.fromAsset(path.join(__dirname, 'canaries'));
    new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
      runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_2_0,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
      Code: {
        Handler: 'canary.handler',
        S3Bucket: stack.resolve(directoryAsset.bind(stack, 'canary.handler', synthetics.RuntimeFamily.PYTHON).s3Location?.bucketName),
        S3Key: stack.resolve(directoryAsset.bind(stack, 'canary.handler', synthetics.RuntimeFamily.PYTHON).s3Location?.objectKey),
      },
    });
  });

  test('only one Asset object gets created even if multiple canaries use the same AssetCode', () => {
    // GIVEN
    const app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const stack = new Stack(app, 'canaries');

    // WHEN
    const directoryAsset = synthetics.Code.fromAsset(path.join(__dirname, 'canaries'));
    new synthetics.Canary(stack, 'Canary1', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });

    new synthetics.Canary(stack, 'Canary2', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });

    // THEN
    const assembly = app.synth();
    const synthesized = assembly.stacks[0];

    expect(synthesized.assets.length).toEqual(1);
  });

  test('works when stack is a part of a stage', () => {
    // GIVEN
    const app = new App();
    const stage1 = new Stage(app, 'Stage1');
    const stage2 = new Stage(stage1, 'Stage2');
    const stack = new Stack(stage2);

    // WHEN
    const directoryAsset = synthetics.Code.fromAsset(path.join(__dirname, 'canaries'));
    new synthetics.Canary(stack, 'Canary1', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
  });

  test('fails if path does not exist', () => {
    const assetPath = path.join(__dirname, 'does-not-exist');
    expect(() => synthetics.Code.fromAsset(assetPath))
      .toThrow(`${assetPath} is not a valid path`);
  });

  test('fails if non-zip asset is used', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // THEN
    const assetPath = path.join(__dirname, 'canaries', 'nodejs', 'node_modules', 'canary.js');
    expect(() => synthetics.Code.fromAsset(assetPath).bind(stack, 'canary.handler', synthetics.RuntimeFamily.NODEJS))
      .toThrow(`Asset must be a .zip file or a directory (${assetPath})`);
  });

  test('fails if node runtime and "nodejs/node_modules" folder structure not used', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // THEN
    const assetPath = path.join(__dirname, 'canaries', 'nodejs', 'node_modules');
    expect(() => synthetics.Code.fromAsset(assetPath).bind(stack, 'canary.handler', synthetics.RuntimeFamily.NODEJS))
      .toThrow(`The canary resource requires that the handler is present at "nodejs/node_modules/canary.js" but not found at ${assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Nodejs.html)`);
  });

  test('fails if python runtime and "python" folder structure not used', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // THEN
    const assetPath = path.join(__dirname, 'canaries', 'python');
    expect(() => synthetics.Code.fromAsset(assetPath).bind(stack, 'canary.handler', synthetics.RuntimeFamily.PYTHON))
      .toThrow(`The canary resource requires that the handler is present at "python/canary.py" but not found at ${assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Python.html)`);
  });

  test('fails if handler is specified incorrectly', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // THEN
    const assetPath = path.join(__dirname, 'canaries', 'nodejs', 'node_modules');
    expect(() => synthetics.Code.fromAsset(assetPath).bind(stack, 'incorrect.handler', synthetics.RuntimeFamily.NODEJS))
      .toThrow(`The canary resource requires that the handler is present at "nodejs/node_modules/incorrect.js" but not found at ${assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Nodejs.html)`);
  });

  test('passes if bundling is specified', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // WHEN
    const assetPath = path.join(__dirname, 'canaries', 'nodejs', 'node_modules');
    const code = synthetics.Code.fromAsset(assetPath, {
      bundling: {
        image: DockerImage.fromRegistry('dummy'),
        local: {
          tryBundle(outputDir) {
            const stageDir = path.join(outputDir, 'nodejs', 'node_modules');
            fs.mkdirSync(path.join(outputDir, 'nodejs'));
            fs.mkdirSync(stageDir);
            fs.copyFileSync(path.join(assetPath, 'canary.js'), path.join(stageDir, 'canary.js'));
            return true;
          },
        },
      },
    });

    // THEN
    expect(() => code.bind(stack, 'canary.handler', synthetics.RuntimeFamily.NODEJS))
      .not.toThrow();
  });

  test('fails if bundling is specified but folder structure is wrong', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');

    // WHEN
    const assetPath = path.join(__dirname, 'canaries', 'nodejs', 'node_modules');
    const code = synthetics.Code.fromAsset(assetPath, {
      bundling: {
        image: DockerImage.fromRegistry('dummy'),
        local: {
          tryBundle(outputDir) {
            fs.copyFileSync(path.join(assetPath, 'canary.js'), path.join(outputDir, 'canary.js'));
            return true;
          },
        },
      },
    });

    // THEN
    expect(() => code.bind(stack, 'canary.handler', synthetics.RuntimeFamily.NODEJS))
      .toThrow(`The canary resource requires that the handler is present at "nodejs/node_modules/canary.js" but not found at ${assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Nodejs.html)`);
  });
});

describe(synthetics.Code.fromBucket, () => {
  test('fromBucket works', () => {
    // GIVEN
    const stack = new Stack(new App(), 'canaries');
    const bucket = new s3.Bucket(stack, 'CodeBucket');

    // WHEN
    const code = synthetics.Code.fromBucket(bucket, 'code.js');
    const codeConfig = code.bind(stack, 'code.handler', synthetics.RuntimeFamily.NODEJS);

    // THEN
    expect(codeConfig.s3Location?.bucketName).toEqual(bucket.bucketName);
    expect(codeConfig.s3Location?.objectKey).toEqual('code.js');
  });
});
