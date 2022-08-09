// import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface %name.PascalCased%Props {
  // Define construct properties here
}

export class %name.PascalCased% extends Construct {

  constructor(scope: Construct, id: string, props: %name.PascalCased%Props = {}) {
    super(scope, id);

    // Define construct contents here

    // example resource
    // const queue = new sqs.Queue(this, '%name.PascalCased%Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
