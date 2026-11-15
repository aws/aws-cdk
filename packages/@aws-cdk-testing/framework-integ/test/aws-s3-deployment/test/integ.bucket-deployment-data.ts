import { Bucket } from 'aws-cdk-lib/aws-s3';
import type { StackProps } from 'aws-cdk-lib';
import { App, CfnOutput, CfnParameter, RemovalPolicy, Stack, Token } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

/**
 * Integration test for bucket deployment with various data source types:
 * - Tests Source.data(), Source.jsonData(), and Source.yamlData() methods
 * - Validates token substitution in JSON and YAML files
 * - Tests proper escaping of special characters (quotes) in JSON files
 * - Tests addSource() method for dynamically adding sources
 * - Validates empty string handling
 */
class TestBucketDeploymentData extends Stack {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Test various data source types with different content
    const file1 = Source.data('file1.txt', 'boom');
    const file2 = Source.data('path/to/file2.txt', `bam! ${this.bucket.bucketName}`);
    const file3 = Source.jsonData('my-json/config.json', { website_url: this.bucket.bucketWebsiteUrl });
    const file4 = Source.yamlData('my-yaml/config.yaml', { website_url: this.bucket.bucketWebsiteUrl });
    const file5 = Source.jsonData('my-json/config2.json', { bucket_domain_name: this.bucket.bucketWebsiteDomainName });

    // Test secret value with quotes that need escaping
    const secret = new secretsmanager.Secret(this, 'TestSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          value: 'test"with"quotes',
        }),
        generateStringKey: 'password',
      },
    });

    // Store secret in SSM (workaround for #21503)
    const param = new ssm.StringParameter(this, 'SecretParam', {
      stringValue: secret.secretValueFromJson('value').unsafeUnwrap(),
    });

    const tokenizedValue = param.stringValue; // This should be a Token
    new CfnOutput(this, 'IsToken', { value: Token.isUnresolved(tokenizedValue).toString() });
    new CfnOutput(this, 'SecretValue', { value: tokenizedValue });

    // Test proper escaping of quotes in JSON
    const file6 = Source.jsonData('my-json/secret-config.json', {
      secret_value: tokenizedValue,
    }, { escape: true });
    // Test YAML file (which doesn't require escaping)
    const file7 = Source.yamlData('my-yaml/secret-config.yaml', {
      secret_value: tokenizedValue,
    });

    // Test empty string handling
    const file8 = Source.data('file8.txt', '');

    // Test null JSON data value
    const file9 = Source.jsonData('my-json/config-with-null.json', { hello: 'there', goodbye: null });

    const deployment = new BucketDeployment(this, 'DeployWithDataSources', {
      destinationBucket: this.bucket,
      sources: [file1, file2],
      destinationKeyPrefix: 'deploy/here/',
      retainOnDelete: false,
    });
    // Test addSource() method
    deployment.addSource(file3);
    deployment.addSource(file4);
    deployment.addSource(file5);
    deployment.addSource(file6);
    deployment.addSource(file7);
    deployment.addSource(file8);
    deployment.addSource(file9);

    // Test "numbers list" (no such thing as numbers in CFN, but an LLM told me to test this)
    deployment.addSource(Source.jsonData('my-json/numbers-list.json', {
      numbersList: new CfnParameter(this, 'NumbersParam', {
        type: 'List<Number>',
        default: '80,443',
      }),
    }));

    new CfnOutput(this, 'BucketName', { value: this.bucket.bucketName });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestBucketDeploymentData(app, 'test-bucket-deployment-data');

const integTest = new IntegTest(app, 'integ-test-bucket-deployment-data', {
  testCases: [testCase],
});

function assertGetObject(relativeKey: string) {
  return integTest.assertions.awsApiCall('S3', 'getObject', {
    Bucket: testCase.bucket.bucketName,
    Key: `deploy/here/${relativeKey}`,
  });
}

function assertFileContents(relativeKey: string, expectedBody: string) {
  return assertGetObject(relativeKey).expect(ExpectedResult.objectLike({
    Body: expectedBody,
  }));
}

// Verify the content is valid JSON and properly escaped
assertFileContents('my-json/secret-config.json', '{"secret_value":"test\\"with\\"quotes"}');

// Verify the content is valid JSON and both null and non-null fields are present
assertFileContents('my-json/config-with-null.json', '{"hello":"there","goodbye":null}');

// Verify the content is valid YAML with properly escaped quotes
assertFileContents('my-yaml/secret-config.yaml', 'secret_value: "test\\"with\\"quotes"\n');

// Show that our numbers list is stringified (this is not behavior that we perform, this
// is just demonstrating existing CloudFormation behavior).
assertFileContents('my-json/numbers-list.json', '{"numbersList":["80", "443"]}');

app.synth();
