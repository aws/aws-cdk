import { ManualApprovalAction } from '../../workflow';
import { AddApproverToWorkflowOptions, IApprover } from '../artifactable';

export class ManualApproval implements IApprover {
  public addToWorkflow(options: AddApproverToWorkflowOptions): void {
    const approval = new ManualApprovalAction('Approve', {
      comment: `Review and approve the successful deployment of '${options.deploymentWorkflow.name}'`,
    });

    options.parent.add(approval);
  }
}
