/**
 * Constants for DocumentDB integration tests.
 */

/**
 * Latest DocumentDB engine version for provisioned clusters.
 * Available in all DocDB regions.
 *
 * Verify with:
 *   aws docdb describe-db-engine-versions --engine docdb --region <region> \
 *     --query 'DBEngineVersions[].EngineVersion' --output text
 */
export const DOCDB_ENGINE_VERSION = '8.0.0';

/**
 * Parameter group family matching DOCDB_ENGINE_VERSION.
 */
export const DOCDB_PARAMETER_GROUP_FAMILY = 'docdb8.0';

/**
 * Latest engine version compatible with DocumentDB Serverless.
 * Serverless currently only supports 5.0.0.
 *
 * Verify with:
 *   aws docdb describe-orderable-db-instance-options --region <region> \
 *     --db-instance-class db.serverless --engine docdb \
 *     --query 'OrderableDBInstanceOptions[].EngineVersion' --output text
 */
export const DOCDB_SERVERLESS_ENGINE_VERSION = '5.0.0';

/**
 * Regions that support DocumentDB Serverless (db.serverless instance class).
 * Not available in all regions (e.g., eu-north-1).
 *
 * Verify with:
 *   aws docdb describe-orderable-db-instance-options --region <region> \
 *     --db-instance-class db.serverless --engine docdb \
 *     --query 'length(OrderableDBInstanceOptions)' --output text
 */
export const DOCDB_SERVERLESS_SUPPORTED_REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-central-1',
  'ap-northeast-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-south-1',
  'ca-central-1',
  'sa-east-1',
];
