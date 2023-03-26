import { Construct } from 'constructs';
import { Intrinsic } from '../../private/intrinsic';
import { Reference } from '../../reference';
import { Stack } from '../../stack';
/**
 * Properties for an ExportReader
 */
export interface ExportWriterProps {
    /**
     * The AWS region to read Stack exports from
     *
     * @default - the stack region
     */
    readonly region?: string;
}
/**
 * Creates a custom resource that will return a list of stack exports from a given
 * AWS region. The export can then be referenced by the export name.
 *
 *
 * @example
 * declare const app: App;
 * const stack1 = new Stack(app, 'East1Stack', { env: { region: 'us-east-1' } });
 * new CfnOutput(stack1, 'Output', { value: 'someValue', exportName: 'someName' });
 *
 * const stack2 = new Stack(app, 'East2Stack', { env: { region: 'us-east-2' } });
 * const exportReader = new ExportReader(stack2, 'ExportReader', { region: 'us-east-1' });
 * const anotherResource = new CfnResource(stack2, 'AnotherResource', {
 *   Parameters: {
 *     SomeParam: exportReader.importValue('someName'),
 *   },
 * });
 *
 * @internal - this is intentionally not exported from core
 */
export declare class ExportWriter extends Construct {
    static getOrCreate(scope: Construct, uniqueId: string, props: ExportWriterProps): ExportWriter;
    private readonly _references;
    constructor(scope: Construct, id: string, props: ExportWriterProps);
    /**
     * Register a reference with the writer and returns a CloudFormation Stack export by name
     *
     * The value will be "exported" via the ExportWriter. It will perform
     * the export by creating an SSM parameter in the region that the consuming
     * stack is created.
     *
     * @param exportName the unique name associated with the export
     * @param reference the value that will be exported
     * @returns a reference to the reader custom resource
     */
    exportValue(exportName: string, reference: Reference, importStack: Stack): Intrinsic;
    /**
     * Add the export to the export reader which is created in the importing stack
     */
    private addToExportReader;
}
