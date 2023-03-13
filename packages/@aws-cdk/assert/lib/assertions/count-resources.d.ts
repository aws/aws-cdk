import { Assertion, JestFriendlyAssertion } from '../assertion';
import { StackInspector } from '../inspector';
/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 */
export declare function countResources(resourceType: string, count?: number): JestFriendlyAssertion<StackInspector>;
/**
 * An assertion to check whether a resource of a given type and with the given properties exists, considering properties
 */
export declare function countResourcesLike(resourceType: string, count: number | undefined, props: any): Assertion<StackInspector>;
