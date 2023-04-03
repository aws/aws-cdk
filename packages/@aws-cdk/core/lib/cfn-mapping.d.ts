import { Construct } from 'constructs';
import { CfnRefElement } from './cfn-element';
declare type Mapping = {
    [k1: string]: {
        [k2: string]: any;
    };
};
export interface CfnMappingProps {
    /**
     * Mapping of key to a set of corresponding set of named values.
     * The key identifies a map of name-value pairs and must be unique within the mapping.
     *
     * For example, if you want to set values based on a region, you can create a mapping
     * that uses the region name as a key and contains the values you want to specify for
     * each specific region.
     *
     * @default - No mapping.
     */
    readonly mapping?: Mapping;
    readonly lazy?: boolean;
}
/**
 * Represents a CloudFormation mapping.
 */
export declare class CfnMapping extends CfnRefElement {
    private mapping;
    private readonly lazy?;
    private lazyRender;
    private lazyInformed;
    constructor(scope: Construct, id: string, props?: CfnMappingProps);
    /**
     * Sets a value in the map based on the two keys.
     */
    setValue(key1: string, key2: string, value: any): void;
    /**
     * @returns A reference to a value in the map based on the two keys.
     */
    findInMap(key1: string, key2: string): string;
    /**
     * @internal
     */
    _toCloudFormation(): object;
    private informLazyUse;
    private validateMapping;
    private validateAlphanumeric;
}
export {};
