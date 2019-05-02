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

  export(): DatabaseAttributes;
}

export interface DatabaseAttributes {
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

  public static fromDatabaseArn(scope: Construct, id: string, databaseArn: string): IDatabase {
    class Import extends Construct implements IDatabase {
      public databaseArn = databaseArn;
      public databaseName = scope.node.stack.parseArn(databaseArn).resourceName!;
      public catalogArn = scope.node.stack.formatArn({ service: 'glue', resource: 'catalog' });
      public catalogId = scope.node.stack.accountId;

      public get locationUri(): string {
        throw new Error(`glue.Database.fromDatabaseArn: no "locationUri"`);
      }

      public export(): DatabaseAttributes {
        return {
          catalogArn: this.catalogArn,
          catalogId: this.catalogId,
          databaseName: this.databaseName,
          databaseArn: this.databaseArn,
          locationUri: this.locationUri,
        };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Creates a Database construct that represents an external database.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param attrs A `DatabaseAttributes` object. Can be obtained from a call to `database.export()` or manually created.
   */
  public static fromDatabaseAttributes(scope: Construct, id: string, attrs: DatabaseAttributes): IDatabase {

    class Import extends Construct implements IDatabase {
      public readonly catalogArn = attrs.catalogArn;
      public readonly catalogId = attrs.catalogId;
      public readonly databaseArn = attrs.databaseArn;
      public readonly databaseName = attrs.databaseName;
      public readonly locationUri = attrs.locationUri;
      public export() {
        return attrs;
      }
    }

    return new Import(scope, id);
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
  public export(): DatabaseAttributes {
    return {
      catalogArn: new CfnOutput(this, 'CatalogArn', { value: this.catalogArn }).makeImportValue().toString(),
      catalogId: new CfnOutput(this, 'CatalogId', { value: this.catalogId }).makeImportValue().toString(),
      databaseArn: new CfnOutput(this, 'DatabaseArn', { value: this.databaseArn }).makeImportValue().toString(),
      databaseName: new CfnOutput(this, 'DatabaseName', { value: this.databaseName }).makeImportValue().toString(),
      locationUri: new CfnOutput(this, 'LocationURI', { value: this.locationUri }).makeImportValue().toString()
    };
  }
}
