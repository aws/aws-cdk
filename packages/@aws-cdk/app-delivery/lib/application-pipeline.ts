import codepipeline = require('@aws-cdk/aws-codepipeline');
import { Construct, Environment, Stack } from '@aws-cdk/cdk';
import { BootstrapPipelineSource } from './source';

const TYPE_MARKER = '4501D193-76B7-45D6-836E-3E657F21AD69';

export interface ApplicationPipelineProps extends codepipeline.PipelineProps {
  readonly bootstrap: string;
}

export class ApplicationPipeline extends codepipeline.Pipeline {
  public static isApplicationPipeline(obj: any): obj is ApplicationPipeline {
    return (obj as any)._marker === TYPE_MARKER;
  }

  public readonly source: BootstrapPipelineSource;

  constructor(scope: Construct, id: string, props: ApplicationPipelineProps) {
    super(scope, id);

    Object.defineProperty(this, '_marker', { value: TYPE_MARKER });

    const stages = props.stages || [];
    delete (props as any).stages;

    const source = new BootstrapPipelineSource(this, 'Source', {
      pipeline: props.bootstrap
    });

    this.source = source;

    this.addStage({
      name: 'Source',
      actions: [ source ]
    });

    for (const stage of stages) {
      this.addStage(stage);
    }
  }
}

export interface ApplicationPipelineStackProps extends ApplicationPipelineProps {
  /**
   * The name of the application pipeline stack.
   * @default - generated from the unique ID of the stack construct.
   */
  readonly stackName?: string;

  /**
   * Whether this stack should be deployed automatically when running `cdk deploy`.
   * @default true
   */
  readonly autoDeploy?: boolean;

  /**
   * Account/region in which this stack should be deployed.
   */
  readonly env?: Environment;
}

/**
 * A stack that includes a single application pipeline.
 */
export class ApplicationPipelineStack extends Stack {
  public readonly pipeline: ApplicationPipeline;

  constructor(scope: Construct, id: string, props: ApplicationPipelineStackProps) {
    super(scope, id, {
      autoDeploy: props.autoDeploy,
      env: props.env,
      stackName: props.stackName
    });

    this.pipeline = new ApplicationPipeline(this, 'ApplicationPipeline', props);
  }
}
