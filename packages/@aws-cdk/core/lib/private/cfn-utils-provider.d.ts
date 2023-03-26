import { Construct } from 'constructs';
/**
 * A custom resource provider for CFN utilities such as `CfnJson`.
 */
export declare class CfnUtilsProvider extends Construct {
    static getOrCreate(scope: Construct): string;
}
/**
 * Utility functions provided by the CfnUtilsProvider
 */
export declare abstract class CfnUtils {
    /**
     * Encode a structure to JSON at CloudFormation deployment time
     *
     * This would have been suitable for the JSON-encoding of abitrary structures, however:
     *
     * - It uses a custom resource to do the encoding, and we'd rather not use a custom
     *   resource if we can avoid it.
     * - It cannot be used to encode objects where the keys of the objects can contain
     *   tokens--because those cannot be represented in the JSON encoding that CloudFormation
     *   templates use.
     *
     * This helper is used by `CloudFormationLang.toJSON()` if and only if it encounters
     * objects that cannot be stringified any other way.
     */
    static stringify(scope: Construct, id: string, value: any): string;
}
