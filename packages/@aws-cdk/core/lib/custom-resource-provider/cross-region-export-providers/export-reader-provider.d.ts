import { Construct } from 'constructs';
import { CfnResource } from '../../cfn-resource';
import { Intrinsic } from '../../private/intrinsic';
/**
 * Properties for an ExportReader
 */
export interface ExportReaderProps {
}
/**
 * Creates a custom resource that will return a list of stack imports from a given
 * The export can then be referenced by the export name.
 *
 * @internal - this is intentionally not exported from core
 */
export declare class ExportReader extends Construct {
    static getOrCreate(scope: Construct, uniqueId: string, _props?: ExportReaderProps): ExportReader;
    private readonly importParameters;
    private readonly customResource;
    constructor(scope: Construct, id: string, _props?: ExportReaderProps);
    /**
     * This is the only way to add a dependency on a custom resource currently
     */
    addDependency(resource: CfnResource): void;
    /**
     * Register a reference with the writer and returns a CloudFormation Stack export by name
     *
     * The value will be "exported" via the ExportWriter. It will perform
     * the export by creating an SSM parameter in the region that the consuming
     * stack is created.
     *
     * @param exports map of unique name associated with the export to SSM Dynamic reference
     */
    importValue(name: string, value: Intrinsic): Intrinsic;
}
