import { captureStackTrace, renderCallStackJustMyCode } from '../lib';

describe('captureStackTrace with jsii host trace', () => {
  const SYMBOL = Symbol.for('jsii.context.hostStackTrace');

  afterEach(() => {
    delete (global as any)[SYMBOL];
  });

  test('appends jsii host stack trace frames when present', () => {
    (global as any)[SYMBOL] = [
      ['/home/user/app.py', 42, 8, 'MyStack.__init__'],
      ['/home/user/main.py', 10, 1, '<module>'],
    ];

    const trace = captureStackTrace(captureStackTrace);

    expect(trace).toEqual(expect.arrayContaining([
      'MyStack.__init__ (/home/user/app.py:42:8)',
      '<module> (/home/user/main.py:10:1)',
    ]));
    const hostIndex = trace.indexOf('MyStack.__init__ (/home/user/app.py:42:8)');
    const moduleIndex = trace.indexOf('<module> (/home/user/main.py:10:1)');
    expect(hostIndex).toBeGreaterThan(0);
    expect(moduleIndex).toBe(hostIndex + 1);
    expect(moduleIndex).toBe(trace.length - 1);
  });

  test('returns only internal trace when jsii host trace is not set', () => {
    const trace = captureStackTrace(captureStackTrace);

    for (const frame of trace) {
      expect(frame).not.toMatch(/\.py:\d+:\d+/);
    }
  });

  test('handles empty jsii host trace array', () => {
    (global as any)[SYMBOL] = [];

    const trace = captureStackTrace(captureStackTrace);

    for (const frame of trace) {
      expect(frame).not.toMatch(/\.py:\d+:\d+/);
    }
  });

  test('formats external frame with all components', () => {
    (global as any)[SYMBOL] = [
      ['src/my_stack.py', 100, 12, 'MyStack.add_bucket'],
    ];

    const trace = captureStackTrace(captureStackTrace);

    expect(trace[trace.length - 1]).toBe('MyStack.add_bucket (src/my_stack.py:100:12)');
  });
});

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

  test('filters out jsii runtime (bundled code) frames', () => {
    const stack: Parameters<typeof renderCallStackJustMyCode>[0] = [
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/aws-sqs/lib/queue.js',
        functionName: 'new Queue',
        sourceLocation: '2:512',
      },
      {
        fileName: '/private/var/folders/zv/tmpjph88goj/lib/program.js',
        functionName: 'Kernel._Kernel_create',
        sourceLocation: '1:61224',
      },
      {
        fileName: '/private/var/folders/zv/tmpjph88goj/lib/program.js',
        functionName: 'Kernel.create',
        sourceLocation: '1:51955',
      },
      {
        fileName: '/private/var/folders/zv/tmpjph88goj/lib/program.js',
        functionName: 'KernelHost.processRequest',
        sourceLocation: '1:212180',
      },
      {
        fileName: '/private/var/folders/zv/tmpjph88goj/lib/program.js',
        functionName: 'KernelHost.run',
        sourceLocation: '1:211164',
      },
      {
        fileName: '/private/var/folders/zv/tmpjph88goj/lib/program.js',
        functionName: 'Immediate._onImmediate',
        sourceLocation: '1:211208',
      },
    ];

    expect(renderCallStackJustMyCode(stack, false)).toEqual([
      '...aws-cdk-lib, jsii runtime...',
      expect.stringContaining('use --stack-trace-limit to capture more'),
    ]);
  });

  test('filters jsii runtime frames between user code and external trace', () => {
    const stack: Parameters<typeof renderCallStackJustMyCode>[0] = [
      {
        fileName: '/path/to/project/node_modules/aws-cdk-lib/aws-sqs/lib/queue.js',
        functionName: 'new Queue',
        sourceLocation: '2:512',
      },
      {
        fileName: '/path/to/project/myfile.ts',
        functionName: 'myFunction',
        sourceLocation: '10:5',
      },
      {
        fileName: '/private/var/folders/zv/tmpjph88goj/lib/program.js',
        functionName: 'Kernel._Kernel_create',
        sourceLocation: '1:61224',
      },
      {
        fileName: '/private/var/folders/zv/tmpjph88goj/lib/program.js',
        functionName: 'KernelHost.run',
        sourceLocation: '1:211164',
      },
    ];

    expect(renderCallStackJustMyCode(stack, false)).toEqual([
      '...new Queue in aws-cdk-lib...',
      'myFunction (/path/to/project/myfile.ts:10:5)',
      '...jsii runtime...',
    ]);
  });

  test('does not filter user bundled code (e.g. esbuild output)', () => {
    const stack: Parameters<typeof renderCallStackJustMyCode>[0] = [
      {
        fileName: '/path/to/project/dist/bundle.js',
        functionName: 'MyStack.constructor',
        sourceLocation: '1:84320',
      },
      {
        fileName: '/path/to/project/dist/bundle.js',
        functionName: 'createApp',
        sourceLocation: '1:91000',
      },
    ];

    expect(renderCallStackJustMyCode(stack, false)).toEqual([
      'MyStack.constructor (/path/to/project/dist/bundle.js:1:84320)',
      'createApp (/path/to/project/dist/bundle.js:1:91000)',
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
      '...aws-cdk-lib, @aws-cdk/aws-lambda-python-alpha...',
      expect.stringContaining('use --stack-trace-limit to capture more'),
    ]);
  });
});
