import { renderCallStackJustMyCode } from '../lib';

describe('renderCallStackJustMyCode', () => {
  test('renders namespaced packages correctly', () => {
    const stack: Parameters<typeof renderCallStackJustMyCode>[0] = [
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/core/lib/asset-staging.js',
        functionName: 'AssetStaging.bundle',
        sourceLocation: '2:512',
      },
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/aws-lambda/lib/function.js',
        functionName: 'new Function2',
        sourceLocation: '1:16236',
      },
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/core/lib/prop-injectable.js',
        functionName: 'new Function2',
        sourceLocation: '1:726',
      },
      {
        fileName:
          '/path/to/project/node_modules/@aws-cdk/aws-lambda-python-alpha/lib/function.ts',
        functionName: 'new PythonFunction',
        sourceLocation: '70:5',
      },
      {
        fileName:
          '/path/to/project/myfile.js',
        functionName: 'new PythonFunction',
        sourceLocation: '70:5',
      },
    ];

    expect(renderCallStackJustMyCode(stack, false)).toEqual([
      '...aws-cdk-lib, new PythonFunction in @aws-cdk/aws-lambda-python-alpha...',
      'new PythonFunction (/path/to/project/myfile.js:70:5)',
    ]);
  });

  test('adds a hint if there are not enough stack frames to see Just My Code', () => {
    const stack: Parameters<typeof renderCallStackJustMyCode>[0] = [
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/core/lib/asset-staging.js',
        functionName: 'AssetStaging.bundle',
        sourceLocation: '2:512',
      },
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/aws-lambda/lib/function.js',
        functionName: 'new Function2',
        sourceLocation: '1:16236',
      },
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/core/lib/prop-injectable.js',
        functionName: 'new Function2',
        sourceLocation: '1:726',
      },
      {
        fileName:
          '/path/to/project/node_modules/@aws-cdk/aws-lambda-python-alpha/lib/function.ts',
        functionName: 'new PythonFunction',
        sourceLocation: '70:5',
      },
    ];

    expect(renderCallStackJustMyCode(stack, false)).toEqual([
      '...aws-cdk-lib, new PythonFunction in @aws-cdk/aws-lambda-python-alpha...',
      expect.stringContaining('use --stack-trace-limit to capture more'),
    ]);
  });
});
