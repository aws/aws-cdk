import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, Fn } from '@aws-cdk/cdk';

export interface SourceActionProps {
  /**
   * The name of the bootstrap pipeline to monitor as defined in
   * `cdk.pipelines.yaml`.
   */
  readonly bootstrap: string;
}

/**
 * An AWS CodePipeline source action that is monitors the output of a boostrap pipeline
 * and triggers the pipeline when a new cloud assembly is available for deployment.
 */
export class SourceAction extends cpactions.S3SourceAction {
  constructor(scope: Construct, id: string, props: SourceActionProps) {
    const exportPrefix = `cdk-pipeline:${props.bootstrap}`;

    const attributes: BootstrapPipelineAttributes = {
      bucketName: Fn.importValue(`${exportPrefix}-bucket`),
      objectKey: Fn.importValue(`${exportPrefix}-object-key`),
      toolchainVersion: Fn.importValue(`${exportPrefix}-toolchain-version`),
    };

    const bucket = s3.Bucket.import(scope, `${id}/Bucket`, { bucketName: attributes.bucketName });
    super({
      actionName: 'Pull',
      bucket,
      bucketKey: attributes.objectKey,
      outputArtifactName: 'CloudAssembly'
    });
  }

  public get assembly(): codepipeline.Artifact {
    return this.outputArtifact;
  }
}

/**
 * Attributes of the bootstrap pipeline.
 */
interface BootstrapPipelineAttributes {
  /**
   * The bucket name into which the the bootstrap pipeline artifacts are
   * published.
   */
  readonly bucketName: string;

  /**
   * The S3 object key for pipeline artifacts.
   */
  readonly objectKey: string;

  /**
   * The semantic version specification of the CDK CLI to use.
   */
  readonly toolchainVersion: string;
}
