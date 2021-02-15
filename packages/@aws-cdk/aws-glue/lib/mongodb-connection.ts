import * as constructs from 'constructs';
import { Connection, ConnectionOptions, ConnectionType } from './connection';

/**
 * Construction properties for {@link MongoDBConnection}
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/connection-mongodb.html
 */
export interface MongoDBConnectionProps extends ConnectionOptions {
  /**
   * The MongoDB database to read from.
   */
  readonly database: string;

  /**
   * The MongoDB collection to read from.
   */
  readonly collection: string;

  /**
   * If true, then AWS Glue initiates an SSL connection.
   *
   * @default false
   */
  readonly ssl?: boolean;

  /**
   * If true and ssl is true, then AWS Glue performs a domain match check.
   *
   * @default true
   */
  readonly sslDomainMatch?: boolean;

  /**
   * The number of documents to return per batch, used within the cursor of internal batches.
   *
   * @default unknown
   */
  readonly batchSize?: number;


  /**
   * The class name of the partitioner for reading input data from MongoDB. The connector provides the following partitioners:
   * - MongoDefaultPartitioner (default)
   * - MongoSamplePartitioner (Requires MongoDB 3.2 or later)
   * - MongoShardedPartitioner
   * - MongoSplitVectorPartitioner
   * - MongoPaginateByCountPartitioner
   * - MongoPaginateBySizePartitioner
   *
   * @default MongoDefaultPartitioner
   */
  readonly partitioner?: string;
}

/**
 * An AWS Glue connection to a MongoDB source.
 */
export class MongoDBConnection extends Connection {

  constructor(scope: constructs.Construct, id: string, props: MongoDBConnectionProps) {
    super(scope, id, {
      ...props,
      type: ConnectionType.MONGODB,
      properties: {
        database: props.database,
        collection: props.collection,
      },
    });
    if (props.ssl !== undefined) {
      this.addProperty('ssl', props.ssl.toString());
    }
    if (props.sslDomainMatch !== undefined) {
      this.addProperty('ssl.domain_match', props.sslDomainMatch.toString());
    }
    if (props.batchSize !== undefined) {
      this.addProperty('batchSize', props.batchSize.toString());
    }
    if (props.partitioner !== undefined) {
      this.addProperty('partitioner', props.partitioner);
    }
  }
}
