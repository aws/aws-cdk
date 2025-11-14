import { IHostedZoneRef } from './route53.generated';
import { makeHostedZoneArn } from './util';
import { IGrantable } from '../../aws-iam';
import * as iam from '../../aws-iam/lib/grant';
import { Grant } from '../../aws-iam/lib/grant';

export class HostedZoneGrants {
  public static fromHostedZone(hostedZone: IHostedZoneRef): HostedZoneGrants {
    return new HostedZoneGrants(hostedZone);
  }

  private constructor(private readonly hostedZone: IHostedZoneRef) {
  }

  public delegation(grantee: IGrantable): Grant {
    const g1 = iam.Grant.addToPrincipal({
      grantee,
      actions: ['route53:ChangeResourceRecordSets'],
      resourceArns: [makeHostedZoneArn(this.hostedZone, this.hostedZone.hostedZoneRef.hostedZoneId)],
      conditions: {
        'ForAllValues:StringEquals': {
          'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
          'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
        },
      },
    });
    const g2 = iam.Grant.addToPrincipal({
      grantee,
      actions: ['route53:ListHostedZonesByName'],
      resourceArns: ['*'],
    });

    return g1.combine(g2);
  }
}
