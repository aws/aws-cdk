import { Bucket } from 'aws-cdk-lib/aws-s3';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as os from 'os';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'TestBucketDeploymentLargeFile');
const bucket = new Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY, // Allow bucket deletion
  autoDeleteObjects: true, // Delete objects when bucket is deleted
});

// Create a temporary directory for our large files
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-large-files-'));

// Generate a large JSON file (10MB) programmatically
const largeJsonFilePath = path.join(tempDir, 'large-file.json');
const largeTextFilePath = path.join(tempDir, 'large-file.txt');

// Function to generate a large file with deterministic content
function generateLargeFile(filePath: string, sizeInMB: number, isJson: boolean): void {
  const fd = fs.openSync(filePath, 'w');

  // For JSON files, start with a more complex structure
  if (isJson) {
    fs.writeSync(fd, '{\n  "metadata": {\n');
    fs.writeSync(fd, '    "version": "1.0",\n');
    fs.writeSync(fd, '    "generated": "' + new Date().toISOString() + '",\n');
    fs.writeSync(fd, '    "description": "Large test file for CDK integration tests"\n');
    fs.writeSync(fd, '  },\n');
    fs.writeSync(fd, '  "configuration": {\n');
    fs.writeSync(fd, '    "settings": {\n');
    fs.writeSync(fd, '      "enabled": true,\n');
    fs.writeSync(fd, '      "maxSize": 1024,\n');
    fs.writeSync(fd, '      "timeout": 30000\n');
    fs.writeSync(fd, '    },\n');
    fs.writeSync(fd, '    "features": ["feature1", "feature2", "feature3"]\n');
    fs.writeSync(fd, '  },\n');
    fs.writeSync(fd, '  "data": [\n');
  }

  // Generate content in chunks to avoid memory issues
  const chunkSize = 1024 * 100; // 100KB chunks
  const totalBytes = sizeInMB * 1024 * 1024;
  let bytesWritten = isJson ? 200 : 0; // Account for JSON opening structure

  // Create a deterministic pattern based on position
  for (let i = 0; bytesWritten < totalBytes; i++) {
    // Generate a chunk of data with a deterministic pattern
    let chunk = '';
    const lineLength = 100;
    const linesPerChunk = Math.floor(chunkSize / (lineLength + 1));

    for (let line = 0; line < linesPerChunk && bytesWritten < totalBytes; line++) {
      const lineNum = i * linesPerChunk + line;
      const linePrefix = `Line${lineNum.toString().padStart(8, '0')}: `;

      // Fill the rest of the line with a repeating pattern
      let lineContent = linePrefix;
      while (lineContent.length < lineLength) {
        // Use a hash of the line number for deterministic content
        const hash = crypto.createHash('sha256').update(lineNum.toString()).digest('hex');
        lineContent += hash.substring(0, Math.min(hash.length, lineLength - lineContent.length));
      }

      if (isJson) {
        // For JSON, create a more complex object structure
        if (lineNum % 10 === 0) {
          // Every 10th item is a complex object
          chunk += '    {\n';
          chunk += `      "id": "${lineNum}",\n`;
          chunk += `      "name": "Item ${lineNum}",\n`;
          chunk += `      "hash": "${crypto.createHash('sha256').update(lineNum.toString()).digest('hex')}",\n`;
          chunk += '      "properties": {\n';
          chunk += `        "description": "${lineContent.replace(/"/g, '\\"')}",\n`;
          chunk += '        "tags": ["tag1", "tag2", "tag3"],\n';
          chunk += '        "metrics": {\n';
          chunk += `          "value1": ${lineNum % 100},\n`;
          chunk += `          "value2": ${lineNum % 200},\n`;
          chunk += `          "ratio": ${(lineNum % 100) / 100}\n`;
          chunk += '        }\n';
          chunk += '      },\n';
          chunk += `      "timestamp": "${new Date(Date.now() + lineNum * 1000).toISOString()}"\n`;
          chunk += `    }${bytesWritten + chunk.length + 6 < totalBytes ? ',\n' : '\n'}`;
        } else {
          // Simple items for the rest
          chunk += `    { "id": "${lineNum}", "value": "${lineContent.replace(/"/g, '\\"')}" }${bytesWritten + chunk.length + 6 < totalBytes ? ',\n' : '\n'}`;
        }
      } else {
        // For text, just add the line
        chunk += lineContent + '\n';
      }

      if (bytesWritten + chunk.length >= totalBytes) {
        break;
      }
    }

    fs.writeSync(fd, chunk);
    bytesWritten += chunk.length;
  }

  // Close JSON structure
  if (isJson) {
    fs.writeSync(fd, '  ]\n}');
  }

  fs.closeSync(fd);
}

// Generate our test files
generateLargeFile(largeJsonFilePath, 10, true); // 10MB JSON file
generateLargeFile(largeTextFilePath, 10, false); // 10MB text file

// Create sources from the generated files
const largeJsonSource = Source.asset(tempDir, {
  exclude: ['*', '!large-file.json'],
});

const largeTextSource = Source.asset(tempDir, {
  exclude: ['*', '!large-file.txt'],
});

const secret = new secretsmanager.Secret(stack, 'TestSecret', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({
      value: 'test"with"quotes',
    }),
    generateStringKey: 'password',
  },
});
const param = new ssm.StringParameter(stack, 'SecretParam', {
  stringValue: secret.secretValueFromJson('value').unsafeUnwrap(),
});

const fileWithMarker = Source.jsonData('my-json/secret-config.json', {
  secret_value: param.stringValue, // Using a tokenized value
}, { escape: true });

const noEscapeFileWithMarker = Source.jsonData('my-json/secret-config-no-escape.json', {
  secret_value: param.stringValue,
});

// Deploy the large files
new BucketDeployment(stack, 'DeployLargeFiles', {
  destinationBucket: bucket,
  sources: [largeJsonSource, largeTextSource, fileWithMarker, noEscapeFileWithMarker],
  retainOnDelete: false,
});

new CfnOutput(stack, 'BucketName', { value: bucket.bucketName });

const integ = new IntegTest(app, 'integ-test-bucket-deployment-large-file', {
  testCases: [stack],
});

// Add assertions to verify the JSON file
const assertionProvider = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: bucket.bucketName,
  Key: 'my-json/secret-config.json',
});

// Verify the content is valid JSON and properly escaped
assertionProvider.expect(ExpectedResult.objectLike({
  // Properly escaped JSON.
  Body: '{"secret_value":"test\\"with\\"quotes"}',
}));

integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: bucket.bucketName,
  Key: 'my-json/secret-config-no-escape.json',
}).expect(ExpectedResult.objectLike({
  // un-escaped JSON.
  Body: '{"secret_value":"test"with"quotes"}',
}));

// Verify the large JSON file was deployed successfully
const jsonAssertionProvider = integ.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: bucket.bucketName,
  Prefix: 'large-file.json',
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
  Contents: [
    {
      Key: 'large-file.json',
    },
  ],
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

// Add permissions to the assertion provider
if (jsonAssertionProvider instanceof AwsApiCall && jsonAssertionProvider.waiterProvider) {
  jsonAssertionProvider.waiterProvider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}

// Verify the large text file was deployed successfully
const textAssertionProvider = integ.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: bucket.bucketName,
  Prefix: 'large-file.txt',
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
  Contents: [
    {
      Key: 'large-file.txt',
    },
  ],
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

// Add permissions to the assertion provider
if (textAssertionProvider instanceof AwsApiCall && textAssertionProvider.waiterProvider) {
  textAssertionProvider.waiterProvider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}

app.synth();

// Clean up the temporary directory after synthesis
process.on('exit', () => {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    process.stdout.write(`Cleaned up temporary directory: ${tempDir}\n`);
  } catch (err) {
    process.stderr.write(`Failed to clean up temporary directory: ${tempDir}\n`);
  }
});
