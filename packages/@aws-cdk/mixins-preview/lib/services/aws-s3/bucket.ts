import type { IConstruct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { IMixin } from '../../core';

/**
 * S3-specific mixin for auto-deleting objects.
 */
export class AutoDeleteObjects implements IMixin {
  supports(construct: IConstruct): boolean {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(construct: IConstruct): IConstruct {
    if (construct instanceof s3.CfnBucket) {
      // This would typically involve creating a custom resource
      // For now, we'll just mark it with metadata
      construct.node.addMetadata('autoDeleteObjects', true);
    }
    return construct;
  }
}

/**
 * S3-specific mixin for enabling versioning.
 */
export class EnableVersioning implements IMixin {
  supports(construct: IConstruct): boolean {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(construct: IConstruct): IConstruct {
    if (construct instanceof s3.CfnBucket) {
      construct.versioningConfiguration = {
        status: 'Enabled',
      };
    }
    return construct;
  }
}
