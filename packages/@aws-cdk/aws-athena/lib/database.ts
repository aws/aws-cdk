import { PolicyStatement } from '@aws-cdk/aws-iam';
import { IBucket } from '@aws-cdk/aws-s3';
import { Aws, Construct, IConstruct } from '@aws-cdk/core';
import { AwsCustomResource } from '@aws-cdk/custom-resources';

/**
 * Creates a Table with the name and the parameters that you specify.
 */
export interface IDatabase extends IConstruct {
  /**
   * The Database name.
   * @attribute
   */
  readonly databaseName: string;
}

/**
 * Properties used to define an Athena Database
 */
export interface DatabaseProps {
  /**
   * The name for the Database.
   * @default none
   */
  readonly databaseName: string;

  /**
   * Establishes the metadata value for the built-in metadata property named `comment` and the value
   * you provide for comment.
   * @default none
   */
  readonly comment: string;

  /**
   * Specifies the location where database files and metastore will exist. The location must be an
   * Amazon S3 location.
   */
   readonly locationBucket: IBucket;

  /**
   * The path part of the S3 Location.
   * @default none
   */
  readonly locationPath?: string;

  /**
   * Allows you to specify custom metadata properties for the database definition.
   * @default none
   */
  readonly databaseProperties?: Map<string, string>;
}

/**
 * An Athena Database
 */
export class Database extends Construct implements IDatabase {
  /**
   * some docstring
   */
  public readonly databaseName: string;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
  super(scope, id);
  this.databaseName = props.databaseName;

  const s3Policy = new PolicyStatement();
  s3Policy.addActions('s3:*');
  s3Policy.addResources(props.locationBucket.arnForObjects('*'));
  s3Policy.addResources(props.locationBucket.bucketArn);

  const athenaPolicy = new PolicyStatement();
  athenaPolicy.addActions('athena:StartQueryExecution');
  athenaPolicy.addAllResources();

  const gluePolicy = new PolicyStatement();
  gluePolicy.addActions('glue:GetDatabase', 'glue:GetTable');
  athenaPolicy.addResources(`arn:aws:glue:${Aws.REGION}:${Aws.ACCOUNT_ID}:catalog`);

  new AwsCustomResource(this, 'CreateAthenaDatabase', {
    onCreate: {
      service: 'Athena',
      action: 'startQueryExecution',
      parameters: {
        QueryString: queryStringBuilder(props),
        ResultConfiguration: {
          OutputLocation: `s3://${props.locationBucket.bucketName}/`
        },
      },
      physicalResourceIdPath: 'QueryExecutionId'
    },
    policyStatements: [s3Policy, athenaPolicy, gluePolicy]
  });
  }
}

function queryStringBuilder(props: DatabaseProps) {
  let queryString = `CREATE DATABASE ${props.databaseName}`;
  if (props.comment) {
    queryString += ` COMMENT ${props.comment}`;
  }
  queryString += ` LOCATION 's3://${props.locationBucket.bucketName}/`;
  if (props.locationPath) {
    queryString += `${props.locationPath}/`;
  }
  queryString += "'";
  if (props.databaseProperties) {
    const propString = propertiesStringBuilder(props.databaseProperties);
    queryString += ` ${propString}`;
  }
  queryString += ";";
  return queryString;
}

function propertiesStringBuilder(databaseProperties: Map<string, string>) {
  const tempStrings: string[] = [];
  databaseProperties.forEach((value: string, key: string) => {
    tempStrings.push(`'${key}'='${value}'`);
  });
  return `(${tempStrings.join(", ")})`;
}