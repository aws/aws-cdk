import { Test, testCase } from 'nodeunit';
import * as lambda from '../lib';

export = testCase({
  'runtimes are equal for different instances'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, true, 'Runtimes should be equal');

    test.done();
  },
  'runtimes are equal for same instance'(test: Test) {
    // GIVEN
    const runtime = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });

    // WHEN
    const result = runtime.runtimeEquals(runtime);

    // THEN
    test.strictEqual(result, true, 'Runtimes should be equal');

    test.done();
  },
  'unequal when name changes'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.6', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, false, 'Runtimes should be unequal when name changes');

    test.done();
  },
  'unequal when family changes'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.JAVA, { supportsInlineCode: true });

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, false, 'Runtimes should be unequal when family changes');

    test.done();
  },
  'unequal when supportsInlineCode changes'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: false });

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, false, 'Runtimes should be unequal when supportsInlineCode changes');

    test.done();
  },
  'bundlingDockerImage points to AWS SAM build image'(test: Test) {
    // GIVEN
    const runtime = new lambda.Runtime('my-runtime-name');

    // THEN
    test.equal(runtime.bundlingDockerImage.image, 'amazon/aws-sam-cli-build-image-my-runtime-name');

    test.done();
  },
  'overridde to bundlingDockerImage points to the correct image'(test: Test) {
    // GIVEN
    const runtime = new lambda.Runtime('my-runtime-name', undefined, {
      bundlingDockerImage: 'my-docker-image',
    });

    // THEN
    test.equal(runtime.bundlingDockerImage.image, 'my-docker-image');

    test.done();
  },
  'dotnetcore and go have overridden images'(test: Test) {
    test.equal(lambda.Runtime.DOTNET_CORE_3_1.bundlingDockerImage.image, 'lambci/lambda:build-dotnetcore3.1');
    test.equal(lambda.Runtime.DOTNET_CORE_2_1.bundlingDockerImage.image, 'lambci/lambda:build-dotnetcore2.1');
    test.equal(lambda.Runtime.GO_1_X.bundlingDockerImage.image, 'lambci/lambda:build-go1.x');
    test.done();
  },
});
