import codepipeline = require('@aws-cdk/aws-codepipeline');
import { Construct } from '@aws-cdk/cdk';
import { BootstrapPipelineSource } from './pipeline-source';

const TYPE_MARKER = '4501D193-76B7-45D6-836E-3E657F21AD69';

export interface DeploymentPipelineProps extends codepipeline.PipelineProps {
  /**
   * The name of the bootstrap pipeline to monitor as defined in
   * `cdk.pipelines.yaml`.
   */
  readonly bootstrap: string;
}

/**
 * A CodePipeline with a built-in source stage which is wired to a bootstrap
 * pipeline.
 */
export class DeploymentPipeline extends codepipeline.Pipeline {
  public static isApplicationPipeline(obj: any): obj is DeploymentPipeline {
    return (obj as any)._marker === TYPE_MARKER;
  }

  public readonly source: BootstrapPipelineSource;

  constructor(scope: Construct, id: string, props: DeploymentPipelineProps) {
    super(scope, id);

    Object.defineProperty(this, '_marker', { value: TYPE_MARKER });

    const stages = props.stages || [];
    delete (props as any).stages;

    const source = new BootstrapPipelineSource(this, 'Source', {
      bootstrap: props.bootstrap
    });

    this.source = source;

    // first add the mandatory source stage to monitor the bootstrap pipeline for changes.
    this.addStage({ name: 'Source', actions: [ source ] });

    // add all other stages.
    for (const stage of stages) {
      this.addStage(stage);
    }
  }
}
