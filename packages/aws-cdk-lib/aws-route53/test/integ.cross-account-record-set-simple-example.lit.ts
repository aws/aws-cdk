import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { CrossAccountRecordSet, HostedZone, RecordTarget, RecordType } from '../lib';

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

// The Hosted zone at `hostedZoneId` and `hostedZoneName`
// are expected to already exist.
// The HostedZone should be in the same account as the
// CrossAccountRoleStack.
const hostedZoneId = 'Z05228813KLFMWZPHQF1O-REPLACEME';
const hostedZoneName = 'apex.example.com';

const apexAccountId = '123456789012';
const appAccountId = '234567890123';
const crossAccountRoleName = 'CrossAccountRecordSetRole';

new CrossAccountRoleStack(app, 'CrossAccountRoleStack', {
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

new AppStack(app, 'AppStack', {
  apexHostedZoneName: hostedZoneName,
  apexHostedZoneId: hostedZoneId,
  apexAccountId: apexAccountId,
  crossAccountRoleName: crossAccountRoleName,
  recordName: 'test',
  env: {
    account: appAccountId,
    region: 'us-west-1',
  },
});

/// !hide
//

app.synth();
