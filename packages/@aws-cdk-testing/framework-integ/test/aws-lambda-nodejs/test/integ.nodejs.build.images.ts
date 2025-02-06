import * as path from 'path';
import * as fs from 'fs';
import { App, Stack, StackProps, ValidationError } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  public lambdaFunctions: IFunction[] = [];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const runtimes: Runtime[]= [
      Runtime.NODEJS_18_X, Runtime.NODEJS_20_X, Runtime.NODEJS_LATEST, Runtime.NODEJS_22_X,
    ];

    const uniqueRuntimes: Runtime[] = runtimes.filter((value, index, array) => array.findIndex(value1 => value1.runtimeEquals(value)) === index);

    uniqueRuntimes.forEach((runtime) => {
      this.lambdaFunctions.push(new lambdaNodeJs.NodejsFunction(this, `func-${runtime.name}`, {
        entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
        runtime: runtime,
        bundling: {
          minify: true,
          sourceMap: true,
          sourceMapMode: lambdaNodeJs.SourceMapMode.BOTH,
        },
      }));
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-latest');
const integ = new IntegTest(app, 'LambdaNodeJsLatestInteg', {
  testCases: [stack],
  diffAssets: true,
});

stack.lambdaFunctions.forEach(func=> {
  const response = integ.assertions.invokeFunction({
    functionName: func.functionName,
  });

  response.expect(ExpectedResult.objectLike({
    // expect invoking without error
    StatusCode: 200,
    ExecutedVersion: '$LATEST',
  }));
});

// Ensure that the code is bundled
const assembly = app.synth();

stack.lambdaFunctions.forEach((func) => {
  const template = assembly.getStackArtifact(stack.artifactId).template;
  const resourceName = stack.getLogicalId(func.node.defaultChild as lambda.CfnFunction);
  const resource = template.Resources[resourceName];
  
  if (!resource || resource.Type !== 'AWS::Lambda::Function') {
    throw new Error(`Could not find Lambda function resource for ${func.functionName}`);
  }

  const s3Bucket = resource.Properties.Code.S3Bucket;
  const s3Key = resource.Properties.Code.S3Key;

  if (!s3Bucket || !s3Key) {
    throw new Error(`Could not find S3 location for function ${func.functionName}`);
  }

  const assetId = s3Key.split('.')[0]; // S3Key format is <hash>.zip"
  const assetDir = path.join(assembly.directory, `asset.${assetId}`);

  try {
    if (!fs.existsSync(assetDir) || !fs.statSync(assetDir).isDirectory()) {
      throw new Error(`Asset directory does not exist for function ${func.functionName}: ${assetDir}`);
    }

    const indexPath = path.join(assetDir, 'index.js');
    if (!fs.existsSync(indexPath)) {
      throw new Error(`index.js not found in asset directory for function ${func.functionName}`);
    }

    verifyBundledContent(indexPath, func.functionName);

    console.log(`Bundling verification passed for function ${func.functionName}`);
  } catch (error) {
    console.error(`Error verifying bundled content for function ${func.functionName}:`, error);
    throw error;
  }
});


function verifyBundledContent(filePath: string, functionName: string) {
  const bundledContent = fs.readFileSync(filePath, 'utf-8');

  if (!bundledContent.includes('exports.handler =')) {
    throw new Error(`Bundled content does not contain expected handler export for function ${functionName}`);
  }

  if (bundledContent.includes('import ')) {
    throw new Error(`Bundled content contains unexpected import statement for function ${functionName}`);
  }

  if (!bundledContent.includes('//# sourceMappingURL=')) {
    throw new Error(`Bundled content does not contain source map for function ${functionName}`);
  }
}