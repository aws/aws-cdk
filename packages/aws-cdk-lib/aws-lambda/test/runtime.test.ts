import * as lambda from '../lib';

describe('runtime', () => {
  test('runtimes are equal for different instances', () => {
    // GIVEN
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });

    // WHEN
    expect(runtime1.runtimeEquals(runtime2)).toBe(true);
  });

  test('runtimes are equal for same instance', () => {
    const runtime = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });

    expect(runtime.runtimeEquals(runtime)).toBe(true);
  });

  test('unequal when name changes', () => {
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.6', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });

    expect(runtime1.runtimeEquals(runtime2)).toBe(false);
  });

  test('unequal when family changes', () => {
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.JAVA, { supportsInlineCode: true });

    expect(runtime1.runtimeEquals(runtime2)).toBe(false);
  });

  test('unequal when supportsInlineCode changes', () => {
    const runtime1 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: true });
    const runtime2 = new lambda.Runtime('python3.7', lambda.RuntimeFamily.PYTHON, { supportsInlineCode: false });

    expect(runtime1.runtimeEquals(runtime2)).toBe(false);
  });

  test('bundlingDockerImage points to AWS SAM build image', () => {
    // GIVEN
    const runtime = new lambda.Runtime('my-runtime-name');

    // THEN
    expect(runtime.bundlingDockerImage.image).toEqual('public.ecr.aws/sam/build-my-runtime-name');
  });

  test('overridde to bundlingDockerImage points to the correct image', () => {
    // GIVEN
    const runtime = new lambda.Runtime('my-runtime-name', undefined, {
      bundlingDockerImage: 'my-docker-image',
    });

    // THEN
    expect(runtime.bundlingDockerImage.image).toEqual('my-docker-image');
  });
});

describe('deprecated runtimes', () => {
  test.each([
    [lambda.Runtime.PYTHON_2_7],
    [lambda.Runtime.PYTHON_3_6],
    [lambda.Runtime.NODEJS],
    [lambda.Runtime.NODEJS_4_3],
    [lambda.Runtime.NODEJS_6_10],
    [lambda.Runtime.NODEJS_8_10],
    [lambda.Runtime.NODEJS_10_X],
    [lambda.Runtime.NODEJS_12_X],
    [lambda.Runtime.NODEJS_14_X],
    [lambda.Runtime.DOTNET_CORE_1],
    [lambda.Runtime.DOTNET_CORE_2],
    [lambda.Runtime.DOTNET_CORE_2_1],
    [lambda.Runtime.DOTNET_CORE_3_1],
    [lambda.Runtime.GO_1_X],
    [lambda.Runtime.RUBY_2_5],
    [lambda.Runtime.PROVIDED],
  ])('%s is deprecated', (runtime) => {
    expect(runtime.isDeprecated).toEqual(true);
  });
});
