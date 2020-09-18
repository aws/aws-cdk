import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';
import { IInstanceEngine } from '../instance-engine';

/** Common base of `DatabaseInstanceProps` and `DatabaseClusterBaseProps` that has only the S3 props */
export interface DatabaseS3ImportExportProps {
  readonly s3ImportRole?: iam.IRole;
  readonly s3ImportBuckets?: s3.IBucket[];
  readonly s3ExportRole?: iam.IRole;
  readonly s3ExportBuckets?: s3.IBucket[];
}

/**
 * Validates the S3 import/export props and returns the import/export roles, if any.
 * If `combineRoles` is true, will reuse the import role for export (or vice versa) if possible.
 *
 * Notably, `combineRoles` is (by default) set to true for instances, but false for clusters.
 * This is because the `combineRoles` functionality is most applicable to instances and didn't exist
 * for the initial clusters implementation. To maintain backwards compatibility, it is set to false for clusters.
 */
export function setupS3ImportExport(
  scope: Construct,
  props: DatabaseS3ImportExportProps,
  combineRoles?: boolean): { s3ImportRole?: iam.IRole, s3ExportRole?: iam.IRole } {

  let s3ImportRole = props.s3ImportRole;
  let s3ExportRole = props.s3ExportRole;

  if (props.s3ImportBuckets && props.s3ImportBuckets.length > 0) {
    if (props.s3ImportRole) {
      throw new Error('Only one of s3ImportRole or s3ImportBuckets must be specified, not both.');
    }

    s3ImportRole = (combineRoles && s3ExportRole) ? s3ExportRole : new iam.Role(scope, 'S3ImportRole', {
      assumedBy: new iam.ServicePrincipal('rds.amazonaws.com'),
    });
    for (const bucket of props.s3ImportBuckets) {
      bucket.grantRead(s3ImportRole);
    }
  }

  if (props.s3ExportBuckets && props.s3ExportBuckets.length > 0) {
    if (props.s3ExportRole) {
      throw new Error('Only one of s3ExportRole or s3ExportBuckets must be specified, not both.');
    }

    s3ExportRole = (combineRoles && s3ImportRole) ? s3ImportRole : new iam.Role(scope, 'S3ExportRole', {
      assumedBy: new iam.ServicePrincipal('rds.amazonaws.com'),
    });
    for (const bucket of props.s3ExportBuckets) {
      bucket.grantReadWrite(s3ExportRole);
    }
  }

  return { s3ImportRole, s3ExportRole };
}

export function engineDescription(engine: IInstanceEngine) {
  return engine.engineType + (engine.engineVersion?.fullVersion ? `-${engine.engineVersion.fullVersion}` : '');
}
