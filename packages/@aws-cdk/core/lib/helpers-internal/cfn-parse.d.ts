import { CfnCondition } from '../cfn-condition';
import { CfnElement } from '../cfn-element';
import { CfnMapping } from '../cfn-mapping';
import { CfnResource } from '../cfn-resource';
import { CfnTag } from '../cfn-tag';
import { IResolvable } from '../resolvable';
import { Validator } from '../runtime';
/**
 * The class used as the intermediate result from the generated L1 methods
 * that convert from CloudFormation's UpperCase to CDK's lowerCase property names.
 * Saves any extra properties that were present in the argument object,
 * but that were not found in the CFN schema,
 * so that they're not lost from the final CDK-rendered template.
 */
export declare class FromCloudFormationResult<T> {
    readonly value: T;
    readonly extraProperties: {
        [key: string]: any;
    };
    constructor(value: T);
    appendExtraProperties(prefix: string, properties: {
        [key: string]: any;
    } | undefined): void;
}
/**
 * A property object we will accumulate properties into
 */
export declare class FromCloudFormationPropertyObject<T extends Record<string, any>> extends FromCloudFormationResult<T> {
    private readonly recognizedProperties;
    constructor();
    /**
     * Add a parse result under a given key
     */
    addPropertyResult(cdkPropName: keyof T, cfnPropName: string, result?: FromCloudFormationResult<any>): void;
    addUnrecognizedPropertiesAsExtra(properties: object): void;
}
/**
 * This class contains static methods called when going from
 * translated values received from `CfnParser.parseValue`
 * to the actual L1 properties -
 * things like changing IResolvable to the appropriate type
 * (string, string array, or number), etc.
 *
 * While this file not exported from the module
 * (to not make it part of the public API),
 * it is directly referenced in the generated L1 code.
 *
 */
export declare class FromCloudFormation {
    static getAny(value: any): FromCloudFormationResult<any>;
    static getBoolean(value: any): FromCloudFormationResult<boolean | IResolvable>;
    static getDate(value: any): FromCloudFormationResult<Date | IResolvable>;
    static getString(value: any): FromCloudFormationResult<string>;
    static getNumber(value: any): FromCloudFormationResult<number>;
    static getStringArray(value: any): FromCloudFormationResult<string[]>;
    static getArray<T>(mapper: (arg: any) => FromCloudFormationResult<T>): (x: any) => FromCloudFormationResult<T[]>;
    static getMap<T>(mapper: (arg: any) => FromCloudFormationResult<T>): (x: any) => FromCloudFormationResult<{
        [key: string]: T;
    }>;
    static getCfnTag(tag: any): FromCloudFormationResult<CfnTag>;
    /**
     * Return a function that, when applied to a value, will return the first validly deserialized one
     */
    static getTypeUnion(validators: Validator[], mappers: Array<(x: any) => FromCloudFormationResult<any>>): (x: any) => FromCloudFormationResult<any>;
}
/**
 * An interface that represents callbacks into a CloudFormation template.
 * Used by the fromCloudFormation methods in the generated L1 classes.
 */
export interface ICfnFinder {
    /**
     * Return the Condition with the given name from the template.
     * If there is no Condition with that name in the template,
     * returns undefined.
     */
    findCondition(conditionName: string): CfnCondition | undefined;
    /**
     * Return the Mapping with the given name from the template.
     * If there is no Mapping with that name in the template,
     * returns undefined.
     */
    findMapping(mappingName: string): CfnMapping | undefined;
    /**
     * Returns the element referenced using a Ref expression with the given name.
     * If there is no element with this name in the template,
     * return undefined.
     */
    findRefTarget(elementName: string): CfnElement | undefined;
    /**
     * Returns the resource with the given logical ID in the template.
     * If a resource with that logical ID was not found in the template,
     * returns undefined.
     */
    findResource(logicalId: string): CfnResource | undefined;
}
/**
 * The interface used as the last argument to the fromCloudFormation
 * static method of the generated L1 classes.
 */
export interface FromCloudFormationOptions {
    /**
     * The parser used to convert CloudFormation to values the CDK understands.
     */
    readonly parser: CfnParser;
}
/**
 * The context in which the parsing is taking place.
 *
 * Some fragments of CloudFormation templates behave differently than others
 * (for example, the 'Conditions' sections treats { "Condition": "NameOfCond" }
 * differently than the 'Resources' section).
 * This enum can be used to change the created `CfnParser` behavior,
 * based on the template context.
 */
export declare enum CfnParsingContext {
    /** We're currently parsing the 'Conditions' section. */
    CONDITIONS = 0,
    /** We're currently parsing the 'Rules' section. */
    RULES = 1
}
/**
 * The options for `FromCloudFormation.parseValue`.
 */
export interface ParseCfnOptions {
    /**
     * The finder interface used to resolve references in the template.
     */
    readonly finder: ICfnFinder;
    /**
     * The context we're parsing the template in.
     *
     * @default - the default context (no special behavior)
     */
    readonly context?: CfnParsingContext;
    /**
     * Values provided here will replace references to parameters in the parsed template.
     */
    readonly parameters: {
        [parameterName: string]: any;
    };
}
/**
 * This class contains methods for translating from a pure CFN value
 * (like a JS object { "Ref": "Bucket" })
 * to a form CDK understands
 * (like Fn.ref('Bucket')).
 *
 * While this file not exported from the module
 * (to not make it part of the public API),
 * it is directly referenced in the generated L1 code,
 * so any renames of it need to be reflected in cfn2ts/codegen.ts as well.
 *
 */
export declare class CfnParser {
    private readonly options;
    constructor(options: ParseCfnOptions);
    handleAttributes(resource: CfnResource, resourceAttributes: any, logicalId: string): void;
    private parseCreationPolicy;
    private parseUpdatePolicy;
    private parseDeletionPolicy;
    parseValue(cfnValue: any): any;
    get finder(): ICfnFinder;
    private parseIfCfnIntrinsic;
    private looksLikeCfnIntrinsic;
    private parseFnSubString;
    private handleRulesIntrinsic;
    private specialCaseRefs;
    private specialCaseSubRefs;
    private get parameters();
}
