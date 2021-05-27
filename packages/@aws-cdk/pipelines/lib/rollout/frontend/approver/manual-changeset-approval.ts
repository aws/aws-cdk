import { flatten } from '../../_util';
import { ManualApprovalAction } from '../../graph';
import { CreateChangeSetAction, ExecuteChangeSetAction } from '../../graph/cloudformation-actions';
import { AddApproverToGraphOptions, Approver } from './index';

export class ManualChangeSetApproval extends Approver {
  public addToExecutionGraph(options: AddApproverToGraphOptions): void {
    // Insert a manual approval step between ever related `Prepare` and `Deploy` action.
    for (const leaf of flatten(options.deploymentGraph.sortedLeaves())) {
      // Find every "Deploy" action, the related Prepare action will be in its dependencies
      if (!(leaf instanceof ExecuteChangeSetAction)) { continue; }

      const deployAction = leaf;
      const prepareAction = deployAction.dependencies.find(x => x instanceof CreateChangeSetAction);

      // Something weird is going on, let's ignore this one
      if (!prepareAction) { continue; }

      const approval = new ManualApprovalAction('Approve', {
        comment: `Review and approve the change set for Stack '${deployAction.props.stackName}'`,
      });

      // Add in the same subgraph between the other 2 actions
      deployAction.parentGraph?.add(approval);
      deployAction.dependOn(approval);
      approval.dependOn(prepareAction);
    }
  }
}