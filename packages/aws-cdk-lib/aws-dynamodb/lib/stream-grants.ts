import type { ITableRef } from './dynamodb.generated';
import * as perms from './perms';
import * as iam from '../../aws-iam';
import type * as kms from '../../aws-kms';

/**
 * Construction properties for StreamGrants
 */
export interface StreamGrantsProps {
  /**
   * The table this stream is for
   */
  readonly table: ITableRef;

  /**
   * The ARN of the Stream
   */
  readonly tableStreamArn: string;

  /**
   * The encryption key of the table
   *
   * Required permissions will be added to the key as well.
   *
   * @default - No key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A set of permissions to grant on a Table Stream
 */
export class StreamGrants {
  private readonly table: ITableRef;
  private readonly tableStreamArn: string;
  private readonly encryptionKey?: kms.IKey;

  constructor(props: StreamGrantsProps) {
    this.table = props.table;
    this.tableStreamArn = props.tableStreamArn;
    this.encryptionKey = props?.encryptionKey;
  }

  /**
   * Adds an IAM policy statement associated with this table's stream to an
   * IAM principal's policy.
   *
   * If `encryptionKey` is present, appropriate grants to the key needs to be added
   * separately using the `table.encryptionKey.grant*` methods.
   *
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:DescribeStream", "dynamodb:GetRecords", ...)
   */
  public actions(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.tableStreamArn],
      scope: this.table,
    });
  }

  /**
   * Permits an IAM Principal to list streams attached to current dynamodb table.
   *
   * @param grantee The principal (no-op if undefined)
   */
  public list(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['dynamodb:ListStreams'],
      resourceArns: ['*'],
    });
  }

  /**
   * Permits an IAM principal all stream data read operations for this
   * table's stream:
   * DescribeStream, GetRecords, GetShardIterator, ListStreams.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  public read(grantee: iam.IGrantable): iam.Grant {
    this.list(grantee);
    this.encryptionKey?.grant(grantee, ...perms.KEY_READ_ACTIONS);
    return iam.Grant.addToPrincipal({
      grantee,
      actions: perms.READ_STREAM_DATA_ACTIONS,
      resourceArns: [this.tableStreamArn],
      scope: this.table,
    });
  }
}

