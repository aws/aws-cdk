import { ComponentType, Runtime } from '../../../lib/custom-resources-framework/config';
import { buildComponentName, toLambdaRuntime } from '../../../lib/custom-resources-framework/utils/framework-utils';

describe('to lambda runtime', () => {
  test.each([
    [Runtime.NODEJS_18_X, 'lambda.Runtime.NODEJS_18_X'],
    [Runtime.PYTHON_3_9, 'lambda.Runtime.PYTHON_3_9'],
    [Runtime.PYTHON_3_10, 'lambda.Runtime.PYTHON_3_10'],
  ])('to lambda %s runtime', (runtime, expectedRuntime) => {
    expect(toLambdaRuntime(runtime)).toEqual(expectedRuntime);
  });
});

describe('build compoonent name', () => {
  test('build function component name', () => {
    // GIVEN
    const fqn = 'test/aws-cdk-provider';
    const type = ComponentType.FUNCTION;
    const entrypoint = 'index.handler';

    // WHEN
    const name = buildComponentName(fqn, type, entrypoint);

    // THEN
    expect(name).toEqual('AwsCdkFunction');
  });

  test('build singleton function component name', () => {
    // GIVEN
    const fqn = 'test/aws-cdk-provider';
    const type = ComponentType.SINGLETON_FUNCTION;
    const entrypoint = 'index.handler';

    // WHEN
    const name = buildComponentName(fqn, type, entrypoint);

    // THEN
    expect(name).toEqual('AwsCdkSingletonFunction');
  });

  test('build custom resource provider component name', () => {
    // GIVEN
    const fqn = 'test/aws-cdk-provider';
    const type = ComponentType.CUSTOM_RESOURCE_PROVIDER;
    const entrypoint = 'index.handler';

    // WHEN
    const name = buildComponentName(fqn, type, entrypoint);

    // THEN
    expect(name).toEqual('AwsCdkProvider');
  });

  test('with non-default handler', () => {
    // GIVEN
    const fqn = 'test/aws-cdk-provider';
    const type = ComponentType.FUNCTION;
    const entrypoint = 'index.onEventHandler';

    // WHEN
    const name = buildComponentName(fqn, type, entrypoint);

    // THEN
    expect(name).toEqual('AwsCdkOnEventFunction');
  });
});
