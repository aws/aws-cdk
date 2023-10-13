import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * aws lambda invoke --function-name <function name> --invocation-type Event --payload $(base64 <<<''OK'') response.json
 */

class TestStack extends Stack {
  public readonly functionNames: string[] = [];
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pythonFunction37 = new lambda.PythonFunction(this, 'my_handler_inline_python_37', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_7,
    });
    this.functionNames.push(pythonFunction37.functionName);

    const pythonFunction38 = new lambda.PythonFunction(this, 'my_handler_inline_python_38', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_8,
    });
    this.functionNames.push(pythonFunction38.functionName);

    const pythonFunction39 = new lambda.PythonFunction(this, 'my_handler_inline_python_39', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_9,
    });
    this.functionNames.push(pythonFunction39.functionName);

    const pythonFunction310 = new lambda.PythonFunction(this, 'my_handler_inline_python_310', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_10,
    });
    this.functionNames.push(pythonFunction310.functionName);

    const pythonFunction311 = new lambda.PythonFunction(this, 'my_handler_inline_python_311', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_11,
    });
    this.functionNames.push(pythonFunction311.functionName);

    const pythonFunction37WithHashes = new lambda.PythonFunction(this, 'my_handler_inline_with_hashes_python_37', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_7,
      bundling: {
        poetryIncludeHashes: true,
      },
    });
    this.functionNames.push(pythonFunction37WithHashes.functionName);

    const pythonFunction38WithHashes = new lambda.PythonFunction(this, 'my_handler_inline_with_hashes_python_38', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_8,
      bundling: {
        poetryIncludeHashes: true,
      },
    });
    this.functionNames.push(pythonFunction38WithHashes.functionName);

    const pythonFunction39WithHashes = new lambda.PythonFunction(this, 'my_handler_inline_with_hashes_python_39', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        poetryIncludeHashes: true,
      },
    });
    this.functionNames.push(pythonFunction39WithHashes.functionName);

    const pythonFunction310WithHashes = new lambda.PythonFunction(this, 'my_handler_inline_with_hashes_python_310', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_10,
      bundling: {
        poetryIncludeHashes: true,
      },
    });
    this.functionNames.push(pythonFunction310WithHashes.functionName);

    const pythonFunction311WithHashes = new lambda.PythonFunction(this, 'my_handler_inline_with_hashes_python_311', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_11,
      bundling: {
        poetryIncludeHashes: true,
      },
    });
    this.functionNames.push(pythonFunction311WithHashes.functionName);

    const pythonFunction37Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes_python_37', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_7,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction37Excludes.functionName);

    const pythonFunction38Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes_python_38', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_8,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction38Excludes.functionName);

    const pythonFunction39Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes_python_39', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction39Excludes.functionName);

    const pythonFunction310Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes_python_310', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_10,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction310Excludes.functionName);

    const pythonFunction311Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes_python_311', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_11,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction311Excludes.functionName);

    const pythonFunction37WithHashesExcludes = new lambda.PythonFunction(this, 'my_handler_with_hashes_excludes_python_37', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_7,
      bundling: {
        poetryIncludeHashes: true,
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction37WithHashesExcludes.functionName);

    const pythonFunction38WithHashesExcludes = new lambda.PythonFunction(this, 'my_handler_with_hashes_excludes_python_38', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_8,
      bundling: {
        poetryIncludeHashes: true,
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction38WithHashesExcludes.functionName);

    const pythonFunction39WithHashesExcludes = new lambda.PythonFunction(this, 'my_handler_with_hashes_excludes_python_39', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        poetryIncludeHashes: true,
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction39WithHashesExcludes.functionName);

    const pythonFunction310WithHashesExcludes = new lambda.PythonFunction(this, 'my_handler_with_hashes_excludes_python_310', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_10,
      bundling: {
        poetryIncludeHashes: true,
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction310WithHashesExcludes.functionName);

    const pythonFunction311WithHashesExcludes = new lambda.PythonFunction(this, 'my_handler_with_hashes_excludes_python_311', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_11,
      bundling: {
        poetryIncludeHashes: true,
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction311WithHashesExcludes.functionName);

    const pythonFunction37WithoutUrls = new lambda.PythonFunction(this, 'my_handler_inline_without_urls_python_37', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_7,
      bundling: {
        poetryWithoutUrls: true,
      },
    });
    this.functionNames.push(pythonFunction37WithoutUrls.functionName);

    const pythonFunction38WithoutUrls = new lambda.PythonFunction(this, 'my_handler_inline_without_urls_python_38', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_8,
      bundling: {
        poetryWithoutUrls: true,
      },
    });
    this.functionNames.push(pythonFunction38WithoutUrls.functionName);

    const pythonFunction39WithoutUrls = new lambda.PythonFunction(this, 'my_handler_inline_without_urls_python_39', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        poetryWithoutUrls: true,
      },
    });
    this.functionNames.push(pythonFunction39WithoutUrls.functionName);

    const pythonFunction310WithoutUrls = new lambda.PythonFunction(this, 'my_handler_inline_without_urls_python_310', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_10,
      bundling: {
        poetryWithoutUrls: true,
      },
    });
    this.functionNames.push(pythonFunction310WithoutUrls.functionName);

    const pythonFunction311WithoutUrls = new lambda.PythonFunction(this, 'my_handler_inline_without_urls_python_311', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_11,
      bundling: {
        poetryWithoutUrls: true,
      },
    });
    this.functionNames.push(pythonFunction311WithoutUrls.functionName);
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-lambda-python-poetry');

const integ = new IntegTest(app, 'poetry', {
  testCases: [testCase],
  // disabling update workflow because we don't want to include the assets in the snapshot
  // python bundling changes the asset hash pretty frequently
  stackUpdateWorkflow: false,
});

testCase.functionNames.forEach(functionName => {
  const invoke = integ.assertions.invokeFunction({
    functionName: functionName,
  });

  invoke.expect(ExpectedResult.objectLike({
    Payload: '200',
  }));
});

app.synth();
