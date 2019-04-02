import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import s3 = require('@aws-cdk/aws-s3');
import { CfnOutput, Construct, Fn } from '@aws-cdk/cdk';
import { S3SourceAction } from '../s3/source-action';

export interface CdkSourceActionProps {
  /**
   * The name of the bootstrap pipeline to read sources from.
   */
  readonly bootstrapId: string;
}

const BUCKET_EXPORT = 'bucketName';
const OBJECT_KEY_EXPORT = 'objectKey';

/**
 * An AWS CodePipeline source action that is monitors the output of a boostrap pipeline
 * and triggers the pipeline when a new cloud assembly is available for deployment.
 */
export class CdkSourceAction extends S3SourceAction {
  public static exportArtifacts(scope: Construct, attributes: BootstrapArtifact) {
    const child = new Construct(scope, `BootstrapArtifacts:${attributes.boostrapId}`);

    new CfnOutput(child, 'PublishBucketName', {
      value: attributes.bucketName,
      export: bootstrapExportName(attributes.boostrapId, BUCKET_EXPORT)
    });

    new CfnOutput(child, 'PublishObjectKey', {
      value: attributes.objectKey,
      export: bootstrapExportName(attributes.boostrapId, OBJECT_KEY_EXPORT)
    });
  }

  constructor(scope: Construct, id: string, props: CdkSourceActionProps) {
    const { bucketName, objectKey } = importBootstrapArtifacts(props.bootstrapId);
    super({
      actionName: 'Pull',
      bucket: s3.Bucket.import(scope, `${id}/Bucket`, { bucketName }),
      bucketKey: objectKey,
      outputArtifactName: 'CloudAssembly'
    });
  }

  public get assembly(): codepipeline.Artifact {
    return this.outputArtifact;
  }
}

export interface BootstrapArtifact {
  readonly boostrapId: string;
  readonly bucketName: string;
  readonly objectKey: string;
}

function bootstrapExportName(bootstrapId: string, key: string) {
  return `cdk-pipeline:${bootstrapId}:${key}`;
}

function importBootstrapArtifacts(bootstrapId: string) {
  return {
    bucketName: Fn.importValue(bootstrapExportName(bootstrapId, BUCKET_EXPORT)),
    objectKey: Fn.importValue(bootstrapExportName(bootstrapId, OBJECT_KEY_EXPORT))
  };
}
