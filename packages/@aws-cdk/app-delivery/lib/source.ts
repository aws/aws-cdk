import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, Fn } from '@aws-cdk/cdk';

export interface BootstrapPipelineSourceProps {
  readonly pipeline: string;
}

export class BootstrapPipelineSource extends cpactions.S3SourceAction {
  public readonly pipelineAttributes: BootstrapPipelineAttributes;

  constructor(scope: Construct, id: string, props: BootstrapPipelineSourceProps) {
    const exportPrefix = `cdk-pipeline:${props.pipeline}`;

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

export interface BootstrapPipelineAttributes {
  readonly bucketName: string;
  readonly objectKey: string;
  readonly toolkitVersion: string;
}
