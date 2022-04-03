import { UnknownPrincipal } from '@aws-cdk/aws-iam';
import { IKey } from '@aws-cdk/aws-kms';
import { ArnFormat, IResource, Resource, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDatabase } from './timestream.generated';

/**
 * Timestream Database interface
 */
export interface IDatabase extends IResource {
  /**
   * database ARN
   *
   * @attribute
   */
  readonly databaseArn: string

  /**
   * Database Name
   *
   * @attribute
   */
  readonly databaseName: string
}

/**
 * Database Properties
 */
export interface DatabaseProps {
  /**
   * database name
   *
   * @default None
   */
  readonly databaseName?: string

  /**
   * KMS Key
   *
   * @default None
   */
  readonly kmsKey?: IKey
}


abstract class DatabaseBase extends Resource implements IDatabase {

  /**
   * Import database via ARN
   *
   * @param scope CDK scope (stack or app)
   * @param id The id in the CDK stack
   * @param databaseArn the database ARN
   * @returns Database contruct
   */
  public static fromDatabaseArn(scope: Construct, id: string, databaseArn: string): IDatabase {
    const stack = Stack.of(scope);
    const splitArn = stack.splitArn(databaseArn, ArnFormat.SLASH_RESOURCE_NAME);

    class Import extends DatabaseBase {
      public readonly databaseArn = databaseArn;
      public readonly databaseName = splitArn.resourceName || ''
      public readonly grantPrincipal = new UnknownPrincipal({ resource: this });
    }
    return new Import(scope, id, {
      environmentFromArn: databaseArn,
    });
  }

  public abstract readonly databaseArn: string;
  public abstract readonly databaseName: string;
}

/**
 * Database Class
 */
export class Database extends DatabaseBase {

  /**
   * The name of the Timestream database.
   *
   * @attribute
   */
  public readonly databaseName: string

  /**
   * The ARN of the database
   *
   * @attribute
   */
  public readonly databaseArn: string;

  constructor(scope: Construct, id: string, props?: DatabaseProps) {
    super(scope, id, {
      physicalName: props?.databaseName,
    });

    if (props?.databaseName !== undefined) {
      this.validateDatabaseName(props.databaseName);
    }

    const resource = new CfnDatabase(this, 'Resource', {
      databaseName: this.physicalName,
      kmsKeyId: props?.kmsKey?.keyId,
    });

    this.databaseArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'timestream',
      resource: this.physicalName,
    });
    this.databaseName = this.getResourceNameAttribute(resource.ref);
  }

  private validateDatabaseName(databaseName: string) {
    if (!Token.isUnresolved(databaseName)) {
      const databaseNameLength = Buffer.byteLength(databaseName, 'utf-8');
      if (databaseNameLength < 3 || databaseNameLength > 256) {
        throw new Error(`Database name must be between 3 and 256 bytes. Received: ${databaseName}`);
      }
    }
  }
}