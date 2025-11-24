import { Aws, Names, Resource, Stack } from 'aws-cdk-lib';
import { CfnResourcePolicy } from 'aws-cdk-lib/aws-xray';
import type { IConstruct } from 'constructs';

/**
 * Creates and manages an X-Ray resource policy for log delivery destinations.
 * This class is designed as a singleton per stack to manage permissions for multiple log sources.
 */
export class XRayDeliveryDestinationPolicy extends Resource {
  /** The CloudFormation X-Ray resource policy */
  public readonly XrayResourcePolicy: CfnResourcePolicy;
  /** Array of ARNs for log-generating sources that are allowed to deliver to X-Ray */
  private readonly logGeneratingSourceArns: string[] = [];

  /**
   * Creates a new X-Ray delivery destination policy.
   * @param scope - The construct scope
   * @param id - The construct ID
   */
  constructor(scope: IConstruct, id: string) {
    super(scope, id);
    const stack = Stack.of(scope);
    // XRayDeliveryDestinationPolicy class is a singleton, so we will only ever make one of these per stack
    this.XrayResourcePolicy = new CfnResourcePolicy(stack, `CDKXRayPolicy${Names.uniqueId(this)}`, {
      policyName: 'CDKXRayDeliveryDestPolicy',
      policyDocument: this.buildPolicyDocument(),
    });
  }

  /**
   * Adds a log-generating source ARN to the policy and updates the resource policy.
   * @param logGeneratingSourceArn - The ARN of the log source to add to the policy
   */
  public allowSource(logGeneratingSourceArn: string) {
    this.logGeneratingSourceArns.push(logGeneratingSourceArn);
    this.XrayResourcePolicy.policyDocument = this.buildPolicyDocument();
  }

  /**
   * Builds the IAM policy document for X-Ray delivery permissions.
   * @returns The policy document as a JSON string
   */
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
