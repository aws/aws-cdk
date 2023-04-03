import { ConstructTree, ConstructTrace } from './construct-tree';
/**
 * Utility class to generate the construct stack trace
 * for a report
 */
export declare class ReportTrace {
    private readonly tree;
    constructor(tree: ConstructTree);
    /**
     * Return a JSON representation of the construct trace
     */
    formatJson(constructPath?: string): ConstructTrace | undefined;
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
    formatPrettyPrinted(constructPath?: string): string;
    private renderPrettyPrintedTraceInfo;
    private trace;
}
