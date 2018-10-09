import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');

// tslint:disable-next-line:no-empty-interface
export interface ManualApprovalActionProps extends actions.CommonActionProps,
    actions.CommonActionConstructProps {
}

/**
 * Manual approval action.
 */
export class ManualApprovalAction extends actions.Action {
  constructor(parent: cdk.Construct, name: string, props: ManualApprovalActionProps) {
    super(parent, name, {
      category: actions.ActionCategory.Approval,
      provider: 'Manual',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 0, maxOutputs: 0 },
      ...props,
    });
  }
}
