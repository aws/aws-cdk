import { Aws, Names, Resource, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { DeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnDeliveryDestination, ResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { DeliveryDestinationReference, IDeliveryDestinationRef, LogGroup } from 'aws-cdk-lib/aws-logs';
import type { Bucket } from 'aws-cdk-lib/aws-s3';
import type { IConstruct } from 'constructs';
import { XRayPolicyGenerator, getOrCreateBucketPolicy } from './vended-logs-helpers';

abstract class DeliveryDestinationBase extends Resource implements IDeliveryDestinationRef {
  public abstract readonly deliveryDestinationRef: DeliveryDestinationReference;
}

export interface S3DestinationProps {
  readonly permissionsVersion: 'V1' | 'V2';
  readonly s3Bucket: Bucket;
}

interface LogsDestinationProps {
  readonly logGroup: LogGroup;
}

interface FirehoseDestinationProps {
  readonly deliveryStream: DeliveryStream;
}

export class S3DeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  constructor(scope: IConstruct, id: string, props: S3DestinationProps) {
    super(scope, id);
    const bucketPolicy = getOrCreateBucketPolicy(scope, props);

    const destinationNamePrefix = 'cdk-s3-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKS3Dest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.s3Bucket.bucketArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'S3',
    });
    deliveryDestination.node.addDependency(bucketPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }
}

export class FirehoseDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  constructor(scope: IConstruct, id: string, props: FirehoseDestinationProps) {
    super(scope, id);

    Tags.of(props.deliveryStream).add('LogDeliveryEnabled', 'true');
    const destinationNamePrefix = 'cdk-fh-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKFHDest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.deliveryStream.deliveryStreamArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'FH',
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }
}

export class LogsDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  constructor(scope: IConstruct, id: string, props: LogsDestinationProps) {
    super(scope, id);

    const logGroupPolicy = this.getOrCreateLogsResourcePolicy(scope, props.logGroup);

    const destinationNamePrefix = 'cdk-cwl-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKCWLDest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.logGroup.logGroupArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'CWL',
    });
    deliveryDestination.node.addDependency(logGroupPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  private getOrCreateLogsResourcePolicy(scope: IConstruct, logGroup: LogGroup) {
    const stack = Stack.of(scope);
    const policyId = 'CDKCWLLogDestDeliveryPolicy';
    const exists = stack.node.tryFindChild(policyId) as ResourcePolicy;

    const logGroupDeliveryStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [`${logGroup.logGroupArn}:log-stream:*`],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': Stack.of(stack).account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(stack).region}:${Stack.of(stack).account}:*`,
        },
      },
    });

    if (exists) {
      exists.document.addStatements(logGroupDeliveryStatement);
      return exists;
    }
    const logGroupPolicy = new ResourcePolicy(stack, policyId, {
      resourcePolicyName: 'LogDestinationDeliveryPolicy',
      policyStatements: [
        logGroupDeliveryStatement,
      ],
    });
    return logGroupPolicy;
  }
}

export class XRayDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  public readonly xrayResourcePolicy: XRayPolicyGenerator;
  constructor(scope: IConstruct, id: string) {
    super(scope, id);
    // only have one of these per stack
    this.xrayResourcePolicy = this.getOrCreateXRayPolicyGenerator(scope);

    const destinationNamePrefix = 'cdk-xray-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKXRayDest${Names.uniqueId(this)}`, {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'XRAY',
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  private getOrCreateXRayPolicyGenerator(scope: IConstruct) {
    const stack = Stack.of(scope);
    const poliyGeneratorId = 'CDKXRayPolicyGenerator';
    const exists = stack.node.tryFindChild(poliyGeneratorId) as XRayPolicyGenerator;

    if (exists) {
      return exists;
    }
    return new XRayPolicyGenerator(stack, poliyGeneratorId);
  }
}
