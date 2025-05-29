import { Bucket } from 'aws-cdk-lib/aws-s3';
import { App, CfnOutput, RemovalPolicy, Stack, Token } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as path from 'path';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'TestBucketDeploymentContent');
const bucket = new Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY, // Allow bucket deletion
  autoDeleteObjects: true, // Delete objects when bucket is deleted
});

const file1 = Source.data('file1.txt', 'boom');
const file2 = Source.data('path/to/file2.txt', `bam! ${bucket.bucketName}`);
const file3 = Source.jsonData('my-json/config.json', { website_url: bucket.bucketWebsiteUrl });
const file4 = Source.yamlData('my-yaml/config.yaml', { website_url: bucket.bucketWebsiteUrl });
const file5 = Source.jsonData('my-json/config2.json', { bucket_domain_name: bucket.bucketWebsiteDomainName });

// Add new test case for secret value with quotes
const secret = new secretsmanager.Secret(stack, 'TestSecret', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({
      value: 'test"with"quotes',
    }),
    generateStringKey: 'password',
  },
});

// Store secret in SSM (workaround for #21503)
const param = new ssm.StringParameter(stack, 'SecretParam', {
  stringValue: secret.secretValueFromJson('value').unsafeUnwrap(),
});

const tokenizedValue = param.stringValue; // This should be a Token
new CfnOutput(stack, 'IsToken', { value: Token.isUnresolved(tokenizedValue).toString() });
new CfnOutput(stack, 'SecretValue', { value: tokenizedValue });

// Add new file with secret value that needs proper escaping
const file6 = Source.jsonData('my-json/secret-config.json', {
  secret_value: tokenizedValue, // Using the tokenized value explicitly
}, { escape: true });
const file7 = Source.yamlData('my-yaml/secret-config.yaml', {
  secret_value: tokenizedValue,
});

const deployment = new BucketDeployment(stack, 'DeployMeHere', {
  destinationBucket: bucket,
  sources: [file1, file2],
  destinationKeyPrefix: 'deploy/here/',
  retainOnDelete: false, // default is true, which will block the integration test cleanup
});
deployment.addSource(file3);
deployment.addSource(file4);
deployment.addSource(file5);
deployment.addSource(file6);
deployment.addSource(file7);

new CfnOutput(stack, 'BucketName', { value: bucket.bucketName });

const integ = new IntegTest(app, 'integ-test-bucket-deployment-data', {
  testCases: [stack],
});

// Add assertions to verify the JSON file
const assertionProvider = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: bucket.bucketName,
  Key: path.join('deploy/here', 'my-json/secret-config.json'),
});

// Verify the content is valid JSON and properly escaped
assertionProvider.expect(ExpectedResult.objectLike({
  // Properly escaped JSON.
  Body: '{"secret_value":"test\\"with\\"quotes"}',
}));

// Add assertions to verify the YAML file
const yamlAssertionProvider = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: bucket.bucketName,
  Key: path.join('deploy/here', 'my-yaml/secret-config.yaml'),
});

// Verify the content is valid YAML with properly escaped quotes
yamlAssertionProvider.expect(ExpectedResult.objectLike({
  // YAML format with proper escaping
  Body: 'secret_value: test"with"quotes\n',
}));

app.synth();
