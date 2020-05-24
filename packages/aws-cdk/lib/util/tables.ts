import * as cfnDiff from '@aws-cdk/cloudformation-diff';

export function renderTable(cells: string[][], columns?: number) {
  // The cfnDiff module has logic for terminal-width aware table
  // formatting (and nice colors), let's just reuse that.
  return cfnDiff.formatTable(cells, columns);
}
