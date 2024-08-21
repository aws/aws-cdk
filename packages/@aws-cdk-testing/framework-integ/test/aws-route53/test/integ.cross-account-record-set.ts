import {
  CrossAccountRecordSet,
  HostedZone,
  RecordTarget,
  RecordType,
} from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

/*
The following environment variables must be set for this integration test to run correctly:
        * CDK_INTEG_ACCOUNT
        * CDK_INTEG_CROSS_ACCOUNT
        * HOSTED_ZONE_NAME
        * HOSTED_ZONE_ID

In addition to the environment variables, you should have the following
AWS credential profiles configured:

    cdk_integ_account -> Contains valid credentials for the CDK_INTEG_ACCOUNT
    cdk_integ_cross_account -> Contains valid credentials for the CDK_INTEG_CROSS_ACCOUNT

Ensure the accounts are bootstrapped with --trust settings:
    cdk bootstrap --profile cdk_integ_account aws://$CDK_INTEG_ACCOUNT/us-east-1 --trust $CDK_INTEG_CROSS_ACCOUNT --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
    cdk bootstrap --profile cdk_integ_cross_account aws://$CDK_INTEG_CROSS_ACCOUNT/us-west-1 --trust $CDK_INTEG_ACCOUNT --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess

The CDK_INTEG_ACCOUNT is expected to have an existing Route53 Hosted zone with the values
set by $HOSTED_ZONE_NAME and $HOSTED_ZONE_ID.

The following command runs the integ tests in this file:

    yarn integ --disable-update-workflow aws-route53/test/integ.cross-account-record-set --profiles cdk_integ_account cdk_integ_cross_account
*/

const hostedZoneAccountId = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const childZoneAccountId = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';
const hostedZoneName = process.env.HOSTED_ZONE_NAME || 'example.com';
const hostedZoneId = process.env.HOSTED_ZONE_ID || 'notarealzoneid';

const roleName = 'CrossAccountRecordSetRole';

const app = new cdk.App();

interface ApexHostedZoneStackProps extends cdk.StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  trustedAccountIds: string[];
  roleName: string;
}

/**
    * This stack creates the IAM role that the child accounts
    * will assume in order to allow the creation of the CrossAccountRecordSet
**/
class ApexHostedZoneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApexHostedZoneStackProps) {
    super(scope, id, props);
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    const crossAccountRole = new iam.Role(this, 'CrossAccountRole', {
      roleName: props.roleName,
      assumedBy: new iam.AccountRootPrincipal(),
      inlinePolicies: {
        allowRoute53: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['route53:ChangeResourceRecordSets', 'route53:ListResourceRecordSets'],
              resources: [hostedZone.hostedZoneArn],
            }),
          ],
        }),
      },
    });
    crossAccountRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        principals: props.trustedAccountIds.map(account => new iam.AccountPrincipal(account)),
      }),
    );
  }
}

interface ApiStackProps extends cdk.StackProps {
  apexAccountId: string;
  apexHostedZoneId: string;
  apexHostedZoneName: string;
  crossAccountRoleName: string;
}

/**
    * This stack creates a CrossAccountRecordSet which contains an A record
    * that points to a test CloudFront distribution.
*/
class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: props.apexHostedZoneId,
      zoneName: props.apexHostedZoneName,
    });
    const region = cdk.Stack.of(this).region;

    const myBucket = new s3.Bucket(this, 'myBucket');
    const distribution = new cloudfront.Distribution(this, 'myDist', {
      defaultBehavior: { origin: new origins.S3Origin(myBucket) },
    });

    const roleArn = cdk.Stack.of(this).formatArn({
      region: '', // IAM is global in each partition
      service: 'iam',
      account: props.apexAccountId,
      resource: 'role',
      resourceName: props.crossAccountRoleName,
    });
    const role = iam.Role.fromRoleArn(this, 'CrossAccountRole', roleArn);

    const cloudfrontTarget = new targets.CloudFrontTarget(distribution);
    new CrossAccountRecordSet(this, 'LatencyRecord', {
      crossAccountRole: role,
      zone: hostedZone,
      target: RecordTarget.fromAlias(cloudfrontTarget),
      recordType: RecordType.A,
      deleteExisting: true,
      region: region,
      setIdentifier: region,
    });
  }

}

const apexStack = new ApexHostedZoneStack(app, 'ApexHostedZone', {
  env: {
    account: hostedZoneAccountId,
    region: 'us-east-1',
  },
  trustedAccountIds: [childZoneAccountId],
  roleName: roleName,
  hostedZoneId: hostedZoneId,
  hostedZoneName: hostedZoneName,
});

const api1Stack = new ApiStack(app, 'Api1Stack', {
  env: {
    account: childZoneAccountId,
    region: 'us-west-1',
  },
  apexAccountId: apexStack.account,
  apexHostedZoneId: hostedZoneId,
  apexHostedZoneName: hostedZoneName,
  crossAccountRoleName: roleName,
});

api1Stack.addDependency(apexStack);

/**
    * If the stacks are created successfully, we will expect that
    * the APEX HostedZone will contain a latency routed A record
    * which are created in the child account using the CrossAccountRecordSet construct.
**/
const integTest = new integ.IntegTest(app, 'CARS-Test', {
  testCases: [apexStack, api1Stack],
  regions: [apexStack.region, api1Stack.region],
  diffAssets: true,
});

const aListResults = integTest.assertions.awsApiCall('Route53', 'listResourceRecordSets', {
  HostedZoneId: hostedZoneId,
  MaxItems: '1',
  StartRecordName: hostedZoneName,
  StartRecordType: 'A',
});

aListResults.expect(integ.ExpectedResult.objectLike({
  ResourceRecordSets: [
    {
      Name: `${hostedZoneName}.`,
      Type: 'A',
      SetIdentifier: api1Stack.region,
    },
  ],
}));

app.synth();
