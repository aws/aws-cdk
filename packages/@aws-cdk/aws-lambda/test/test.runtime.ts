import {Test, testCase} from 'nodeunit';
import {RuntimeFamily} from "../lib";
import lambda = require('../lib');

export = testCase({
  'runtimes are equal for different instances'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', RuntimeFamily.PYTHON, {supportsInlineCode: true});
    const runtime2 = new lambda.Runtime('python3.7', RuntimeFamily.PYTHON, {supportsInlineCode: true});

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, true, 'Runtimes should be equal');

    test.done();
  },
  'runtimes are equal for same instance'(test: Test) {
    // GIVEN
    const runtime = new lambda.Runtime('python3.7', RuntimeFamily.PYTHON, {supportsInlineCode: true});

    // WHEN
    const result = runtime.runtimeEquals(runtime);

    // THEN
    test.strictEqual(result, true, 'Runtimes should be equal');

    test.done();
  },
  'unequal when name changes'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', RuntimeFamily.PYTHON, {supportsInlineCode: true});
    const runtime2 = new lambda.Runtime('python3.6', RuntimeFamily.PYTHON, {supportsInlineCode: true});

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, false, 'Runtimes should be unequal when name changes');

    test.done();
  },
  'unequal when family changes'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', RuntimeFamily.PYTHON, {supportsInlineCode: true});
    const runtime2 = new lambda.Runtime('python3.7', RuntimeFamily.JAVA, {supportsInlineCode: true});

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, false, 'Runtimes should be unequal when family changes');

    test.done();
  },
  'unequal when supportsInlineCode changes'(test: Test) {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', RuntimeFamily.PYTHON, {supportsInlineCode: true});
    const runtime2 = new lambda.Runtime('python3.7', RuntimeFamily.PYTHON, {supportsInlineCode: false});

    // WHEN
    const result = runtime1.runtimeEquals(runtime2);

    // THEN
    test.strictEqual(result, false, 'Runtimes should be unequal when supportsInlineCode changes');

    test.done();
  },
});
