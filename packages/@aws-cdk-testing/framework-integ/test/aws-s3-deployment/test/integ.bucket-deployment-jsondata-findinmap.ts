import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Fn, CfnMapping } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class FindInMapSourceJsonTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'TestBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new CfnMapping(this, 'ResponseMap', {
      mapping: {
        DefaultResponse: {
          Message: 'Hello from mapping!',
        },
      },
    });

    new s3deploy.BucketDeployment(this, 'DeployWithFindInMap', {
      sources: [
        s3deploy.Source.jsonData('config.json', {
          message: Fn.findInMap('ResponseMap', 'DefaultResponse', 'Message'),
        }),
      ],
      destinationBucket: bucket,
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App();
new integ.IntegTest(app, 'integ-findinmap-source-json', {
  testCases: [new FindInMapSourceJsonTestStack(app, 'FindInMapTest')],
  diffAssets: true,
});
