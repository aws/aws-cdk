import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2 } from 'aws-cdk-lib/cx-api';

class DistributedMapKmsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const inputKey = new kms.Key(this, 'InputKey', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const outputKey = new kms.Key(this, 'OutputKey', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const inputBucket = new s3.Bucket(this, 'InputBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: inputKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const outputBucket = new s3.Bucket(this, 'OutputBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: outputKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distributedMap = new sfn.DistributedMap(this, 'DistributedMap', {
      itemReader: new sfn.S3JsonItemReader({
        bucket: inputBucket,
        key: 'input.json',
      }),
      resultWriterV2: new sfn.ResultWriterV2({
        bucket: outputBucket,
        prefix: 'results',
      }),
    });
    distributedMap.itemProcessor(new sfn.Pass(this, 'Pass'));

    new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(distributedMap),
    });
  }
}

const app = new cdk.App({
  context: {
    [STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2]: true,
  },
});
const stack = new DistributedMapKmsStack(app, 'aws-stepfunctions-distributed-map-kms');

new IntegTest(app, 'DistributedMapKms', {
  testCases: [stack],
});

app.synth();
