/**
 * Filter rules for Lambda event filtering
 */
export declare class FilterRule {
    /**
     * Null comparison operator
     */
    static null(): string[];
    /**
     * Empty comparison operator
     */
    static empty(): string[];
    /**
     * Equals comparison operator
     */
    static isEqual(item: string | number): any;
    /**
     * Or comparison operator
     */
    static or(...elem: string[]): string[];
    /**
     * Not equals comparison operator
     */
    static notEquals(elem: string): {
        [key: string]: string[];
    }[];
    /**
     * Numeric range comparison operator
     */
    static between(first: number, second: number): {
        [key: string]: any[];
    }[];
    /**
     * Exists comparison operator
     */
    static exists(): {
        [key: string]: boolean;
    }[];
    /**
     * Not exists comparison operator
     */
    static notExists(): {
        [key: string]: boolean;
    }[];
    /**
     * Begins with comparison operator
     */
    static beginsWith(elem: string): {
        [key: string]: string;
    }[];
}
/**
 * Filter criteria for Lambda event filtering
 */
export declare class FilterCriteria {
    /**
     * Filter for event source
     */
    static filter(filter: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
