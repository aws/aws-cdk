import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, Fn } from '@aws-cdk/cdk';

export interface BootstrapPipelineSourceProps {
  /**
   * The name of the bootstrap pipeline to monitor as defined in
   * `cdk.pipelines.yaml`.
   */
  readonly bootstrap: string;
}

/**
 * An AWS CodePipeline source action that is monitors a CDK bootstrapping
 * pipeline and triggered when new artifacts are published.
 */
export class BootstrapPipelineSource extends cpactions.S3SourceAction {
  public readonly pipelineAttributes: BootstrapPipelineAttributes;

  constructor(scope: Construct, id: string, props: BootstrapPipelineSourceProps) {
    const exportPrefix = `cdk-pipeline:${props.bootstrap}`;

    const attributes: BootstrapPipelineAttributes = {
      bucketName: Fn.importValue(`${exportPrefix}-bucket`),
      objectKey: Fn.importValue(`${exportPrefix}-object-key`),
      toolkitVersion: Fn.importValue(`${exportPrefix}-toolkit-version`),
    };

    const bucket = s3.Bucket.import(scope, `${id}/Bucket`, { bucketName: attributes.bucketName });
    super({
      actionName: 'Pull',
      bucket,
      bucketKey: attributes.objectKey,
      outputArtifactName: 'CloudAssembly'
    });

    this.pipelineAttributes = attributes;
  }
}

/**
 * Attributes of the bootstrap pipeline.
 */
export interface BootstrapPipelineAttributes {
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
  readonly toolkitVersion: string;
}
