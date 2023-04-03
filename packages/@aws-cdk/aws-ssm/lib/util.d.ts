import { IConstruct } from 'constructs';
export declare const AUTOGEN_MARKER = "$$autogen$$";
export interface ArnForParameterNameOptions {
    readonly physicalName?: string;
    readonly simpleName?: boolean;
}
/**
 * Renders an ARN for an SSM parameter given a parameter name.
 * @param scope definition scope
 * @param parameterName the parameter name to include in the ARN
 * @param physicalName optional physical name specified by the user (to auto-detect separator)
 */
export declare function arnForParameterName(scope: IConstruct, parameterName: string, options?: ArnForParameterNameOptions): string;
