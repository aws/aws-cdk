import { FileSet } from './file-set';
import { Step } from './step';

export interface ManualApprovalProps {
  readonly comment?: string;
}

export class ManualApproval extends Step {
  public readonly primaryOutput?: FileSet | undefined;
  public readonly comment?: string;

  constructor(id: string, props: ManualApprovalProps = {}) {
    super(id);

    this.comment = props.comment;
  }
}