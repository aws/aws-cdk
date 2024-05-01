import { IConstruct } from 'constructs';
import { IAspect } from 'aws-cdk-lib/core';
/**
 * Runtime aspect base class to walk through a given construct tree and modify runtime to the provided input value.
 */
declare abstract class RuntimeAspectBase implements IAspect {
    /**
     * The runtime that the aspect will target for updates while walking the construct tree.
     */
    private readonly targetRuntime;
    constructor(runtime: string);
    /**
     * Below visit method changes runtime value of custom resource lambda functions.
     * For more details on how aspects work https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Aspects.html
     */
    visit(construct: IConstruct): void;
    private handleAwsCustomResource;
    private handleCustomResourceProvider;
    private handleProvider;
    private handleReceiptRuleSet;
    /**
    * Validates whether runtime belongs to correct familty i.e. NodeJS
    */
    private isValidRuntime;
    /**
     * @param node
     * @returns Runtime name of a given node.
     */
    private getRuntimeProperty;
    /**
     *
     * @param node
     * @returns Child lambda function node
     */
    private getChildFunctionNode;
    /**
     *
     * @param runtime
     * @returns Runtime family for a given input runtime name eg. nodejs18.x
     */
    private getRuntimeFamily;
}
/**
 * RuntimeAspect class to Update lambda Runtime for a given construct tree, currently supports only nodejs20.x
 */
export declare class RuntimeAspect extends RuntimeAspectBase {
    /**
     * Updates lambda Runtime value to nodejs20.x
     */
    static nodejs20(): RuntimeAspect;
    constructor(runtime: string);
}
export {};
