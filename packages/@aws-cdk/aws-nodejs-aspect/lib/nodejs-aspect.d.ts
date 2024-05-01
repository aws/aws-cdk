import { IConstruct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IAspect } from 'aws-cdk-lib/core';
/**
 * Runtime aspect
 */
declare abstract class RuntimeAspectsBase implements IAspect {
    /**
     * The string key for the runtime
     */
    readonly targetRuntime: string;
    constructor(runtime: string);
    visit(construct: IConstruct): void;
    private handleAwsCustomResource;
    private handleCustomResourceProvider;
    private handleProvider;
    private handleReceiptRuleSet;
    /**
   *Runtime Validation
   *
   */
    private isValidRuntime;
    private getRuntimeProperty;
    private getChildFunctionNode;
    private getRuntimeFamily;
}
/**
 * RuntimeAspect
 */
export declare class RuntimeAspect extends RuntimeAspectsBase {
    constructor(key: string);
}
export declare class NodeJsAspect {
    static modifyRuntimeTo(key: lambda.Runtime): RuntimeAspect;
}
export {};
