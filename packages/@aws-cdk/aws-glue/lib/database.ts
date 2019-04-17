import s3 = require('@aws-cdk/aws-s3');
import { CfnOutput, Construct, IResource, Resource } from '@aws-cdk/cdk';
import { CfnDatabase } from './glue.generated';

export interface IDatabase extends IResource {
  /**
   * The ARN of the catalog.
   */
  readonly catalogArn: string;

  /**
   * The catalog id of the database (usually, the AWS account id)
   */
  readonly catalogId: string;

  /**
   * The ARN of the database.
   */
  readonly databaseArn: string;

  /**
   * The name of the database.
   */
  readonly databaseName: string;

  /**
   * The location of the database (for example, an HDFS path).
   */
  readonly locationUri: string;

  export(): DatabaseImportProps;
}

export interface DatabaseImportProps {
  readonly catalogArn: string;
  readonly catalogId: string;
  readonly databaseArn: string;
  readonly databaseName: string;
  readonly locationUri: string;
}

export interface DatabaseProps {
  /**
   * The name of the database.
   */
  readonly databaseName: string;

  /**
   * The location of the database (for example, an HDFS path).
   *
   * @default a bucket is created and the database is stored under s3://<bucket-name>/<database-name>
   */
  readonly locationUri?: string;
}

/**
 * A Glue database.
 */
export class Database extends Resource {
  /**
   * Creates a Database construct that represents an external database.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param props A `DatabaseImportProps` object. Can be obtained from a call to `database.export()` or manually created.
   */
  public static import(scope: Construct, id: string, props: DatabaseImportProps): IDatabase {
    return new ImportedDatabase(scope, id, props);
  }

  /**
   * ARN of the Glue catalog in which this database is stored.
   */
  public readonly catalogArn: string;

  /**
   * ID of the Glue catalog in which this database is stored.
   */
  public readonly catalogId: string;

  /**
   * ARN of this database.
   */
  public readonly databaseArn: string;

  /**
   * Name of this database.
   */
  public readonly databaseName: string;

  /**
   * Location URI of this database.
   */
  public readonly locationUri: string;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    if (props.locationUri) {
      this.locationUri = props.locationUri;
    } else {
      const bucket = new s3.Bucket(this, 'Bucket');
      this.locationUri = `s3://${bucket.bucketName}/${props.databaseName}`;
    }

    this.catalogId = this.node.stack.accountId;
    const resource = new CfnDatabase(this, 'Resource', {
      catalogId: this.catalogId,
      databaseInput: {
        name: props.databaseName,
        locationUri: this.locationUri
      }
    });

    // see https://docs.aws.amazon.com/glue/latest/dg/glue-specifying-resource-arns.html#data-catalog-resource-arns
    this.databaseName = resource.databaseName;
    this.databaseArn = this.node.stack.formatArn({
      service: 'glue',
      resource: 'database',
      resourceName: this.databaseName
    });
    // catalogId is implicitly the accountId, which is why we don't pass the catalogId here
    this.catalogArn = this.node.stack.formatArn({
      service: 'glue',
      resource: 'catalog'
    });
  }

  /**
   * Exports this database from the stack.
   */
  public export(): DatabaseImportProps {
    return {
      catalogArn: new CfnOutput(this, 'CatalogArn', { value: this.catalogArn }).makeImportValue().toString(),
      catalogId: new CfnOutput(this, 'CatalogId', { value: this.catalogId }).makeImportValue().toString(),
      databaseArn: new CfnOutput(this, 'DatabaseArn', { value: this.databaseArn }).makeImportValue().toString(),
      databaseName: new CfnOutput(this, 'DatabaseName', { value: this.databaseName }).makeImportValue().toString(),
      locationUri: new CfnOutput(this, 'LocationURI', { value: this.locationUri }).makeImportValue().toString()
    };
  }
}

class ImportedDatabase extends Construct implements IDatabase {
  public readonly catalogArn: string;
  public readonly catalogId: string;
  public readonly databaseArn: string;
  public readonly databaseName: string;
  public readonly locationUri: string;

  constructor(parent: Construct, name: string, private readonly props: DatabaseImportProps) {
    super(parent, name);
    this.catalogArn = props.catalogArn;
    this.catalogId = props.catalogId;
    this.databaseArn = props.databaseArn;
    this.databaseName = props.databaseName;
    this.locationUri = props.locationUri;
  }

  public export() {
    return this.props;
  }
}
