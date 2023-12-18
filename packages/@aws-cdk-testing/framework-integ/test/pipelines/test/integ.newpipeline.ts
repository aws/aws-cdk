// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true

import { App, Fn, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'vpc', {
      availabilityZones: ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'],
      vpcId: Fn.importValue('VPC1-VPC-ID'),
      privateSubnetIds: [
        Fn.importValue('VPC1-AZ1Subnet1'),
        Fn.importValue('VPC1-AZ2Subnet1'),
        Fn.importValue('VPC1-AZ3Subnet1'),
      ],
      privateSubnetRouteTableIds: [
        Fn.importValue('VPC1-RouteTableIDAZ1'),
        Fn.importValue('VPC1-RouteTableIDAZ2'),
        Fn.importValue('VPC1-RouteTableIDAZ3'),
      ],
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('Nico-DB/aws-cdk', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
      pipelineName: 'test-cdk-contribution',
      selfMutation: false,
      synthCodeBuildDefaults: {
        vpc: vpc,
      },
      allPrepareNodesFirst: true,
    });

    // const beta = new AppStage(this, 'Beta');
    // pipeline.addStage(beta, {
    //   allPrepareNodesFirst: true,
    //   stackSteps: [
    //     {
    //       stack: beta.stack1,
    //       changeSet: [new pipelines.ManualApprovalStep('b approve')], // Executed after stack is prepared but before the stack is deployed
    //     },
    //   ],
    // });
    // const st=pipeline.addStage(new AppStage(this, 'test'), {
    //   allPrepareNodesFirst: true,
    //   postPrepare: [new pipelines.ManualApprovalStep('Approval0')],
    // });
    // console.log(st.postPrepare);
    const group = pipeline
      .addWave('Wave1', {
        postPrepare: [new pipelines.ManualApprovalStep('Approval1')],
      });
    // group.addPostPrepare(new pipelines.ManualApprovalStep('Approval11'));

    // group.addStage(new AppStage2(this, 'Prod1'), {
    //   // postPrepare: [new pipelines.ManualApprovalStep('Approval13')],
    // });
    group.addStage(new AppStage(this, 'Prod2'));

    const group2 = pipeline.addWave('Wave2', {
      // postPrepare: [new pipelines.ManualApprovalStep('Approval2')],
    });
    group2.addStage(new AppStage(this, 'Prod3'));
    // group2.addStage(new AppStage(this, 'Prod4'));
    // group2.addStage(new AppStage(this, 'Prod5'));
    // group2.addStage(new AppStage(this, 'Prod6'));
  }

}


class AppStage extends Stage {
  public readonly stack1: Stack;
  public readonly stack2: Stack;
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    this.stack1 = new Stack(this, 'Stack1');

    // const q1=new sqs.Queue(this.stack1, 'Queue');
    this.stack2 = new Stack(this, 'Stack2');
    this.stack2.addDependency(this.stack1);
    // new sqs.Queue(this.stack2, 'OtherQueue', { deadLetterQueue: { queue: q1, maxReceiveCount: 1 } });
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
//   public readonly stack3: Stack;
//   constructor(scope: Construct, id: string, props?: StageProps) {
//     super(scope, id, props);
//     this.stack3 = new Stack(this, 'Stack3');
//   }
// }

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});


const pipeStack = new PipelineStack(
  app,
  'PipelineStack',
);

new IntegTest(app, 'Integ', {
  testCases: [pipeStack],
});
app.synth();

