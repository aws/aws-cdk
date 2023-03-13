import { Assertion } from '../assertion';
import { StackInspector } from '../inspector';
export declare enum MatchStyle {
    /** Requires an exact match */
    EXACT = "exactly",
    /** Allows any change that does not cause a resource replacement */
    NO_REPLACES = "no replaces",
    /** Allows additions, but no updates */
    SUPERSET = "superset"
}
export declare function exactlyMatchTemplate(template: {
    [key: string]: any;
}): Assertion<StackInspector>;
export declare function beASupersetOfTemplate(template: {
    [key: string]: any;
}): Assertion<StackInspector>;
export declare function matchTemplate(template: {
    [key: string]: any;
}, matchStyle?: MatchStyle): Assertion<StackInspector>;
