import { Aws, Names, Resource, Stack } from 'aws-cdk-lib';
import { CfnBucketPolicy, IBucketRef } from 'aws-cdk-lib/aws-s3';
import { CfnResourcePolicy } from 'aws-cdk-lib/aws-xray';
import type { IConstruct } from 'constructs';

export function tryFindBucketPolicy(bucket: IBucketRef): CfnBucketPolicy | undefined {
  const allConstructs = Stack.of(bucket).node.findAll();
  const bucketPolicies = allConstructs.filter(construct => construct instanceof CfnBucketPolicy) as CfnBucketPolicy[];
  const policiesForCurBucket = bucketPolicies.length > 0 ?
    bucketPolicies.filter(policy => policy.bucket === bucket.bucketRef.bucketName) : undefined;
  return policiesForCurBucket ? policiesForCurBucket[0] : policiesForCurBucket
}

export class XRayDeliveryDestinationPolicy extends Resource {
  public readonly XrayResourcePolicy: CfnResourcePolicy;
  private readonly logGeneratingSourceArns: string[] = [];
  constructor(scope: IConstruct, id: string) {
    super(scope, id);
    const stack = Stack.of(scope);
    // PolicyGenerator class is a singleton, so we will only ever make one of these per stack
    this.XrayResourcePolicy = new CfnResourcePolicy(stack, `CDKXRayPolicy${Names.uniqueId(this)}`, {
      policyName: 'CDKXRayDeliveryDestPolicy',
      policyDocument: this.buildPolicyDocument(),
    });
  }

  public addSourceToPolicy(logGeneratingSourceArn: string) {
    this.logGeneratingSourceArns.push(logGeneratingSourceArn);
    this.XrayResourcePolicy.policyDocument = this.buildPolicyDocument();
  }

  private buildPolicyDocument() {
    return JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Sid: 'CDKLogsDeliveryWrite',
        Effect: 'Allow',
        Principal: {
          Service: 'delivery.logs.amazonaws.com',
        },
        Action: 'xray:PutTraceSegments',
        Resource: '*',
        Condition: {
          'StringEquals': {
            'aws:SourceAccount': Stack.of(this).account,
          },
          'ForAllValues:ArnLike': {
            'logs:LogGeneratingResourceArns': this.logGeneratingSourceArns,
          },
          'ArnLike': {
            'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:delivery-source:*`,
          },
        },
      }],
    });
  }
}
