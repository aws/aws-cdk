import { ConstructTree, ConstructTrace } from './construct-tree';
import { Node } from '../../private/tree-metadata';

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
        `${indentation}${VERTICAL_LINE} Library: ${info?.library}`,
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
        return this.getConstructTrace(treeNode);
      }
    }
    return;
  }
  /**
   * Get the stack trace from the construct node metadata.
   * The stack trace only gets recorded if the node is a `CfnResource`,
   * but the stack trace will have entries for all types of parent construct
   * scopes
   */
  private getTraceMetadata(node?: Node): string[] {
    if (node) {
      const construct = this.tree.getConstructByPath(node.path);
      if (construct) {
        const trace = construct.node.defaultChild?.node.metadata.find(meta => !!meta.trace)?.trace ?? [];
        return Object.create(trace);
      }
    }
    return [];
  }

  /**
   * Construct the stack trace of constructs. This will start with the
   * root of the tree and go down to the construct that has the violation
   */
  private getConstructTrace(node: Node, locations?: string[]): ConstructTrace {
    const trace = this.tree.getTraceFromCache(node.path);
    if (trace) {
      return trace;
    }

    const size = this.nodeSize(node);
    const metadata = (locations ?? this.getTraceMetadata(node)).slice(0, size-1);

    const thisLocation = metadata.pop();
    const constructTrace: ConstructTrace = {
      id: node.id,
      path: node.path,
      child: node.children
        ? this.getConstructTrace(this.getChild(node.children), metadata)
        : undefined,
      library: node.constructInfo?.fqn,
      libraryVersion: node.constructInfo?.version,
      location: thisLocation,
    };
    this.tree.setTraceCache(constructTrace.path, constructTrace);
    return constructTrace;
  }

  /**
   * Get the size of a Node
   */
  private nodeSize(node: Node): number {
    let size = 1;
    if (!node.children) {
      return size;
    }
    let children: Node | undefined = this.getChild(node.children!);
    do {
      size++;
      children = children.children
        ? this.getChild(children.children!)
        : undefined;
    } while (children);

    return size;
  }

  private getChild(children: { [key: string]: Node }): Node {
    return Object.values(children)[0];
  }
}
