import type { Construct } from 'constructs';
import type { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { Resource, Lazy, Names } from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { CfnResourcePolicy } from 'aws-cdk-lib/aws-xray';

/**
 * Properties to define X-Ray resource policy
 */
export interface ResourcePolicyProps {
  /**
   * Name of the log group resource policy
   * @default - Uses a unique id based on the construct path
   */
  readonly resourcePolicyName?: string;

  /**
   * Initial statements to add to the resource policy
   *
   * @default - No statements
   */
  readonly policyStatements?: PolicyStatement[];
}

/**
 * Resource Policy for X-Ray
 *
 * Policies define the operations that are allowed on this resource.
 *
 * @resource AWS::XRay::ResourcePolicy
 */
@propertyInjectable
export class ResourcePolicy extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-xray.ResourcePolicy';
  /**
   * The IAM policy document for this resource policy.
   */
  public readonly document = new PolicyDocument();

  constructor(scope: Construct, id: string, props?: ResourcePolicyProps) {
    super(scope, id, {
      physicalName: props?.resourcePolicyName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const l1 = new CfnResourcePolicy(this, 'ResourcePolicy', {
      policyName: Lazy.string({
        produce: () => props?.resourcePolicyName ?? Names.uniqueResourceName(this, {
          maxLength: 128,
          allowedSpecialCharacters: '+=,.@-',
        }),
      }),
      policyDocument: Lazy.string({
        produce: () => JSON.stringify(this.document),
      }),
    });

    this.node.defaultChild = l1;

    if (props?.policyStatements) {
      this.document.addStatements(...props.policyStatements);
    }
  }
}
