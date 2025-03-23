import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
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

    const pythonFunction312 = new lambda.PythonFunction(this, 'my_handler_inline_python_312', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_12,
    });
    this.functionNames.push(pythonFunction312.functionName);

    const pythonFunction313 = new lambda.PythonFunction(this, 'my_handler_inline_python_313', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_13,
    });
    this.functionNames.push(pythonFunction313.functionName);

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

    const pythonFunction312WithHashes = new lambda.PythonFunction(this, 'my_handler_inline_with_hashes_python_312', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_12,
      bundling: {
        poetryIncludeHashes: true,
      },
    });
    this.functionNames.push(pythonFunction312WithHashes.functionName);

    const pythonFunction313WithHashes = new lambda.PythonFunction(this, 'my_handler_inline_with_hashes_python_313', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_13,
      bundling: {
        poetryIncludeHashes: true,
      },
    });
    this.functionNames.push(pythonFunction313WithHashes.functionName);

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

    const pythonFunction312Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes_python_312', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_12,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction312Excludes.functionName);

    const pythonFunction313Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes_python_313', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_13,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction313Excludes.functionName);

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

    const pythonFunction312WithHashesExcludes = new lambda.PythonFunction(this, 'my_handler_with_hashes_excludes_python_312', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_12,
      bundling: {
        poetryIncludeHashes: true,
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction312WithHashesExcludes.functionName);

    const pythonFunction313WithHashesExcludes = new lambda.PythonFunction(this, 'my_handler_with_hashes_excludes_python_313', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_13,
      bundling: {
        poetryIncludeHashes: true,
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction313WithHashesExcludes.functionName);

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

    const pythonFunction312WithoutUrls = new lambda.PythonFunction(this, 'my_handler_inline_without_urls_python_312', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_12,
      bundling: {
        poetryWithoutUrls: true,
      },
    });
    this.functionNames.push(pythonFunction312WithoutUrls.functionName);

    const pythonFunction313WithoutUrls = new lambda.PythonFunction(this, 'my_handler_inline_without_urls_python_313', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      index: 'basic.py',
      runtime: Runtime.PYTHON_3_13,
      bundling: {
        poetryWithoutUrls: true,
      },
    });
    this.functionNames.push(pythonFunction313WithoutUrls.functionName);

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
  })).waitForAssertions({
    interval: Duration.seconds(30),
    totalTimeout: Duration.minutes(5),
  });
});
