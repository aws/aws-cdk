import { FileSet } from './file-set';
import { Step } from './step';

export interface ManualApprovalStepProps {
  readonly comment?: string;
}

export class ManualApprovalStep extends Step {
  public readonly primaryOutput?: FileSet | undefined;
  public readonly comment?: string;

  constructor(id: string, props: ManualApprovalStepProps = {}) {
    super(id);

    this.comment = props.comment;
  }
}