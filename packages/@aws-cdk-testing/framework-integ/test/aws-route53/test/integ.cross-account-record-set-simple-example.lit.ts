import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import { CrossAccountRecordSet, HostedZone, RecordTarget, RecordType } from 'aws-cdk-lib/aws-route53';

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

/// !show

interface CrossAccountRoleStackProps extends cdk.StackProps {
  apexHostedZoneName: string;
  apexHostedZoneId: string;
  crossAccountRoleName: string;
  authorizedAccounts: string[];
  // Optionally restrict the RecordSet names the role can manage
  // @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/specifying-rrset-conditions.html#route53_rrset_ConditionKeys
  changeResourceRecordSetsNormalizedRecordNames?: string[];
  // Optionally restrict the RecordSet types the role can manage
  // @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/specifying-rrset-conditions.html#route53_rrset_ConditionKeys
  changeResourceRecordSetsRecordTypes?: string[];
}

/*
* Creates the IAM role that will allow the `CrossAccountRecordSet` permission to create RecordSets
* in the apex HostedZone. This role should exist in the same stack as the apex HostedZone.
*/
class CrossAccountRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CrossAccountRoleStackProps) {
    super(scope, id, props);

    const apexHostedZone = HostedZone.fromHostedZoneAttributes(this, 'ApexHostedZone', {
      zoneName: props.apexHostedZoneName,
      hostedZoneId: props.apexHostedZoneId,
    });

    const crossAccountRole = new iam.Role(this, 'CrossAccountRole', {
      roleName: props.crossAccountRoleName,
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // The role must grant ChangeResourceRecordSets and ListResourceRecordSets
    // permissions in order for the CrossAccountRecordSet to work.
    const policyStatement: iam.PolicyStatement = new iam.PolicyStatement({
      actions: ['route53:ChangeResourceRecordSets', 'route53:ListResourceRecordSets'],
      resources: [apexHostedZone.hostedZoneArn],
      effect: iam.Effect.ALLOW,
    });
    if (props.changeResourceRecordSetsNormalizedRecordNames) {
      policyStatement.addCondition('ForAllValues:StringLike', {
        'route53:ChangeResourceRecordSetsNormalizedRecordNames': props.changeResourceRecordSetsNormalizedRecordNames,
      });
    }
    if (props.changeResourceRecordSetsRecordTypes) {
      policyStatement.addCondition('ForAllValues:StringEquals', {
        'route53:ChangeResourceRecordSetsRecordTypes': props.changeResourceRecordSetsRecordTypes,
      });
    }
    const policyName = 'Allow-RecordSet-Read-Write';
    crossAccountRole.attachInlinePolicy(new iam.Policy(this, policyName, {
      policyName: policyName,
      statements: [policyStatement],
    }));

    // Allow the authorized accounts to assume the role
    let authorizedPrincipals: iam.IPrincipal[] = [];
    for (let authorizedAccount of props.authorizedAccounts) {
      authorizedPrincipals.push(new iam.AccountPrincipal(authorizedAccount));
    }
    crossAccountRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        principals: authorizedPrincipals,
      }),
    );
  }
}

interface AppStackProps extends cdk.StackProps {
  apexHostedZoneName: string;
  apexHostedZoneId: string;
  apexAccountId: string;
  crossAccountRoleName: string;
  recordName: string;
}

/**
    * Example stack which demonstrates creating a `CrossAccountRecordSet`.
    * The `crossAccountRole` and `zone` properties will be created
    * outside of this stack.
*/
class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const crossAccountRoleArn = cdk.Stack.of(this).formatArn({
      region: '', // IAM is global in each partition
      service: 'iam',
      account: props.apexAccountId,
      resource: 'role',
      resourceName: props.crossAccountRoleName,
    });
    const crossAccountRole = iam.Role.fromRoleArn(this, 'CrossAccountRole', crossAccountRoleArn);
    const apexHostedZone = HostedZone.fromHostedZoneAttributes(this, 'ApexHostedZone', {
      zoneName: props.apexHostedZoneName,
      hostedZoneId: props.apexHostedZoneId,
    });

    new CrossAccountRecordSet(this, 'SimpleRecordSet', {
      crossAccountRole: crossAccountRole,
      zone: apexHostedZone,
      target: RecordTarget.fromIpAddresses('1.2.3.4'),
      recordType: RecordType.A,
      recordName: props.recordName,
    });
  }
}

const app = new cdk.App();

const apexAccountId = hostedZoneAccountId;
const appAccountId = childZoneAccountId;
const crossAccountRoleName = 'CrossAccountRecordSetRole';

const crossAccountRoleStack = new CrossAccountRoleStack(app, 'CrossAccountRoleStack', {
  apexHostedZoneName: hostedZoneName,
  apexHostedZoneId: hostedZoneId,
  crossAccountRoleName: crossAccountRoleName,
  authorizedAccounts: [appAccountId],
  changeResourceRecordSetsRecordTypes: ['A'],
  changeResourceRecordSetsNormalizedRecordNames: [`test.${hostedZoneName}`],
  env: {
    account: apexAccountId,
    region: 'us-east-1',
  },
});

const appStack = new AppStack(app, 'AppStack', {
  apexHostedZoneName: hostedZoneName,
  apexHostedZoneId: hostedZoneId,
  apexAccountId: crossAccountRoleStack.account,
  crossAccountRoleName: crossAccountRoleName,
  recordName: 'test',
  env: {
    account: appAccountId,
    region: 'us-west-1',
  },
});

/// !hide
new integ.IntegTest(app, 'SimpleExample', {
  testCases: [crossAccountRoleStack, appStack],
  diffAssets: true,
});

app.synth();
