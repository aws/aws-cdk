import dynamodb = require("@aws-cdk/aws-dynamodb");
import cdk = require("@aws-cdk/cdk");
import { LambdaGlobalDynamoDBMaker } from "./lambda-global-dynamodb";

/**
 * Properties for the mutliple DynamoDB tables to mash together into a
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
 */
export class GlobalTable extends cdk.Construct {
  /**
   * Creates the cloudformation custom resource that launches a lambda to tie it all together
   */
  private lambdaGlobalDynamodbMaker: LambdaGlobalDynamoDBMaker;

  /**
   * Creates dynamoDB tables across regions that will be able to be globbed together into a global table
   */
  private readonly _regionalTables = new Array<dynamodb.Table>();

  constructor(scope: cdk.Construct, id: string, props: GlobalTableProps) {
    super(scope, id);
    this._regionalTables = [];
    if (props.streamSpecification != null && props.streamSpecification !== dynamodb.StreamViewType.NewAndOldImages) {
      throw(new TypeError("dynamoProps.streamSpecification MUST be set to dynamodb.StreamViewType.NewAndOldImages"));
    }
    // Need to set this streamSpecification, otherwise global tables don't work
    // And no way to set a default value in an interface
    const stackProps = {
      ...props,
      streamSpecification: dynamodb.StreamViewType.NewAndOldImages
    };
    /**
     * Here we loop through the configured regions.
     * In each region we'll deploy a separate stack with a DynamoDB Table with identical properties in the individual stacks
     */
    for (const reg of props.regions) {
      const regionalStack = new cdk.Stack(this, id + "-" + reg, { env: { region: reg } });
      const regionalTable = new dynamodb.Table(regionalStack, id + '-GlobalTable-' + reg, stackProps);
      this._regionalTables.push(regionalTable);
    }

    this.lambdaGlobalDynamodbMaker = new LambdaGlobalDynamoDBMaker(scope, id + "-CustomResource", props);
    for (const table of this._regionalTables) {
      this.lambdaGlobalDynamodbMaker.customResource.node.addDependency(table);
    }
  }

  /**
   * Obtain tables deployed in other each region
   */
  public get regionalTables() {
    return this._regionalTables.map(x => x);
  }
}
