import { schema } from '@aws-cdk/cfnspec';
/**
 * Generate augmentation methods for the given types
 *
 * Augmentation consists of two parts:
 *
 * - Adding method declarations to an interface (IBucket)
 * - Adding implementations for those methods to the base class (BucketBase)
 *
 * The augmentation file must be imported in `index.ts`.
 *
 * ----------------------------------------------------------
 *
 * Generates code similar to the following:
 *
 * ```
 * import <Class>Base from './<class>-base';
 *
 * declare module './<class>-base' {
 *   interface <IClass> {
 *     method(...): Type;
 *   }
 *   interface <ClassBase> {
 *     method(...): Type;
 *   }
 * }
 *
 * <ClassBase>.prototype.<method> = // ...impl...
 * ```
 */
export interface AugmentationsGeneratorOptions {
    /**
    * Path of cloudwatch import to use when generating augmentation source
    * files.
    *
    * @default '@aws-cdk/aws-cloudwatch'
    */
    cloudwatchImport?: string;
}
export declare class AugmentationGenerator {
    private readonly spec;
    private readonly affix;
    private readonly config?;
    readonly outputFile: string;
    private readonly code;
    constructor(moduleName: string, spec: schema.Specification, affix: string, config?: AugmentationsGeneratorOptions | undefined);
    emitCode(): boolean;
    /**
     * Saves the generated file.
     */
    save(dir: string): Promise<string[]>;
    private emitMetricAugmentations;
    private emitMetricFunctionDeclaration;
    private emitMetricFunction;
    private emitSpecificMetricFunctionDeclaration;
    private emitSpecificMetricFunction;
}
