import { WorkflowAction } from './index';

export interface ManualApprovalActionProps {
  readonly comment?: string;
}

export class ManualApprovalAction extends WorkflowAction {
  public readonly comment?: string;

  constructor(name: string, public readonly props: ManualApprovalActionProps) {
    super(name);

    this.comment = props.comment;
  }
}

