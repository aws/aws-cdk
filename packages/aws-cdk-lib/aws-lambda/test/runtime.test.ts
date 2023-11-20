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
  test('python 2.7 is deprecated', () => {
    expect(lambda.Runtime.PYTHON_2_7.isDeprecated).toEqual(true);
  });

  test('python 3.6 is deprecated', () => {
    expect(lambda.Runtime.PYTHON_3_6.isDeprecated).toEqual(true);
  });

  test('nodejs is deprecated', () => {
    expect(lambda.Runtime.NODEJS.isDeprecated).toEqual(true);
  });

  test('nodejs 4.3 is deprecated', () => {
    expect(lambda.Runtime.NODEJS_4_3.isDeprecated).toEqual(true);
  });

  test('nodejs 6.10 is deprecated', () => {
    expect(lambda.Runtime.NODEJS_6_10.isDeprecated).toEqual(true);
  });

  test('nodejs 8.10 is deprecated', () => {
    expect(lambda.Runtime.NODEJS_8_10.isDeprecated).toEqual(true);
  });

  test('nodejs 10.x is deprecated', () => {
    expect(lambda.Runtime.NODEJS_10_X.isDeprecated).toEqual(true);
  });

  test('nodejs 12.x is deprecated', () => {
    expect(lambda.Runtime.NODEJS_12_X.isDeprecated).toEqual(true);
  });

  test('nodejs 14.x is deprecated', () => {
    expect(lambda.Runtime.NODEJS_14_X.isDeprecated).toEqual(true);
  });

  test('.net core 1.0 is deprecated', () => {
    expect(lambda.Runtime.DOTNET_CORE_1.isDeprecated).toEqual(true);
  });

  test('.net core 2.0 is deprecated', () => {
    expect(lambda.Runtime.DOTNET_CORE_2.isDeprecated).toEqual(true);
  });

  test('.net core 2.1 is deprecated', () => {
    expect(lambda.Runtime.DOTNET_CORE_2_1.isDeprecated).toEqual(true);
  });

  test('.net core 3.1 is deprecated', () => {
    expect(lambda.Runtime.DOTNET_CORE_3_1.isDeprecated).toEqual(true);
  });

  test('go 1.x is deprecated', () => {
    expect(lambda.Runtime.GO_1_X.isDeprecated).toEqual(true);
  });

  test('ruby 2.5 is deprecated', () => {
    expect(lambda.Runtime.RUBY_2_5.isDeprecated).toEqual(true);
  });

  test('custom provided runtime is deprecated', () => {
    expect(lambda.Runtime.PROVIDED.isDeprecated).toEqual(true);
  });
});
