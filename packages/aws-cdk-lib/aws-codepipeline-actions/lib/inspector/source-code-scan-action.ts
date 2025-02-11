import { Construct } from 'constructs';
import { InspectorScanActionBase, InspectorScanActionBaseProps } from './scan-action-base';
import * as codepipeline from '../../../aws-codepipeline';

export interface InspectorSourceCodeScanActionProps extends InspectorScanActionBaseProps {
  /**
   * The source code to scan for vulnerabilities.
   */
  readonly input: codepipeline.Artifact;
}

export class InspectorSourceCodeScanAction extends InspectorScanActionBase {
  constructor(props: InspectorSourceCodeScanActionProps) {
    const baseProps: InspectorScanActionBaseProps & { inputs?: codepipeline.Artifact[] } = {
      ...props,
      inputs: [props.input],
    };
    super(baseProps);
  }

  protected getActionConfiguration(): Record<string, any> {
    return {
      InspectorRunMode: 'SourceCodeScan',
    };
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const config = super.bound(scope, stage, options);

    // allow the Role access to the Bucket for inputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }

    return config;
  }
}
