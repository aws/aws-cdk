import { ConstructTree, ConstructTrace } from './construct-tree';

const STARTER_LINE = '└── ';
const VERTICAL_LINE = '│';

/**
 * Utility class to generate the construct stack trace
 * for a report
 */
export class ReportTrace {
  constructor(private readonly tree: ConstructTree) {}

  /**
   * Return a JSON representation of the construct trace
   */
  public formatJson(constructPath?: string): ConstructTrace | undefined {
    return this.trace(constructPath);
  }

  /**
   * This will render something like this:
   *
   *   Creation Stack:
   *     └──  MyStack (MyStack)
   *          │ Library: aws-cdk-lib.Stack
   *          │ Library Version: 2.50.0
   *          │ Location: Object.<anonymous> (/home/hallcor/tmp/cdk-tmp-app/src/main.ts:25:20)
   *          └──  MyCustomL3Construct (MyStack/MyCustomL3Construct)
   *               │ Library: N/A - (Local Construct)
   *               │ Library Version: N/A
   *               │ Location: new MyStack (/home/hallcor/tmp/cdk-tmp-app/src/main.ts:15:20)
   *               └──  Bucket (MyStack/MyCustomL3Construct/Bucket)
   *                    │ Library: aws-cdk-lib/aws-s3.Bucket
   *                    │ Library Version: 2.50.0
   *                    │ Location: new MyCustomL3Construct (/home/hallcor/tmp/cdk-tmp-app/src/main.ts:9:20)/
   */
  public formatPrettyPrinted(constructPath?: string): string {
    const trace = this.formatJson(constructPath);
    return this.renderPrettyPrintedTraceInfo(trace);
  }

  private renderPrettyPrintedTraceInfo(info?: ConstructTrace, indent?: string, start: string = STARTER_LINE): string {
    const notAvailableMessage = '\tConstruct trace not available. Rerun with `--debug` to see trace information';
    if (info) {
      const indentation = indent ?? ' '.repeat(STARTER_LINE.length+1);
      const result: string[] = [
        `${start} ${info?.id} (${info?.path})`,
        `${indentation}${VERTICAL_LINE} Construct: ${info?.construct}`,
        `${indentation}${VERTICAL_LINE} Library Version: ${info?.libraryVersion}`,
        `${indentation}${VERTICAL_LINE} Location: ${info?.location}`,
        ...info?.child ? [this.renderPrettyPrintedTraceInfo(info?.child, ' '.repeat(indentation.length+STARTER_LINE.length+1), indentation+STARTER_LINE)] : [],
      ];
      return result.join('\n\t');
    }
    return notAvailableMessage;
  }

  private trace(constructPath?: string): ConstructTrace | undefined {
    if (constructPath) {
      const treeNode = this.tree.getTreeNode(constructPath);
      if (treeNode) {
        return this.tree.getTrace(treeNode);
      }
    }
    return;
  }
}
