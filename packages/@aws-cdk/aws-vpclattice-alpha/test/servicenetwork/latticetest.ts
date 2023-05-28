import * as core from 'aws-cdk-lib';

import {
  aws_s3 as s3,
  aws_logs as logs,
  //aws_kinesis as kinesis,
  aws_iam as iam,
  aws_ec2 as ec2,
//   aws_lambda,
}
  from 'aws-cdk-lib';
import { Construct } from 'constructs';

import {
  ServiceNetwork,
  Service,
  Protocol,
  FixedResponse,
  //TargetGroup,
}
  from '../../lib/index';


//import * as path from 'path';


export class ServiceNetworkStack extends core.Stack {

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    /**
     * Create a ServiceNetwork.
     * OPINIONATED DEFAULT: The default behavior is to create a
     * service network that requries an IAM policy
     */

    const serviceNetwork = new ServiceNetwork(this, 'LatticeServiceNetwork', {
      name: 'latticeservicenetwork',
    });

    // log servicenetwork to s3
    serviceNetwork.logToS3(
      new s3.Bucket(this, 'ServiceNetworkLogBucket', {
        encryption: s3.BucketEncryption.KMS_MANAGED,
        enforceSSL: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: core.RemovalPolicy.DESTROY,
      }),
    );

    // send logs to cloudwatch
    serviceNetwork.sendToCloudWatch(
      new logs.LogGroup(this, 'ServiceNetworkLogGroup', {
        logGroupName: 'ServiceNetworkLogGroup',
        removalPolicy: core.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_MONTH,
      }),
    );

    // grantAccess to the serviceNetwork for these Principals.
    serviceNetwork.grantAccess(
      [
        new iam.AccountPrincipal(core.Aws.ACCOUNT_ID),
      ],
    );

    // create a ec2.Vpc with a private subnet for the serviceNetwork
    const vpc = new ec2.Vpc(this, 'ServiceNetworkVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // associate the vpc with the serviceNetwork, this will permit the default 443.
    serviceNetwork.associateVPC({
      vpc: vpc,
    });

    // create a lattice service
    const service = new Service(this, 'LatticeService', {
      name: 'lattice-service',
    });

    // associate the service with the serviceNetwork
    serviceNetwork.addService(service);

    // this will permit the principals, access to the entire Service

    service.grantAccess(
      [
        new iam.AccountPrincipal(core.Aws.ACCOUNT_ID),
      ],
    );

    // apply the Auth Policy to the ServiceNetork
    service.applyAuthPolicy();


    // by default the listener will add a default method of
    // 404 NOT FOUND, if one is not specified.
    const listener = service.addListener({
      protocol: Protocol.HTTPS,
      name: 'MyServiceListener',
    });

    // add a rule that matches the root path of the service
    listener.addListenerRule({
      name: 'serviceroot',
      action: FixedResponse.OK,
      priority: 100,
      // default behavior assumes case Senstivity is true
      // and is an exact match
      pathMatch: {
        path: '/',
      },
      allowedPrincipals: [
        new iam.AccountPrincipal('123456789012'),
      ],
    });


    // // add a hello world lambda function;
    // const helloWorld = new aws_lambda.Function(this, 'FunctionOne', {
    //   runtime: aws_lambda.Runtime.PYTHON_3_10,
    //   handler: 'helloworld.lambda_handler',
    //   code: aws_lambda.Code.fromAsset(path.join(__dirname, './lambda' )),
    //   timeout: core.Duration.seconds(15),
    // });

    // listener.addListenerRule({
    //   name: 'helloworld',
    //   action: [
    //     {
    //       targetGroup: new TargetGroup(this, 'helloworldTargetGroup', {
    //         name: 'helloworld',
    //         lambdaTargets: [
    //           helloWorld,
    //         ],
    //       }),
    //       weight: 100,
    //     },
    //   ],
    //   priority: 200,
    //   // default behavior assumes case Senstivity is true
    //   // and is an exact match
    //   pathMatch: {
    //     path: '/helloworld',
    //   },
    //   allowedPrincipals: [
    //     new iam.AccountPrincipal('123456789012'),
    //   ],
    // });
  }
}
