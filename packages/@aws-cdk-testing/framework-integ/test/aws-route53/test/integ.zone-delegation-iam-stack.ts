import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class ZoneDelegationIamStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const parentZone = new route53.PublicHostedZone(this, 'ParentZone', {
      zoneName: 'uniqueexample.com',
    });

    const trusteeRoleArns = this.formatArn({
      service: 'iam',
      region: '',
      resource: 'role',
      resourceName: 'ZoneDelegationStack-*',
    });

    const delegationRole = new iam.Role(this, 'ZoneDelegationRole', {
      roleName: 'ExampleDelegationRole',
      assumedBy: new iam.AccountRootPrincipal().withConditions({
        ArnLike: {
          'aws:PrincipalArn': trusteeRoleArns,
        },
      }),
    });

    const delegationGrant = parentZone.grantDelegation(delegationRole, {
      delegatedZoneNames: [
        'sub1.uniqueexample.com',
        'sub2_*$.uniqueexample.com', // should result in octal codes in iam condition
      ],
    });

    const subZone = new route53.PublicHostedZone(this, 'SubZone', {
      zoneName: 'sub1.uniqueexample.com',
    });

    new route53.CrossAccountZoneDelegationRecord(subZone, 'ZoneDelegation', {
      delegatedZone: subZone,
      parentHostedZoneName: parentZone.zoneName,
      delegationRole: delegationRole,
    }).node.addDependency(delegationGrant);

    const subZoneWithSpecialChars = new route53.PublicHostedZone(this, 'SubZoneSpecialChars', {
      zoneName: 'sub2_*$.uniqueexample.com',
    });

    new route53.CrossAccountZoneDelegationRecord(subZoneWithSpecialChars, 'ZoneDelegation', {
      delegatedZone: subZoneWithSpecialChars,
      parentHostedZoneName: parentZone.zoneName,
      delegationRole: delegationRole,
    }).node.addDependency(delegationGrant);
  }
}

const app = new cdk.App();

const stack = new ZoneDelegationIamStack(app, 'ZoneDelegationStack');

new IntegTest(app, 'ZoneDelegationIam', {
  testCases: [stack],
});
