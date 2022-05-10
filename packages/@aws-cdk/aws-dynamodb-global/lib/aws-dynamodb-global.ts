import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { GlobalTableCoordinator } from './global-table-coordinator';

/**
 * Properties for the multiple DynamoDB tables to mash together into a
 * global table
 */
export interface GlobalTableProps extends cdk.StackProps, dynamodb.TableOptions {
  /**
   * Name of the DynamoDB table to use across all regional tables.
   * This is required for global tables.
   */
  readonly tableName: string;

  /**
   * Array of environments to create DynamoDB tables in.
   * The tables will all be created in the same account.
   */
  readonly regions: string[];
}

/**
 * This class works by deploying an AWS DynamoDB table into each region specified in  GlobalTableProps.regions[],
 * then triggering a CloudFormation Custom Resource Lambda to link them all together to create linked AWS Global DynamoDB tables.
 *
 * @deprecated use `@aws-cdk/aws-dynamodb.Table.replicationRegions` instead
 */
export class GlobalTable extends Construct {
  /**
   * Creates the cloudformation custom resource that launches a lambda to tie it all together
   */
  private lambdaGlobalTableCoordinator: GlobalTableCoordinator;

  /**
   * Creates dynamoDB tables across regions that will be able to be globbed together into a global table
   */
  private readonly _regionalTables = new Array<dynamodb.Table>();

  constructor(scope: Construct, id: string, props: GlobalTableProps) {
    super(scope, id);

    cdk.Annotations.of(this).addWarning('The @aws-cdk/aws-dynamodb-global module has been deprecated in favor of @aws-cdk/aws-dynamodb.Table.replicationRegions');

    this._regionalTables = [];

    if (props.stream != null && props.stream !== dynamodb.StreamViewType.NEW_AND_OLD_IMAGES) {
      throw new Error('dynamoProps.stream MUST be set to dynamodb.StreamViewType.NEW_AND_OLD_IMAGES');
    }

    // need to set this stream specification, otherwise global tables don't work
    // And no way to set a default value in an interface
    const regionalTableProps: dynamodb.TableProps = {
      ...props,
      removalPolicy: props.removalPolicy,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    };

    this.lambdaGlobalTableCoordinator = new GlobalTableCoordinator(scope, id + '-CustomResource', props);

    const scopeStack = cdk.Stack.of(scope);
    // here we loop through the configured regions.
    // in each region we'll deploy a separate stack with a DynamoDB Table with identical properties in the individual stacks
    for (const region of props.regions) {
      const regionalStack = new cdk.Stack(this, id + '-' + region, { env: { region, account: scopeStack.account } });
      const regionalTable = new dynamodb.Table(regionalStack, `${id}-GlobalTable-${region}`, regionalTableProps);
      this._regionalTables.push(regionalTable);

      // deploy the regional stack before the Lambda coordinator stack
      this.lambdaGlobalTableCoordinator.addDependency(regionalStack);
    }
  }

  /**
   * Obtain tables deployed in other each region
   */
  public get regionalTables() {
    return this._regionalTables.map(x => x);
  }
}
