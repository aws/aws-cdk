import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { App, Stage, StageProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
export class BaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const kmsKey = new kms.Key(this, 'KmsKey', {

    });
    /////////////////////////////////////////////////////////////////////////////////////
    /// ///////////////////////////////////////////// Exports ///////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////

    this.exportValue(kmsKey.keyArn, {
      name: 'test-cdk-contribution',
    });
  }
}

export class Base2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const KmsKey = kms.Key.fromKeyArn(
      this,
      'KmsKey',
      cdk.Fn.importValue('test-cdk-contribution'),
    );
    new logs.LogGroup(this, 'logGroup', {
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      logGroupName: 'test-cdk-contribution',
      encryptionKey: KmsKey,
    });
  }
}

export class TestCdkContributionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = ec2.Vpc.fromVpcAttributes(this, 'vpc', {
      availabilityZones: ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'],
      vpcId: cdk.Fn.importValue('VPC1-VPC-ID'),
      privateSubnetIds: [
        cdk.Fn.importValue('VPC1-AZ1Subnet1'),
        cdk.Fn.importValue('VPC1-AZ2Subnet1'),
        cdk.Fn.importValue('VPC1-AZ3Subnet1'),
      ],
      privateSubnetRouteTableIds: [
        cdk.Fn.importValue('VPC1-RouteTableIDAZ1'),
        cdk.Fn.importValue('VPC1-RouteTableIDAZ2'),
        cdk.Fn.importValue('VPC1-RouteTableIDAZ3'),
      ],
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(
          s3.Bucket.fromBucketName(
            this,
            'SourceBucket-' + id,
            '290582178775-gitsync',
          ),
          'mobility-operations-experience/serviceteam/services/test-cdk-contribution/main/src/' +
            'mobility-operations-experience_serviceteam_services_test-cdk-contribution.zip',
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
      pipelineName: 'test-cdk-contribution',
      selfMutation: false,
      synthCodeBuildDefaults: {
        vpc: vpc,
      },
      allPrepareNodesFirst: true,

    });

    const group = pipeline.addWave('Wave1', {
      postPrepare: [new pipelines.ManualApprovalStep('Approval2')],
    });


    // group.addStage(new AppStage2(this, 'Prod1'), {});
    group.addStage(new AppStage(this, 'Prod2'));

  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new BaseStack(this, 'Base2Stack', {});
    const stack2 = new Base2Stack(this, 'BaseStack', {});
    stack2.addDependency(stack1);
  }
}

// class AppStage3 extends Stage {
//   public readonly stack1: Stack;

//   constructor(scope: Construct, id: string, props?: StageProps) {
//     super(scope, id, props);

//     this.stack1 = new Stack(this, 'Stack1');

//     // new sqs.Queue(this.stack2, 'OtherQueue', { deadLetterQueue: { queue: q1, maxReceiveCount: 1 } });
//   }
// }
// class AppStage4 extends Stage {

//   public readonly stack2: Stack;
//   constructor(scope: Construct, id: string, props?: StageProps) {
//     super(scope, id, props);

//     // const q1=new sqs.Queue(this.stack1, 'Queue');
//     this.stack2 = new Stack(this, 'Stack2');
//     // new sqs.Queue(this.stack2, 'OtherQueue', { deadLetterQueue: { queue: q1, maxReceiveCount: 1 } });
//   }
// }
// class AppStage2 extends Stage {
//   constructor(scope: Construct, id: string, props?: StageProps) {
//     super(scope, id, props);
//     new Base2Stack(this, 'BaseStack', {});
//   }
// }

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});
const pipeStack = new TestCdkContributionStack(
  app,
  'PipelineWithPostPrepareStack',
);

new IntegTest(app, 'Integ', {
  testCases: [pipeStack],
});

app.synth();
