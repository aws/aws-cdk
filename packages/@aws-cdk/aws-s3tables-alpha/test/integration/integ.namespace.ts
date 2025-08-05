import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../../lib';
import { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Snapshot test for namespace with default parameters
 */
class DefaultNamespaceStack extends core.Stack {
  public readonly namespace: s3tables.Namespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'DefaultBucket', {
      tableBucketName: 'namespace-test-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'DefaultNamespace', {
      namespaceName: 'default_test_namespace',
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

/**
 * Test for importing an existing namespace
 */
class ImportedNamespaceStack extends core.Stack {
  public readonly namespace: s3tables.INamespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'ImportBucket', {
      tableBucketName: 'namespace-import-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    // Create a namespace to import
    const createdNamespace = new s3tables.Namespace(this, 'CreatedNamespace', {
      namespaceName: 'import_test_namespace',
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    // Import the namespace using fromNamespaceAttributes
    this.namespace = s3tables.Namespace.fromNamespaceAttributes(this, 'ImportedNamespace', {
      namespaceName: createdNamespace.namespaceName,
      tableBucket: this.tableBucket,
    });
  }
}

const app = new core.App();

const defaultNamespaceTest = new DefaultNamespaceStack(app, 'DefaultNamespaceStack');
const importedNamespaceTest = new ImportedNamespaceStack(app, 'ImportedNamespaceStack');

const integ = new IntegTest(app, 'NamespaceIntegTest', {
  testCases: [defaultNamespaceTest, importedNamespaceTest],
});

// Add assertions for namespace existence
const listNamespaces = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'ListNamespacesCommand', {
  tableBucketARN: defaultNamespaceTest.tableBucket.tableBucketArn,
});

listNamespaces.expect(ExpectedResult.objectLike({
  namespaces: [
    {
      namespace: ['default_test_namespace'],
    },
  ],
}));

app.synth();
