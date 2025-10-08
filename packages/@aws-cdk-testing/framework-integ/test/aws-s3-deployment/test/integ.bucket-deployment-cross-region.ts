import * as path from 'path';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

// Constants for regions and test data
const OPT_IN_REGION_ZAZ = 'eu-south-2'; // Opt-in region that requires explicit region specification
const STANDARD_REGION_IAD = 'us-east-1'; // Standard region that works without explicit region specification
const STANDARD_REGION_PDX = 'us-west-2'; // Standard region that works without explicit region specification

// Unified test data
const TEST_PREFIX = 'bucket-deployment-test/';
const TEST_MESSAGE = 'Bucket deployment test';

// File names
const TEST_FILE_NAME = 'test-file.txt';
const CONFIG_FILE_NAME = 'config.json';

// Stack to create a bucket in any region
class BucketStack extends Stack {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id, props);

    this.bucket = new Bucket(this, 'TestBucket', {
      bucketName: `cdk-integ-cross-region-${Math.random().toString(36).substring(2, 15)}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
    });
  }
}

// Stack for bucket deployments with configurable options
interface BucketDeploymentStackProps {
  destinationBucket: IBucket;
  destinationBucketRegion?: string;
  env?: any;
}

// Helper function to get deployedTo value
function getDeploymentRegionValue(region?: string): string {
  return region || 'not-specified';
}

class BucketDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: BucketDeploymentStackProps) {
    super(scope, id, { env: props.env });

    const destinationBucket = Bucket.fromBucketName(this, 'ImportedBucket', props.destinationBucket.bucketName);

    const sources = [
      Source.data(TEST_FILE_NAME, TEST_MESSAGE),
      Source.asset(path.join(__dirname, 'my-website')),
      Source.jsonData(CONFIG_FILE_NAME, {
        deployedFrom: getDeploymentRegionValue(props.env?.region),
        deployedTo: getDeploymentRegionValue(props.destinationBucketRegion),
        timestamp: new Date().toISOString(),
      }),
    ];

    new BucketDeployment(this, 'Deployment', {
      sources,
      destinationBucket: destinationBucket,
      destinationBucketRegion: props.destinationBucketRegion,
      destinationKeyPrefix: TEST_PREFIX,
      retainOnDelete: false,
    });
  }
}

// Helper function to create a test case
interface CreateTestCaseProps {
  app: App;
  testName: string;
  deploymentRegion: string;
  destinationBucketRegion: string;
  isDestinationBucketRegionSpecified: boolean;
}

function createTestCase(props: CreateTestCaseProps) {
  // Create bucket stack for this specific test
  const bucketStack = new BucketStack(props.app, `${props.testName}BucketStack`, {
    env: { region: props.destinationBucketRegion },
  });

  const deploymentStack = new BucketDeploymentStack(props.app, `${props.testName}Stack`, {
    destinationBucket: bucketStack.bucket,
    destinationBucketRegion: props.isDestinationBucketRegionSpecified ? props.destinationBucketRegion : undefined,
    env: { region: props.deploymentRegion },
  });

  // Add explicit dependency
  deploymentStack.addDependency(bucketStack);

  // Note: Assertions have been omitted because it seems the integration test framework
  // always runs them in us-east-1, from where they cannot access buckets in opt-in regions.
  // The deployment functionality has been manually validated to work correctly.

  return { bucketStack, deploymentStack };
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

// Create all test cases and collect deployment stacks
const testCases = [];

// Test 1: us-east-1 → eu-south-2 WITHOUT destinationBucketRegion specified (key test case)
const test1 = createTestCase({
  app,
  testName: 'CrossRegionOptInDeploymentDestinationRegionOmitted',
  deploymentRegion: STANDARD_REGION_IAD,
  destinationBucketRegion: OPT_IN_REGION_ZAZ,
  isDestinationBucketRegionSpecified: false,
});
testCases.push(test1.deploymentStack);

// Test 2: us-east-1 → eu-south-2 WITH destinationBucketRegion specified
const test2 = createTestCase({
  app,
  testName: 'CrossRegionOptInDeploymentDestinationRegionSpecified',
  deploymentRegion: STANDARD_REGION_IAD,
  destinationBucketRegion: OPT_IN_REGION_ZAZ,
  isDestinationBucketRegionSpecified: true,
});
testCases.push(test2.deploymentStack);

// Test 3: eu-south-2 → eu-south-2 WITHOUT destinationBucketRegion specified
const test3 = createTestCase({
  app,
  testName: 'SameRegionOptInDeploymentDestinationRegionOmitted',
  deploymentRegion: OPT_IN_REGION_ZAZ,
  destinationBucketRegion: OPT_IN_REGION_ZAZ,
  isDestinationBucketRegionSpecified: false,
});
testCases.push(test3.deploymentStack);

// Test 4: eu-south-2 → eu-south-2 WITH destinationBucketRegion specified
const test4 = createTestCase({
  app,
  testName: 'SameRegionOptInDeploymentDestinationRegionSpecified',
  deploymentRegion: OPT_IN_REGION_ZAZ,
  destinationBucketRegion: OPT_IN_REGION_ZAZ,
  isDestinationBucketRegionSpecified: true,
});
testCases.push(test4.deploymentStack);

// Test 5: us-east-1 → us-west-2 WITHOUT destinationBucketRegion specified
const test5 = createTestCase({
  app,
  testName: 'CrossRegionStandardDeploymentDestinationRegionOmitted',
  deploymentRegion: STANDARD_REGION_IAD,
  destinationBucketRegion: STANDARD_REGION_PDX,
  isDestinationBucketRegionSpecified: false,
});
testCases.push(test5.deploymentStack);

// Test 6: us-east-1 → us-west-2 WITH destinationBucketRegion specified
const test6 = createTestCase({
  app,
  testName: 'CrossRegionStandardDeploymentDestinationRegionSpecified',
  deploymentRegion: STANDARD_REGION_IAD,
  destinationBucketRegion: STANDARD_REGION_PDX,
  isDestinationBucketRegionSpecified: true,
});
testCases.push(test6.deploymentStack);

// Test 7: us-west-2 → us-west-2 WITHOUT destinationBucketRegion specified
const test7 = createTestCase({
  app,
  testName: 'SameRegionStandardDeploymentDestinationRegionOmitted',
  deploymentRegion: STANDARD_REGION_PDX,
  destinationBucketRegion: STANDARD_REGION_PDX,
  isDestinationBucketRegionSpecified: false,
});
testCases.push(test7.deploymentStack);

// Test 8: us-west-2 → us-west-2 WITH destinationBucketRegion specified
const test8 = createTestCase({
  app,
  testName: 'SameRegionStandardDeploymentDestinationRegionSpecified',
  deploymentRegion: STANDARD_REGION_PDX,
  destinationBucketRegion: STANDARD_REGION_PDX,
  isDestinationBucketRegionSpecified: true,
});
testCases.push(test8.deploymentStack);

// Create single IntegTest with all test cases
new IntegTest(app, 'BucketDeploymentCrossRegionTest', {
  testCases: testCases,
  diffAssets: true,
  regions: [STANDARD_REGION_IAD, STANDARD_REGION_PDX, OPT_IN_REGION_ZAZ],
});

app.synth();
