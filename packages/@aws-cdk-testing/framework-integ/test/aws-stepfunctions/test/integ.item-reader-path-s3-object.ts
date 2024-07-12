import { ExpectedResult, IApiCall, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { DistributedMap, Pass, S3ObjectsItemReaderPath, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';

const TEST_NAME = 'S3ObjectsItemReaderPathTest';

class S3ObjectsItemReaderPathTestStack extends Stack {
  readonly bucket: Bucket;
  readonly stateMachine: StateMachine;

  constructor(scope: App, props?: StackProps) {
    super(scope, `${TEST_NAME}Stack`, props);

    this.bucket = this.createBucket();
    const distributedMap = this.createDistributedMap();
    this.stateMachine = this.createStateMachine(distributedMap);
  }

  private createBucket(): Bucket {
    return new Bucket(this, `${TEST_NAME}Bucket`, {
      autoDeleteObjects: true,
      bucketName: `bucket-item-reader-path-${this.account}-${this.region}`,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }

  private createDistributedMap(): DistributedMap {
    const map = new DistributedMap(this, `${TEST_NAME}Map`, {
      itemReaderPath: new S3ObjectsItemReaderPath({
        bucketNamePath: '$.bucketName',
        prefixPath: '$.prefix',
      }),
    });
    const itemProcessor = new Pass(this, `${TEST_NAME}Pass`);
    map.itemProcessor(itemProcessor);
    return map;
  }

  private createStateMachine(distributedMap: DistributedMap): StateMachine {
    const stateMachineName = `${TEST_NAME}StateMachine`;
    const stateMachine = new StateMachine(this, stateMachineName, {
      definition: distributedMap,
      stateMachineName,
    });
    stateMachine.addToRolePolicy(this.buildGetS3ObjectPolicyStatement());
    stateMachine.addToRolePolicy(this.buildListS3ObjectsPolicyStatement());
    return stateMachine;
  }

  private buildGetS3ObjectPolicyStatement(): PolicyStatement {
    return new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [this.bucket.arnForObjects('*')],
    });
  }

  private buildListS3ObjectsPolicyStatement(): PolicyStatement {
    return new PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: [this.bucket.bucketArn],
    });
  }
}

class S3ObjectsItemReaderPathTest {
  private readonly integTest: IntegTest;
  private readonly testStack: S3ObjectsItemReaderPathTestStack;

  constructor(app: App) {
    this.testStack = new S3ObjectsItemReaderPathTestStack(app);
    this.integTest = new IntegTest(app, 'IntegTest', {
      testCases: [this.testStack],
    });
  }

  test(): IApiCall {
    const setupResources = this.setup();
    const exeutionResult = this.execute(setupResources);
    return this.assert(exeutionResult);
  }

  private assert(exeutionResult: IApiCall): IApiCall {
    return exeutionResult.expect(ExpectedResult.objectLike({
      status: 'SUCCEEDED',
    })).waitForAssertions({
      interval: Duration.seconds(10),
      totalTimeout: Duration.minutes(2),
    });
  }

  private execute(setupResources: IApiCall): IApiCall {
    const startExecution = this.integTest.assertions.awsApiCall('StepFunctions', 'startExecution', {
      input: JSON.stringify({
        bucketName: this.testStack.bucket.bucketName,
        prefix: 'testPrefix',
      }),
      stateMachineArn: this.testStack.stateMachine.stateMachineArn,
    });
    setupResources.next(startExecution);

    const describeExecution = this.integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
      executionArn: startExecution.getAttString('executionArn'),
    });
    startExecution.next(describeExecution);
    return describeExecution;
  }

  private setup(): IApiCall {
    const putS3Object1 = this.integTest.assertions.awsApiCall('S3', 'putObject', {
      Bucket: this.testStack.bucket.bucketName,
      Key: 'testPrefixObject1',
      Body: 'object1',
    });
    const putS3Object2 = this.integTest.assertions.awsApiCall('S3', 'putObject', {
      Bucket: this.testStack.bucket.bucketName,
      Key: 'testPrefixObject2',
      Body: 'object2',
    });
    putS3Object1.next(putS3Object2);
    const putS3Object3 = this.integTest.assertions.awsApiCall('S3', 'putObject', {
      Bucket: this.testStack.bucket.bucketName,
      Key: 'otherObject',
      Body: 'object3',
    });
    putS3Object2.next(putS3Object3);
    return putS3Object3;
  }
}

const app = new App();
const s3ObjectsItemReaderPathTest = new S3ObjectsItemReaderPathTest(app);
s3ObjectsItemReaderPathTest.test();
app.synth();