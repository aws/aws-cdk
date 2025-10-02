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
      delegatedZoneNames: ['sub1.uniqueexample.com', 'sub2.uniqueexample.com'],
    });

    const subZone1 = new route53.PublicHostedZone(this, 'SubZone1', {
      zoneName: 'sub1.uniqueexample.com',
    });

    const delegation1 = new route53.CrossAccountZoneDelegationRecord(subZone1, 'ZoneDelegation', {
      delegatedZone: subZone1,
      parentHostedZoneName: parentZone.zoneName,
      delegationRole: delegationRole,
    });

    const subZone2 = new route53.PublicHostedZone(this, 'SubZone2', {
      zoneName: 'sub2.uniqueexample.com',
    });

    const delegation2 = new route53.CrossAccountZoneDelegationRecord(subZone2, 'ZoneDelegation', {
      delegatedZone: subZone2,
      parentHostedZoneName: parentZone.zoneName,
      delegationRole: delegationRole,
    });

    delegation1.node.addDependency(delegationGrant);
    delegation2.node.addDependency(delegationGrant);
  }
}

const app = new cdk.App();

const stack = new ZoneDelegationIamStack(app, 'ZoneDelegationStack');

new IntegTest(app, 'ZoneDelegationIam', {
  testCases: [stack],
});
