/**
 * Inspector that maintains an attribute bag
 */
export declare class TreeInspector {
    /**
     * Represents the bag of attributes as key-value pairs.
     */
    readonly attributes: {
        [key: string]: any;
    };
    /**
     * Adds attribute to bag. Keys should be added by convention to prevent conflicts
     * i.e. L1 constructs will contain attributes with keys prefixed with aws:cdk:cloudformation
     *
     * @param key - key for metadata
     * @param value - value of metadata.
     */
    addAttribute(key: string, value: any): void;
}
/**
 * Interface for examining a construct and exposing metadata.
 *
 */
export interface IInspectable {
    /**
     * Examines construct
     *
     * @param inspector - tree inspector to collect and process attributes
     */
    inspect(inspector: TreeInspector): void;
}
