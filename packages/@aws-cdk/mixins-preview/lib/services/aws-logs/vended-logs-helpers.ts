import { Aws, Names, Resource, Stack } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import { CfnResourcePolicy } from 'aws-cdk-lib/aws-xray';
import type { IConstruct } from 'constructs';
import type { S3DestinationProps } from './vended-logs';

export function getOrCreateBucketPolicy(scope: IConstruct, bucketProps: S3DestinationProps): CfnBucketPolicy {
  const allConstructs = scope.node.findAll();
  const bucketPolicies = allConstructs.filter(construct => construct instanceof CfnBucketPolicy) as CfnBucketPolicy[];
  const policiesForCurBucket = bucketPolicies.length > 0 ?
    bucketPolicies.filter(policy => policy.bucket === bucketProps.s3Bucket.bucketName) : undefined;
  const statements = [];

  const bucketStatement = new PolicyStatement({
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
    actions: ['s3:PutObject'],
    resources: [`${bucketProps.s3Bucket.bucketArn}/AWSLogs/${Stack.of(scope).account}/*`],
    conditions: {
      StringEquals: {
        's3:x-amz-acl': 'bucket-owner-full-control',
        'aws:SourceAccount': Stack.of(scope).account,
      },
      ArnLike: {
        'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(scope).region}:${Stack.of(scope).account}:delivery-source:*`,
      },
    },
  });
  statements.push(bucketStatement);

  if (bucketProps.permissionsVersion == 'V1') {
    const v1PermsStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:GetBucketAcl', 's3:ListBucket'],
      resources: [bucketProps.s3Bucket.bucketArn],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': Stack.of(scope).account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(scope).region}:${Stack.of(scope).account}:*`,
        },
      },
    });
    statements.push(v1PermsStatement);
  }

  if (policiesForCurBucket && policiesForCurBucket.length > 0) {
    const bucketPolicy = policiesForCurBucket[0];

    // Add new statements using addOverride to avoid circular references
    const existingDoc = bucketPolicy.policyDocument as any;
    const existingStatements = Array.isArray(existingDoc.Statement) ? existingDoc.Statement : [];
    const newStatements = statements.map(s => s.toStatementJson());

    bucketPolicy.addOverride('Properties.PolicyDocument.Statement', [
      ...existingStatements,
      ...newStatements,
    ]);
    return bucketPolicy;
  } else {
    return new CfnBucketPolicy(scope, `CDKS3DestPolicy${Names.uniqueId(bucketProps.s3Bucket)}`, {
      bucket: bucketProps.s3Bucket.bucketName,
      policyDocument: new PolicyDocument({
        statements,
      }).toJSON(),
    });
  }
}

export class XRayPolicyGenerator extends Resource {
  public readonly XrayResourcePolicy: CfnResourcePolicy;
  private readonly logGeneratingSourceArns: string[] = [];
  constructor(scope: IConstruct, id: string) {
    super(scope, id);
    this.XrayResourcePolicy = this.getOrCreateXRayResourcePolicy(scope);
  }

  private getOrCreateXRayResourcePolicy(stack: IConstruct) {
    // Find existing XRay resource policy
    const existing = stack.node.findAll().find(
      construct => construct instanceof CfnResourcePolicy &&
      construct.cfnResourceType === 'AWS::XRay::ResourcePolicy' &&
      construct.policyName === 'CDKXRayDeliveryDestPolicy',
    ) as CfnResourcePolicy;

    if (existing) {
      return existing;
    }

    return new CfnResourcePolicy(stack, `CDKXRayPolicy${Names.uniqueId(this)}`, {
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
