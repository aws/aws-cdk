import { Construct } from 'constructs';
import { CfnTablePolicy } from 'aws-cdk-lib/aws-s3tables';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy, Resource } from 'aws-cdk-lib/core';
import { ITable } from './table';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

/**
 * Parameters for constructing a TablePolicy
 */
export interface TablePolicyProps {
  /**
   * The associated table
   */
  readonly table: ITable;
  /**
   * The policy document for the table's resource policy
   * @default undefined An empty iam.PolicyDocument will be initialized
   */
  readonly resourcePolicy?: iam.PolicyDocument;
  /**
   * Policy to apply when the policy is removed from this stack.
   *
   * @default - RemovalPolicy.DESTROY.
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * A  Policy for S3 Tables.
 *
 * You will almost never need to use this construct directly.
 * Instead, Table.addToResourcePolicy can be used to add more policies to your table directly
 */
@propertyInjectable
export class TablePolicy extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3tables-alpha.TablePolicy';
  /**
   * The IAM PolicyDocument containing permissions represented by this policy.
   */
  public readonly document: iam.PolicyDocument;
  /**
   * @internal The underlying policy resource.
   */
  private readonly _resource: CfnTablePolicy;

  constructor(scope: Construct, id: string, props: TablePolicyProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Use default policy if not provided with props
    this.document = props.resourcePolicy || new iam.PolicyDocument({});

    this._resource = new CfnTablePolicy(this, id, {
      tableArn: props.table.tableArn,
      resourcePolicy: this.document,
    });

    if (props.removalPolicy) {
      this._resource.applyRemovalPolicy(props.removalPolicy);
    }
  }
}
