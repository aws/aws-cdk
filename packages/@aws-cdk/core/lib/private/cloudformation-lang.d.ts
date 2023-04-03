import { DefaultTokenResolver } from '../resolvable';
/**
 * Routines that know how to do operations at the CloudFormation document language level
 */
export declare class CloudFormationLang {
    /**
     * Turn an arbitrary structure potentially containing Tokens into a JSON string.
     *
     * Returns a Token which will evaluate to CloudFormation expression that
     * will be evaluated by CloudFormation to the JSON representation of the
     * input structure.
     *
     * All Tokens substituted in this way must return strings, or the evaluation
     * in CloudFormation will fail.
     *
     * @param obj The object to stringify
     * @param space Indentation to use (default: no pretty-printing)
     */
    static toJSON(obj: any, space?: number): string;
    /**
     * Turn an arbitrary structure potentially containing Tokens into a YAML string.
     *
     * Returns a Token which will evaluate to CloudFormation expression that
     * will be evaluated by CloudFormation to the YAML representation of the
     * input structure.
     *
     * All Tokens substituted in this way must return strings, or the evaluation
     * in CloudFormation will fail.
     *
     * @param obj The object to stringify
     */
    static toYAML(obj: any): string;
    /**
     * Produce a CloudFormation expression to concat two arbitrary expressions when resolving
     */
    static concat(left: any | undefined, right: any | undefined): any;
}
/**
 * Default Token resolver for CloudFormation templates
 */
export declare const CLOUDFORMATION_TOKEN_RESOLVER: DefaultTokenResolver;
/**
 * Do an intelligent CloudFormation join on the given values, producing a minimal expression
 */
export declare function minimalCloudFormationJoin(delimiter: string, values: any[]): any[];
export declare function isNameOfCloudFormationIntrinsic(name: string): boolean;
